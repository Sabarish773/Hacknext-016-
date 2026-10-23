export type DocumentStatus = 'UPLOADING' | 'PROCESSING' | 'ANALYSING' | 'COMPLETED' | 'FAILED';

export type PriorityLevel = 'CRITICAL' | 'IMPORTANT' | 'NEEDS_REVIEW' | 'INFORMATIONAL';

export type MissingStatus = 'EXPLICITLY_MISSING' | 'NOT_FOUND' | 'POSSIBLY_MISSING' | 'NOT_APPLICABLE';

export type ConflictStatus = 'NEEDS_HUMAN_REVIEW' | 'RESOLVED' | 'DISMISSED';

export type EntityCategory =
  | 'Person'
  | 'Organization'
  | 'Location'
  | 'Date'
  | 'MonetaryValue'
  | 'Product'
  | 'Project'
  | 'Department'
  | 'Deadline'
  | 'Requirement'
  | 'Other';

export interface UserProfile {
  id: string;
  userId: string;
  school?: string | null;
  college?: string | null;
  degree?: string | null;
  currentStatus?: string | null;
  company?: string | null;
  role?: string | null;
  location?: string | null;
  bio?: string | null;
  dob?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  profile?: UserProfile | null;
}

export interface DocumentAnalysis {
  id: string;
  documentId: string;
  category: string;
  shortSummary: string;
  detailedSummary: string;
  mainPurpose: string;
  keyTopics: string[]; // parsed array
  confidenceScore: number;
  language: string;
  wordCount: number;
  processingDurationMs: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ExtractedEntity {
  id: string;
  documentId: string;
  category: EntityCategory;
  name: string;
  context?: string | null;
  sourceRef?: string | null;
  createdAt: string;
}

export interface Insight {
  id: string;
  documentId: string;
  title: string;
  description: string;
  priority: PriorityLevel;
  category: string;
  sourceRef?: string | null;
  isActionable: boolean;
  recommendedAction?: string | null;
  createdAt: string;
}

export interface MissingInformation {
  id: string;
  documentId: string;
  itemName: string;
  category: string;
  status: MissingStatus;
  reason: string;
  evidence?: string | null;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  createdAt: string;
}

export interface Conflict {
  id: string;
  primaryDocId: string;
  primaryDocTitle?: string;
  conflictingDocId: string;
  conflictingDocTitle?: string;
  fieldName: string;
  primaryValue: string;
  conflictingValue: string;
  description: string;
  status: ConflictStatus;
  primarySourceRef?: string | null;
  conflictingSourceRef?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VisualizationConfig {
  id: string;
  documentId: string;
  chartType: 'bar' | 'line' | 'pie' | 'donut' | 'area' | 'histogram' | 'kpi' | 'comparison';
  title: string;
  description?: string | null;
  xAxisKey?: string | null;
  yAxisKey?: string | null;
  data: Record<string, any>[];
  isSupported: boolean;
  priority: number;
  createdAt: string;
}

export interface DocumentItem {
  id: string;
  userId: string;
  docNumber?: number; // 1-based index in user's library
  title: string;
  originalName: string;
  mimeType: string;
  fileSizeBytes: number;
  storagePath: string;
  fileHash?: string | null;
  status: DocumentStatus;
  errorMessage?: string | null;
  rawText?: string | null;
  pageCount?: number;
  createdAt: string;
  updatedAt: string;
  analysis?: DocumentAnalysis | null;
  entities?: ExtractedEntity[];
  insights?: Insight[];
  missingInformation?: MissingInformation[];
  visualizations?: VisualizationConfig[];
}

export interface HighlightColorSettings {
  critical: string;
  important: string;
  warning: string;
  missing: string;
  conflict: string;
  deadline: string;
  informational: string;
}

export interface UserSettings {
  id: string;
  userId: string;
  theme: string;
  emailNotifications: boolean;
  autoAnalyze: boolean;
  defaultModel: string;
  highlights: HighlightColorSettings;
}

export interface ChatSourceCitation {
  docId?: string;
  docTitle: string;
  sourceRef: string;
  snippet: string;
}

export interface ChatMessage {
  id: string;
  sessionId?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  sources?: ChatSourceCitation[];
  createdAt: string;
}

export interface DashboardStats {
  totalDocuments: number;
  documentsProcessed: number;
  documentsNeedingReview: number;
  missingInformationCount: number;
  potentialConflicts: number;
  upcomingDeadlines: {
    docId: string;
    docTitle: string;
    deadline: string;
    description: string;
    sourceRef: string;
  }[];
  recentDocuments: DocumentItem[];
  recentActivities: {
    id: string;
    action: string;
    docTitle: string;
    timestamp: string;
    type: 'upload' | 'analysis' | 'conflict' | 'chat';
  }[];
}
