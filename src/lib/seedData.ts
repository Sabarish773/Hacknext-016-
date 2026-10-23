import { DocumentItem, Conflict } from '@/types';

export function getSeedDocuments(userId: string = 'user-default-1'): {
  documents: DocumentItem[];
  conflicts: Conflict[];
} {
  const doc1Id = 'doc-seed-1';
  const doc2Id = 'doc-seed-2';
  const doc3Id = 'doc-seed-3';
  const doc4Id = 'doc-seed-4';

  const doc1: DocumentItem = {
    id: doc1Id,
    userId,
    docNumber: 1,
    title: 'Sales_Performance_Q4',
    originalName: 'Sales_Performance_Q4.csv',
    mimeType: 'text/csv',
    fileSizeBytes: 24500,
    storagePath: '/uploads/Sales_Performance_Q4.csv',
    status: 'COMPLETED',
    rawText: `Enterprise Sales Report: Q4 Fiscal Performance
Region, Product, Q3_Revenue, Q4_Revenue, Units_Sold, Margin_Percentage
North America, Enterprise Cloud Suite, 450000, 620000, 140, 42
Europe, Enterprise Cloud Suite, 380000, 490000, 115, 38
Asia Pacific, AI Intelligence Add-on, 210000, 390000, 240, 55
Latin America, AI Intelligence Add-on, 95000, 140000, 85, 48
North America, Security Sentinel, 310000, 420000, 95, 51
Europe, Security Sentinel, 280000, 360000, 80, 49
Summary Total: Q4 Total Revenue = $2,420,000 across 755 enterprise licenses.`,
    pageCount: 1,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    analysis: {
      id: `analysis-${doc1Id}`,
      documentId: doc1Id,
      category: 'Performance Report',
      shortSummary: 'Q4 regional sales report recording $2,420,000 in total revenue led by North America and Cloud Suite products.',
      detailedSummary: 'The Q4 sales ledger reveals significant momentum across enterprise subscriptions. Revenue expanded by 34% quarter-over-quarter, driven by high-margin AI Intelligence Add-ons (55% gross margin in APAC) and robust enterprise software renewals in North America.',
      mainPurpose: 'Evaluate quarterly product revenue, regional distribution, and gross margin efficiency for executive board review.',
      keyTopics: ['Q4 Revenue Growth', 'Regional Sales Velocity', 'Product Gross Margins', 'Enterprise Software Licenses'],
      confidenceScore: 0.98,
      language: 'en',
      wordCount: 125,
      processingDurationMs: 640,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    entities: [
      { id: 'e1-1', documentId: doc1Id, category: 'MonetaryValue', name: '$2,420,000', context: 'Total Q4 Enterprise Revenue', sourceRef: 'Sales_Performance_Q4.csv - Summary Line', createdAt: new Date().toISOString() },
      { id: 'e1-2', documentId: doc1Id, category: 'Location', name: 'North America', context: 'Top performing sales territory', sourceRef: 'Sales_Performance_Q4.csv - Row 1', createdAt: new Date().toISOString() },
      { id: 'e1-3', documentId: doc1Id, category: 'Product', name: 'Enterprise Cloud Suite', context: 'Leading revenue contributing software package', sourceRef: 'Sales_Performance_Q4.csv - Row 1', createdAt: new Date().toISOString() },
      { id: 'e1-4', documentId: doc1Id, category: 'Product', name: 'AI Intelligence Add-on', context: 'Highest margin tier (55% APAC)', sourceRef: 'Sales_Performance_Q4.csv - Row 3', createdAt: new Date().toISOString() },
      { id: 'e1-5', documentId: doc1Id, category: 'MonetaryValue', name: '$620,000', context: 'Peak single-region product revenue (NA Cloud Suite)', sourceRef: 'Sales_Performance_Q4.csv - Row 1', createdAt: new Date().toISOString() },
    ],
    insights: [
      {
        id: 'ins1-1',
        documentId: doc1Id,
        title: 'Strong Revenue Expansion: $2.42M',
        description: 'Quarterly growth surpassed baseline projections by 18%, powered by AI Add-on expansion.',
        priority: 'INFORMATIONAL',
        category: 'Financial',
        sourceRef: 'Sales_Performance_Q4.csv - Row 7',
        isActionable: true,
        recommendedAction: 'Reallocate 15% of APAC sales headcount to expand AI Add-on outbound campaigns. (AI Suggestion)',
        createdAt: new Date().toISOString(),
      },
    ],
    missingInformation: [
      {
        id: 'm1-1',
        documentId: doc1Id,
        itemName: 'Direct Customer Acquisition Cost (CAC)',
        category: 'Financial Analytics',
        status: 'NOT_FOUND',
        reason: 'Sales ledger lists gross revenue and margins without marketing or sales rep commission deductions.',
        evidence: 'Column set restricted to Revenue, Units Sold, and Margin Percentage.',
        severity: 'MEDIUM',
        createdAt: new Date().toISOString(),
      },
    ],
    visualizations: [
      {
        id: 'vis1-bar',
        documentId: doc1Id,
        chartType: 'bar',
        title: 'Q4 Revenue by Region & Product Tier',
        description: 'Comparative revenue contributions across core operating markets.',
        xAxisKey: 'name',
        yAxisKey: 'revenue',
        data: [
          { name: 'NA Cloud', revenue: 620000, value: 620000 },
          { name: 'EU Cloud', revenue: 490000, value: 490000 },
          { name: 'NA Security', revenue: 420000, value: 420000 },
          { name: 'APAC AI', revenue: 390000, value: 390000 },
          { name: 'EU Security', revenue: 360000, value: 360000 },
          { name: 'LATAM AI', revenue: 140000, value: 140000 },
        ],
        isSupported: true,
        priority: 1,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'vis1-line',
        documentId: doc1Id,
        chartType: 'line',
        title: 'Quarter-over-Quarter Growth Trajectory (Q3 vs Q4)',
        description: 'Tracking trajectory from Q3 baseline to Q4 performance.',
        xAxisKey: 'name',
        yAxisKey: 'Q4',
        data: [
          { name: 'NA Cloud', Q3: 450000, Q4: 620000, value: 620000 },
          { name: 'EU Cloud', Q3: 380000, Q4: 490000, value: 490000 },
          { name: 'APAC AI', Q3: 210000, Q4: 390000, value: 390000 },
          { name: 'LATAM AI', Q3: 95000, Q4: 140000, value: 140000 },
          { name: 'NA Security', Q3: 310000, Q4: 420000, value: 420000 },
          { name: 'EU Security', Q3: 280000, Q4: 360000, value: 360000 },
        ],
        isSupported: true,
        priority: 2,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'vis1-donut',
        documentId: doc1Id,
        chartType: 'donut',
        title: 'Regional Revenue Share Proportions',
        description: 'Percentage distribution of gross Q4 revenues.',
        xAxisKey: 'name',
        yAxisKey: 'value',
        data: [
          { name: 'North America', value: 1040000 },
          { name: 'Europe', value: 850000 },
          { name: 'Asia Pacific', value: 390000 },
          { name: 'Latin America', value: 140000 },
        ],
        isSupported: true,
        priority: 3,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'vis1-kpi',
        documentId: doc1Id,
        chartType: 'kpi',
        title: 'Q4 Commercial Executive KPIs',
        description: 'Summary financial benchmarks',
        data: [
          { name: 'Total Revenue', value: '$2,420,000' },
          { name: 'Total Units Sold', value: '755' },
          { name: 'Average Deal Size', value: '$3,205' },
          { name: 'Peak Margin Tier', value: '55% (APAC)' },
        ],
        isSupported: true,
        priority: 4,
        createdAt: new Date().toISOString(),
      },
    ],
  };

  const doc2: DocumentItem = {
    id: doc2Id,
    userId,
    docNumber: 2,
    title: 'Vendor_Service_Agreement_Acme',
    originalName: 'Vendor_Service_Agreement_Acme.pdf',
    mimeType: 'application/pdf',
    fileSizeBytes: 185000,
    storagePath: '/uploads/Vendor_Service_Agreement_Acme.pdf',
    status: 'COMPLETED',
    rawText: `MASTER SERVICES AGREEMENT
Parties: Doc.DOOM Enterprise Inc. ("Client") and Acme Logistics Corp ("Vendor")
Effective Date: September 01, 2026
Term: 12 months with mutual renewal option.

Section 4.1: Financial Remuneration and Billing Terms
Total Contract Amount: $45,000 USD payable in quarterly tranches.
Payment Deadline: October 12, 2026.
Payment Method: Wire transfer to Vendor designated escrow account.

Section 6.2: Service Level Agreement (SLA)
Vendor guarantees 99.9% uptime for cloud synchronization services. Late response penalty: 2% credit per 30 minutes downtime.

Section 8.0: Signatures and Attachments
Authorized Signer (Client): Dr. Sarah Jenkins, VP Operations
Authorized Signer (Vendor): Marcus Vance, Commercial Director
Note: Technical Scope of Work detailed in Exhibit Annex B.`,
    pageCount: 3,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    analysis: {
      id: `analysis-${doc2Id}`,
      documentId: doc2Id,
      category: 'Legal Agreement',
      shortSummary: 'Master services agreement contracting Acme Logistics for cloud infrastructure support at $45,000 with payment due October 12.',
      detailedSummary: 'A 12-month master services contract between Doc.DOOM Enterprise Inc. and Acme Logistics Corp. Sets payment obligation of $45,000 USD with a strict payment deadline of October 12, 2026. Mandates a 99.9% uptime SLA with financial service credit penalties.',
      mainPurpose: 'Establish legally binding terms of service, payment schedules, and performance standards with Acme Logistics.',
      keyTopics: ['Master Service Agreement', 'October 12 Payment Deadline', '$45,000 Fee', 'SLA Penalties'],
      confidenceScore: 0.97,
      language: 'en',
      wordCount: 140,
      processingDurationMs: 820,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    entities: [
      { id: 'e2-1', documentId: doc2Id, category: 'Organization', name: 'Acme Logistics Corp', context: 'Designated vendor providing infrastructure services', sourceRef: 'Vendor_Service_Agreement_Acme.pdf - Page 1', createdAt: new Date().toISOString() },
      { id: 'e2-2', documentId: doc2Id, category: 'MonetaryValue', name: '$45,000 USD', context: 'Fixed annual contractual fee', sourceRef: 'Vendor_Service_Agreement_Acme.pdf - Section 4.1', createdAt: new Date().toISOString() },
      { id: 'e2-3', documentId: doc2Id, category: 'Deadline', name: 'October 12, 2026', context: 'Mandatory invoice payment deadline', sourceRef: 'Vendor_Service_Agreement_Acme.pdf - Section 4.1', createdAt: new Date().toISOString() },
      { id: 'e2-4', documentId: doc2Id, category: 'Person', name: 'Dr. Sarah Jenkins', context: 'Client VP Operations authorized signatory', sourceRef: 'Vendor_Service_Agreement_Acme.pdf - Section 8.0', createdAt: new Date().toISOString() },
      { id: 'e2-5', documentId: doc2Id, category: 'Person', name: 'Marcus Vance', context: 'Vendor Commercial Director', sourceRef: 'Vendor_Service_Agreement_Acme.pdf - Section 8.0', createdAt: new Date().toISOString() },
    ],
    insights: [
      {
        id: 'ins2-1',
        documentId: doc2Id,
        title: 'Payment Deadline: October 12, 2026',
        description: 'First quarterly disbursement under Acme Logistics contract must be executed by October 12, 2026.',
        priority: 'CRITICAL',
        category: 'Deadline',
        sourceRef: 'Vendor_Service_Agreement_Acme.pdf - Section 4.1',
        isActionable: true,
        recommendedAction: 'Verify invoice matching against purchase order before disbursement on October 12. (AI Suggestion)',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'ins2-2',
        documentId: doc2Id,
        title: 'Contractual Obligation: $45,000 USD',
        description: 'Total fee committed across 12-month period with quarterly installments.',
        priority: 'IMPORTANT',
        category: 'Financial',
        sourceRef: 'Vendor_Service_Agreement_Acme.pdf - Section 4.1',
        isActionable: true,
        recommendedAction: 'Log in accounts payable ledger for Q4 treasury forecasting. (AI Suggestion)',
        createdAt: new Date().toISOString(),
      },
    ],
    missingInformation: [
      {
        id: 'm2-1',
        documentId: doc2Id,
        itemName: 'Exhibit Annex B (Technical Scope of Work)',
        category: 'Supporting Document',
        status: 'EXPLICITLY_MISSING',
        reason: 'Section 8.0 references Exhibit Annex B for technical deliverables, but the attachment is missing from the submitted agreement.',
        evidence: 'Clause 8.0 states: "Technical Scope of Work detailed in Exhibit Annex B", yet document concludes without annexed schedule.',
        severity: 'HIGH',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'm2-2',
        documentId: doc2Id,
        itemName: 'Governing Law and Dispute Jurisdiction',
        category: 'Legal / Compliance',
        status: 'NOT_FOUND',
        reason: 'The agreement lacks a designated state or federal court jurisdiction clause for legal dispute arbitration.',
        evidence: 'Zero mentions of state venue (e.g. Delaware, California, New York) or arbitration body.',
        severity: 'MEDIUM',
        createdAt: new Date().toISOString(),
      },
    ],
    visualizations: [], // Legal agreement without numerical time series -> correctly triggers empty state!
  };

  const doc3: DocumentItem = {
    id: doc3Id,
    userId,
    docNumber: 3,
    title: 'Procurement_Purchase_Order_PO8821',
    originalName: 'Procurement_Purchase_Order_PO8821.docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSizeBytes: 42000,
    storagePath: '/uploads/Procurement_Purchase_Order_PO8821.docx',
    status: 'COMPLETED',
    rawText: `ENTERPRISE PURCHASE ORDER
PO Number: PO-8821
Vendor: Acme Logistics Corp
Associated Reference: Master Agreement Services 2026

Order Line Items:
1. Enterprise Cloud Infrastructure Provisioning: $40,000
2. Accelerated Support & SLA Premium: $12,000
Total Purchase Order Amount: $52,000 USD

Payment Schedule:
Payment Deadline: October 15, 2026 (Extended Net-45 Terms)
Payment Status: Pending Finance Director Approval
Deliverable Check: Mandatory QA sign-off prior to electronic transfer.`,
    pageCount: 1,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    analysis: {
      id: `analysis-${doc3Id}`,
      documentId: doc3Id,
      category: 'Procurement Order',
      shortSummary: 'Purchase Order PO-8821 for Acme Logistics totaling $52,000 with payment scheduled for October 15.',
      detailedSummary: 'Official procurement record authorizing $52,000 in expenditures with Acme Logistics Corp ($40,000 base infrastructure + $12,000 SLA premium). Sets payment deadline for October 15, 2026 citing Net-45 terms.',
      mainPurpose: 'Authorize purchase order disbursement and define payment release terms for Acme Logistics services.',
      keyTopics: ['Purchase Order PO-8821', 'October 15 Deadline', '$52,000 Total Allocation', 'Net-45 Terms'],
      confidenceScore: 0.96,
      language: 'en',
      wordCount: 78,
      processingDurationMs: 510,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    entities: [
      { id: 'e3-1', documentId: doc3Id, category: 'Organization', name: 'Acme Logistics Corp', context: 'Procurement beneficiary', sourceRef: 'Procurement_Purchase_Order_PO8821.docx - Header', createdAt: new Date().toISOString() },
      { id: 'e3-2', documentId: doc3Id, category: 'Deadline', name: 'October 15, 2026', context: 'Designated purchase order payment deadline', sourceRef: 'Procurement_Purchase_Order_PO8821.docx - Payment Terms', createdAt: new Date().toISOString() },
      { id: 'e3-3', documentId: doc3Id, category: 'MonetaryValue', name: '$52,000 USD', context: 'Total PO value including SLA add-on', sourceRef: 'Procurement_Purchase_Order_PO8821.docx - Line Items', createdAt: new Date().toISOString() },
    ],
    insights: [
      {
        id: 'ins3-1',
        documentId: doc3Id,
        title: 'Payment Scheduled: October 15, 2026',
        description: 'PO indicates payment release date of October 15, 2026 under Net-45 extended terms.',
        priority: 'IMPORTANT',
        category: 'Deadline',
        sourceRef: 'Procurement_Purchase_Order_PO8821.docx - Terms',
        isActionable: true,
        recommendedAction: 'Reconcile against Vendor Agreement which stated October 12. (AI Suggestion)',
        createdAt: new Date().toISOString(),
      },
    ],
    missingInformation: [],
    visualizations: [],
  };

  const doc4: DocumentItem = {
    id: doc4Id,
    userId,
    docNumber: 4,
    title: 'Enterprise_Security_Compliance_Policy',
    originalName: 'Enterprise_Security_Compliance_Policy.txt',
    mimeType: 'text/plain',
    fileSizeBytes: 12000,
    storagePath: '/uploads/Enterprise_Security_Compliance_Policy.txt',
    status: 'COMPLETED',
    rawText: `ENTERPRISE SECURITY & INFORMATION GOVERNANCE POLICY
Document Code: SEC-POL-2026-v2
Classification: Internal Enterprise Only

1. Purpose & Scope
This policy mandates stringent access control, role-based encryption, and confidential data storage protocols for all enterprise documents handled by Doc.DOOM systems.

2. Access Control Principles
- Principle of Least Privilege: Every user account is isolated via PostgreSQL Row Level Security (RLS).
- Document data belonging to User A must never be accessible, queryable, or retrievable by User B.
- Dual-key authorization is mandatory for cross-repository audit workflows.

3. Retention and Sanitization
- All deleted documents must have their physical storage files unlinked and purged immediately.
- Database records including entities, analysis, and vector indices must be permanently removed upon deletion.
- Audit logs are retained for compliance verification.`,
    pageCount: 2,
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    analysis: {
      id: `analysis-${doc4Id}`,
      documentId: doc4Id,
      category: 'Enterprise Policy',
      shortSummary: 'Internal enterprise security policy mandating strict user data isolation, RLS enforcement, and permanent document deletion rules.',
      detailedSummary: 'Outlines governance principles for institutional data handling. Enforces tenant isolation where documents belonging to one user can never be queried by another. Details physical storage unlinking and atomic database record purging.',
      mainPurpose: 'Establish mandatory security, privacy, and data isolation protocols across all enterprise applications.',
      keyTopics: ['User Data Isolation', 'Row Level Security', 'Document Purging Standards', 'Least Privilege'],
      confidenceScore: 0.99,
      language: 'en',
      wordCount: 165,
      processingDurationMs: 480,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    entities: [
      { id: 'e4-1', documentId: doc4Id, category: 'Requirement', name: 'Row Level Security (RLS)', context: 'Mandatory data isolation protocol', sourceRef: 'Enterprise_Security_Compliance_Policy.txt - Section 2', createdAt: new Date().toISOString() },
      { id: 'e4-2', documentId: doc4Id, category: 'Requirement', name: 'Permanent Document Deletion', context: 'Atomic purge of storage files and database rows', sourceRef: 'Enterprise_Security_Compliance_Policy.txt - Section 3', createdAt: new Date().toISOString() },
    ],
    insights: [
      {
        id: 'ins4-1',
        documentId: doc4Id,
        title: 'Mandatory User Isolation Compliance',
        description: 'System architecture must guarantee zero cross-tenant document leakage via RLS and ownership guards.',
        priority: 'CRITICAL',
        category: 'Rule',
        sourceRef: 'Enterprise_Security_Compliance_Policy.txt - Section 2',
        isActionable: true,
        recommendedAction: 'Conduct automated test suite verifying unauthorized cross-user queries return 404 or 403. (AI Suggestion)',
        createdAt: new Date().toISOString(),
      },
    ],
    missingInformation: [],
    visualizations: [], // Policy document with no numerical data -> correctly triggers the required empty state!
  };

  // Seeded Conflict between Document 2 and Document 3
  const conflict1: Conflict = {
    id: 'conf-seed-1',
    primaryDocId: doc2Id,
    primaryDocTitle: doc2.title,
    conflictingDocId: doc3Id,
    conflictingDocTitle: doc3.title,
    fieldName: 'Payment Deadline',
    primaryValue: 'October 12, 2026',
    conflictingValue: 'October 15, 2026',
    description: 'Document 2 (Vendor Agreement) stipulates payment due on October 12, 2026, whereas Document 3 (Purchase Order PO-8821) specifies payment deadline of October 15, 2026 (Net-45 terms).',
    status: 'NEEDS_HUMAN_REVIEW',
    primarySourceRef: 'Vendor_Service_Agreement_Acme.pdf - Section 4.1',
    conflictingSourceRef: 'Procurement_Purchase_Order_PO8821.docx - Payment Terms',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const conflict2: Conflict = {
    id: 'conf-seed-2',
    primaryDocId: doc2Id,
    primaryDocTitle: doc2.title,
    conflictingDocId: doc3Id,
    conflictingDocTitle: doc3.title,
    fieldName: 'Contractual Amount Commitment',
    primaryValue: '$45,000 USD',
    conflictingValue: '$52,000 USD',
    description: 'Vendor Master Agreement fixes annual fee at $45,000, but Purchase Order PO-8821 allocates $52,000 ($7,000 variance due to added SLA premium line item).',
    status: 'NEEDS_HUMAN_REVIEW',
    primarySourceRef: 'Vendor_Service_Agreement_Acme.pdf - Section 4.1',
    conflictingSourceRef: 'Procurement_Purchase_Order_PO8821.docx - Line Items',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return {
    documents: [doc1, doc2, doc3, doc4],
    conflicts: [conflict1, conflict2],
  };
}
