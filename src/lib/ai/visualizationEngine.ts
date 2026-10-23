import { VisualizationConfig } from '@/types';
import { aiService } from './service';

export interface VisualizationEngineResult {
  hasVisualizationData: boolean;
  emptyStateReason?: string;
  visualizations: VisualizationConfig[];
}

export async function generateDocumentVisualizations(
  documentId: string,
  fileName: string,
  rawText: string,
  structuredData?: Record<string, any>
): Promise<VisualizationEngineResult> {
  // Check if tabular data or numeric data exists
  const hasSpreadsheet = Boolean(
    structuredData &&
    structuredData.numericColumns &&
    structuredData.numericColumns.length > 0 &&
    structuredData.sampleData &&
    structuredData.sampleData.length > 0
  );

  // Look for numbers in raw text
  const numberMatches = rawText.match(/\b\d+(?:\.\d+)?%?\b/g) || [];
  const hasNumbersInText = numberMatches.length >= 8;

  // If text is purely legal/policy and lacks quantitative metrics, return empty state immediately
  const lower = rawText.toLowerCase();
  const isPolicyOrLegalText =
    (lower.includes('policy') || lower.includes('agreement') || lower.includes('terms') || lower.includes('privacy') || lower.includes('code of conduct')) &&
    !hasSpreadsheet &&
    numberMatches.length < 10;

  if (isPolicyOrLegalText || (!hasSpreadsheet && !hasNumbersInText)) {
    return {
      hasVisualizationData: false,
      emptyStateReason: 'No meaningful visualization available for this document. This document contains qualitative text and policy guidelines without quantitative metrics or numerical series.',
      visualizations: [],
    };
  }

  // If structured spreadsheet data exists, construct direct typed visualizations
  if (hasSpreadsheet) {
    const charts = buildSpreadsheetCharts(documentId, fileName, structuredData!);
    return {
      hasVisualizationData: true,
      visualizations: charts,
    };
  }

  // If numerical text exists, try AI extraction or heuristic extraction
  const systemInstruction = `You are Doc.DOOM's Visualization Engine.
Determine whether meaningful numerical or quantitative data exists in this document.
If NO meaningful numerical data exists, output {"hasVisualizationData": false, "emptyStateReason": "No meaningful visualization available for this document.", "visualizations": []}.
If valid data exists, generate ALL supported, justifiable charts (Bar, Line, Area, Pie/Donut, KPI cards).
Each chart MUST contain real extracted data points, descriptive titles, and axis keys. Return valid JSON without markdown wrapping.`;

  const prompt = `Inspect document numbers and quantitative metrics for:
File: ${fileName}
Snippet:
"""
${rawText.slice(0, 10000)}
"""

JSON format:
{
  "hasVisualizationData": true,
  "visualizations": [
    {
      "chartType": "bar|line|pie|donut|area|kpi",
      "title": "Chart Title",
      "description": "Explaining the data representation",
      "xAxisKey": "category or time field",
      "yAxisKey": "metric name",
      "data": [
        { "name": "Q1", "value": 150 },
        { "name": "Q2", "value": 220 }
      ],
      "isSupported": true,
      "priority": 1
    }
  ]
}`;

  return await aiService.generateStructuredJSON<VisualizationEngineResult>(
    prompt,
    systemInstruction,
    () => buildTextHeuristicCharts(documentId, fileName, rawText)
  );
}

