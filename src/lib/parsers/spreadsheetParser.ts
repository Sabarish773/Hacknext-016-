import * as XLSX from 'xlsx';
import Papa from 'papaparse';

export interface ParsedSpreadsheetResult {
  text: string;
  pageCount: number;
  sheetNames: string[];
  totalRows: number;
  columns: string[];
  sampleData: Record<string, any>[];
  numericColumns: string[];
}

export function parseSpreadsheet(buffer: Buffer, fileName: string): ParsedSpreadsheetResult {
  try {
    const ext = fileName.toLowerCase().split('.').pop() || '';

    if (ext === 'csv') {
      const csvString = buffer.toString('utf-8');
      const parsed = Papa.parse(csvString, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
      });

      const rows = (parsed.data as Record<string, any>[]) || [];
      const columns = parsed.meta.fields || [];

      // Detect numeric columns
      const numericColumns = columns.filter((col) => {
        const values = rows.slice(0, 20).map((r) => r[col]);
        return values.some((v) => typeof v === 'number' && !isNaN(v));
      });

      // Build readable summary text for AI analysis
      let textRepresentation = `Spreadsheet Document: ${fileName}\nFormat: CSV\nTotal Records: ${rows.length}\nColumns: ${columns.join(', ')}\n\n`;
      textRepresentation += `Sample Data (First 10 rows):\n`;
      rows.slice(0, 10).forEach((row, i) => {
        textRepresentation += `Row ${i + 1}: ` + Object.entries(row).map(([k, v]) => `${k}=${v}`).join(' | ') + '\n';
      });

      return {
        text: textRepresentation,
        pageCount: Math.max(1, Math.ceil(rows.length / 50)),
        sheetNames: ['DefaultSheet'],
        totalRows: rows.length,
        columns,
        sampleData: rows.slice(0, 50),
        numericColumns,
      };
    }

    // XLS / XLSX
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetNames = workbook.SheetNames;
    let fullText = `Spreadsheet Document: ${fileName}\nSheets: ${sheetNames.join(', ')}\n\n`;
    let totalRows = 0;
    let allColumns: string[] = [];
    let allData: Record<string, any>[] = [];

    sheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);
      totalRows += jsonData.length;

      if (jsonData.length > 0) {
        const sheetCols = Object.keys(jsonData[0]);
        allColumns = Array.from(new Set([...allColumns, ...sheetCols]));
        allData = allData.concat(jsonData.slice(0, 30));

        fullText += `--- Sheet: ${sheetName} (${jsonData.length} rows) ---\n`;
        fullText += `Columns: ${sheetCols.join(', ')}\n`;
        jsonData.slice(0, 10).forEach((row, idx) => {
          fullText += `[${sheetName}] Row ${idx + 1}: ` + Object.entries(row).map(([k, v]) => `${k}=${v}`).join(' | ') + '\n';
        });
        fullText += '\n';
      }
    });

    const numericColumns = allColumns.filter((col) => {
      const values = allData.slice(0, 30).map((r) => r[col]);
      return values.some((v) => typeof v === 'number' && !isNaN(v));
    });

    return {
      text: fullText,
      pageCount: Math.max(1, Math.ceil(totalRows / 50)),
      sheetNames,
      totalRows,
      columns: allColumns,
      sampleData: allData.slice(0, 50),
      numericColumns,
    };
  } catch (err: any) {
    console.error('Spreadsheet parsing error:', err);
    throw new Error(`Failed to parse spreadsheet: ${err.message || 'Corrupted CSV or Excel file'}`);
  }
}
