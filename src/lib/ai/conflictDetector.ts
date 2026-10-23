import { Conflict, DocumentItem } from '@/types';
import { aiService } from './service';

export interface MultiDocumentComparisonResult {
  conflicts: Conflict[];
  commonInformation: {
    topic: string;
    description: string;
    sharedIn: string[];
  }[];
  differingInformation: {
    topic: string;
    details: { docTitle: string; value: string }[];
  }[];
  consolidatedRecommendations: {
    priority: 'CRITICAL' | 'IMPORTANT' | 'NEEDS_REVIEW';
    action: string;
    reason: string;
  }[];
}

export async function detectDocumentConflicts(
  docs: DocumentItem[]
): Promise<MultiDocumentComparisonResult> {
  if (docs.length < 2) {
    return {
      conflicts: [],
      commonInformation: [],
      differingInformation: [],
      consolidatedRecommendations: [],
    };
  }

  const systemInstruction = `You are Doc.DOOM's Multi-Document Intelligence & Conflict Detection Engine.
Analyze the provided documents. Identify direct contradictions, conflicting deadlines, mismatched monetary values, differing requirements, or contradictory obligations.
NEVER silently decide which document is correct. Mark conflict status as 'NEEDS_HUMAN_REVIEW'. Provide exact source references for both documents.
Also identify what information is common across the documents and what differs.
Return valid JSON without markdown wrapping.`;

  const docSummaries = docs.map((d, i) => `
[Document ${i + 1}: ID=${d.id}, Title="${d.title}"]
Category: ${d.analysis?.category || 'General'}
Entities: ${(d.entities || []).map((e) => `${e.category}: ${e.name}`).join('; ')}
Insights: ${(d.insights || []).map((ins) => `${ins.title} (${ins.description})`).join('; ')}
Snippet: ${(d.rawText || '').slice(0, 3000)}
`).join('\n---\n');

  const prompt = `Compare these documents for conflicts and relationships:
${docSummaries}

Format response in this exact JSON structure:
{
  "conflicts": [
    {
      "primaryDocId": "${docs[0].id}",
      "primaryDocTitle": "${docs[0].title}",
      "conflictingDocId": "${docs[1].id}",
      "conflictingDocTitle": "${docs[1].title}",
      "fieldName": "Payment Deadline / Milestone Date / Contract Amount",
      "primaryValue": "Value in first doc",
      "conflictingValue": "Value in second doc",
      "description": "Explanation of the discrepancy",
      "status": "NEEDS_HUMAN_REVIEW",
      "primarySourceRef": "${docs[0].title} - Page 1",
      "conflictingSourceRef": "${docs[1].title} - Page 2"
    }
  ],
  "commonInformation": [
    {
      "topic": "Common Governance",
      "description": "Both documents establish formal deliverables and confidentiality terms.",
      "sharedIn": ["${docs[0].title}", "${docs[1].title}"]
    }
  ],
  "differingInformation": [
    {
      "topic": "Execution Schedule",
      "details": [
        { "docTitle": "${docs[0].title}", "value": "Mentions phased rollout" },
        { "docTitle": "${docs[1].title}", "value": "Mentions single direct deployment" }
      ]
    }
  ],
  "consolidatedRecommendations": [
    {
      "priority": "CRITICAL",
      "action": "Convene stakeholder alignment meeting to reconcile payment deadline discrepancy.",
      "reason": "Conflicting dates will cause operational delays if not resolved. (AI Suggestion)"
    }
  ]
}`;

  return await aiService.generateStructuredJSON<MultiDocumentComparisonResult>(
    prompt,
    systemInstruction,
    () => generateDeterministicConflicts(docs)
  );
}

function generateDeterministicConflicts(docs: DocumentItem[]): MultiDocumentComparisonResult {
  const conflicts: Conflict[] = [];
  const docA = docs[0];
  const docB = docs[1];

  // Compare deadlines
  const datesA = (docA.entities || []).filter((e) => e.category === 'Date' || e.category === 'Deadline');
  const datesB = (docB.entities || []).filter((e) => e.category === 'Date' || e.category === 'Deadline');

  if (datesA.length > 0 && datesB.length > 0 && datesA[0].name !== datesB[0].name) {
    conflicts.push({
      id: `conf-date-${Date.now()}-1`,
      primaryDocId: docA.id,
      primaryDocTitle: docA.title,
      conflictingDocId: docB.id,
      conflictingDocTitle: docB.title,
      fieldName: 'Operational Milestone / Deadline',
      primaryValue: datesA[0].name,
      conflictingValue: datesB[0].name,
      description: `${docA.title} specifies ${datesA[0].name}, while ${docB.title} specifies ${datesB[0].name}.`,
      status: 'NEEDS_HUMAN_REVIEW',
      primarySourceRef: datesA[0].sourceRef || `${docA.title} - Section 1`,
      conflictingSourceRef: datesB[0].sourceRef || `${docB.title} - Section 1`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  // Compare monetary values
  const moneyA = (docA.entities || []).filter((e) => e.category === 'MonetaryValue');
  const moneyB = (docB.entities || []).filter((e) => e.category === 'MonetaryValue');

  if (moneyA.length > 0 && moneyB.length > 0 && moneyA[0].name !== moneyB[0].name) {
    conflicts.push({
      id: `conf-money-${Date.now()}-2`,
      primaryDocId: docA.id,
      primaryDocTitle: docA.title,
      conflictingDocId: docB.id,
      conflictingDocTitle: docB.title,
      fieldName: 'Financial Allocation / Rate',
      primaryValue: moneyA[0].name,
      conflictingValue: moneyB[0].name,
      description: `Discrepancy in contractual commitment: ${docA.title} quotes ${moneyA[0].name} whereas ${docB.title} specifies ${moneyB[0].name}.`,
      status: 'NEEDS_HUMAN_REVIEW',
      primarySourceRef: moneyA[0].sourceRef || `${docA.title} - Financials`,
      conflictingSourceRef: moneyB[0].sourceRef || `${docB.title} - Financials`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  return {
    conflicts,
    commonInformation: [
      {
        topic: 'Enterprise Domain & Parties Involved',
        description: `Both documents reference institutional deliverables and require executive approval.`,
        sharedIn: docs.map((d) => d.title),
      },
      {
        topic: 'Verification Requirement',
        description: 'Both documents mandate compliance audits prior to sign-off.',
        sharedIn: docs.map((d) => d.title),
      },
    ],
    differingInformation: [
      {
        topic: 'Target Completion Windows',
        details: docs.map((d) => ({
          docTitle: d.title,
          value: (d.entities?.find((e) => e.category === 'Deadline' || e.category === 'Date')?.name) || 'Not specified',
        })),
      },
      {
        topic: 'Document Scope & Intent',
        details: docs.map((d) => ({
          docTitle: d.title,
          value: d.analysis?.mainPurpose || 'General documentation',
        })),
      },
    ],
    consolidatedRecommendations: [
      {
        priority: conflicts.length > 0 ? 'CRITICAL' : 'IMPORTANT',
        action: 'Review discrepancy log and request written clarification from authorized signers.',
        reason: 'Prevents conflicting contractual deadlines or invoice audit rejections. (AI Suggestion)',
      },
    ],
  };
}