function buildSpreadsheetCharts(
  documentId: string,
  fileName: string,
  structuredData: Record<string, any>
): VisualizationConfig[] {
  const configs: VisualizationConfig[] = [];
  const rows = structuredData.sampleData || [];
  const numCols: string[] = structuredData.numericColumns || [];
  const allCols: string[] = structuredData.columns || [];

  const labelCol = allCols.find((c) => !numCols.includes(c)) || allCols[0] || 'Item';
  const primaryNumCol = numCols[0];
  const secondaryNumCol = numCols[1] || numCols[0];

  const chartData = rows.slice(0, 12).map((r: any, idx: number) => {
    const rawVal = Number(r[primaryNumCol]) || 0;
    const rawVal2 = secondaryNumCol ? Number(r[secondaryNumCol]) || 0 : 0;
    return {
      name: String(r[labelCol] || `Item ${idx + 1}`),
      [primaryNumCol]: rawVal,
      ...(secondaryNumCol !== primaryNumCol ? { [secondaryNumCol]: rawVal2 } : {}),
      value: rawVal,
    };
  });

  // 1. Bar Chart
  configs.push({
    id: `vis-${documentId}-bar-1`,
    documentId,
    chartType: 'bar',
    title: `${primaryNumCol} Distribution by ${labelCol}`,
    description: `Comparative bar chart analyzing ${primaryNumCol} performance across discrete ${labelCol} segments.`,
    xAxisKey: 'name',
    yAxisKey: primaryNumCol,
    data: chartData,
    isSupported: true,
    priority: 1,
    createdAt: new Date().toISOString(),
  });

  // 2. Line Chart / Trend
  configs.push({
    id: `vis-${documentId}-line-2`,
    documentId,
    chartType: 'line',
    title: `${primaryNumCol} Trend Analysis`,
    description: `Sequential progression of ${primaryNumCol} demonstrating trajectory and variance over records.`,
    xAxisKey: 'name',
    yAxisKey: primaryNumCol,
    data: chartData,
    isSupported: true,
    priority: 2,
    createdAt: new Date().toISOString(),
  });

  // 3. Area Chart
  configs.push({
    id: `vis-${documentId}-area-3`,
    documentId,
    chartType: 'area',
    title: `Cumulative Volume (${primaryNumCol})`,
    description: `Area density plot visualizing cumulative quantitative volume across ${labelCol}.`,
    xAxisKey: 'name',
    yAxisKey: primaryNumCol,
    data: chartData,
    isSupported: true,
    priority: 3,
    createdAt: new Date().toISOString(),
  });

  // 4. Pie / Donut Chart (top 6 proportions)
  const pieData = chartData.slice(0, 6).map((d: any) => ({
    name: d.name,
    value: Math.abs(d[primaryNumCol]),
  }));
  configs.push({
    id: `vis-${documentId}-pie-4`,
    documentId,
    chartType: 'donut',
    title: `Proportional Share of ${primaryNumCol}`,
    description: `Relative percentage allocation for the top ${pieData.length} records in ${fileName}.`,
    xAxisKey: 'name',
    yAxisKey: 'value',
    data: pieData,
    isSupported: true,
    priority: 4,
    createdAt: new Date().toISOString(),
  });

  // 5. KPI Cards
  const totalVal = rows.reduce((acc: number, r: any) => acc + (Number(r[primaryNumCol]) || 0), 0);
  const avgVal = rows.length ? Math.round((totalVal / rows.length) * 10) / 10 : 0;
  const maxVal = Math.max(...rows.map((r: any) => Number(r[primaryNumCol]) || 0));

  configs.push({
    id: `vis-${documentId}-kpi-5`,
    documentId,
    chartType: 'kpi',
    title: 'Executive KPI Metrics',
    description: `Consolidated quantitative metrics for ${fileName}`,
    data: [
      { name: `Total ${primaryNumCol}`, value: totalVal.toLocaleString() },
      { name: `Average per ${labelCol}`, value: avgVal.toLocaleString() },
      { name: `Peak Maximum`, value: maxVal.toLocaleString() },
      { name: `Dataset Rows`, value: rows.length.toLocaleString() },
    ],
    isSupported: true,
    priority: 5,
    createdAt: new Date().toISOString(),
  });

  return configs;
}

function buildTextHeuristicCharts(
  documentId: string,
  fileName: string,
  rawText: string
): VisualizationEngineResult {
  const moneyMatches = rawText.match(/\$?\b\d{1,3}(?:,\d{3})*(?:\.\d{2})?\b/g) || [];
  const numbers = moneyMatches
    .map((m) => Number(m.replace(/[^0-9.]/g, '')))
    .filter((n) => !isNaN(n) && n > 0 && n < 10000000);

  if (numbers.length < 3) {
    return {
      hasVisualizationData: false,
      emptyStateReason: 'No meaningful visualization available for this document. The extracted text lacks structured numerical series or metric tables.',
      visualizations: [],
    };
  }

  const sampleMetrics = numbers.slice(0, 6).map((num, i) => ({
    name: `Metric ${i + 1}`,
    value: num,
  }));

  const vis: VisualizationConfig[] = [
    {
      id: `vis-text-${documentId}-1`,
      documentId,
      chartType: 'bar',
      title: 'Identified Financial / Numerical Indicators',
      description: `Comparative values extracted from ${fileName}`,
      xAxisKey: 'name',
      yAxisKey: 'value',
      data: sampleMetrics,
      isSupported: true,
      priority: 1,
      createdAt: new Date().toISOString(),
    },
    {
      id: `vis-text-${documentId}-2`,
      documentId,
      chartType: 'donut',
      title: 'Numerical Breakdown Distribution',
      description: `Proportional division of parsed values`,
      xAxisKey: 'name',
      yAxisKey: 'value',
      data: sampleMetrics,
      isSupported: true,
      priority: 2,
      createdAt: new Date().toISOString(),
    },
  ];

  return {
    hasVisualizationData: true,
    visualizations: vis,
  };
}
