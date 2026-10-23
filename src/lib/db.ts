import fs from 'fs';
import path from 'path';
import {
  User,
  UserProfile,
  DocumentItem,
  DocumentAnalysis,
  ExtractedEntity,
  Insight,
  MissingInformation,
  Conflict,
  VisualizationConfig,
  UserSettings,
  HighlightColorSettings,
  ChatMessage,
  DashboardStats,
} from '@/types';

// Path for local resilient fallback storage
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'docdoom-db.json');

interface LocalDatabaseState {
  users: User[];
  profiles: UserProfile[];
  documents: DocumentItem[];
  settings: Record<string, UserSettings>;
  conflicts: Conflict[];
  chatMessages: Record<string, ChatMessage[]>; // keyed by sessionId or docId
}

const DEFAULT_HIGHLIGHTS: HighlightColorSettings = {
  critical: '#ef4444',     // Red
  important: '#f97316',    // Orange
  warning: '#eab308',      // Amber
  missing: '#a855f7',      // Purple
  conflict: '#ec4899',     // Pink
  deadline: '#3b82f6',     // Blue
  informational: '#10b981',// Green
};

import { getSeedDocuments } from './seedData';

// Ensure data directory exists
function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Read database file
function readLocalDb(): LocalDatabaseState {
  ensureDataDir();
  if (!fs.existsSync(DB_FILE)) {
    const defaultUserId = 'user-default-1';
    const seed = getSeedDocuments(defaultUserId);

    const initialState: LocalDatabaseState = {
      users: [
        {
          id: defaultUserId,
          email: 'demo@docdoom.enterprise',
          name: 'Chief Information Officer',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      profiles: [
        {
          id: 'profile-default-1',
          userId: defaultUserId,
          school: 'St. Xavier Higher Secondary School',
          college: 'National Institute of Technology',
          degree: 'B.Tech in Computer Science & Engineering',
          currentStatus: 'employed',
          company: 'Acme Enterprise Solutions',
          role: 'Lead AI Architect',
          location: 'San Francisco, CA / Bengaluru, IN',
          bio: 'Building enterprise intelligence systems that transform unstructured documents into actionable decisions.',
          dob: '1998-05-14',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      documents: seed.documents,
      settings: {
        [defaultUserId]: {
          id: `settings-${defaultUserId}`,
          userId: defaultUserId,
          theme: 'dark',
          emailNotifications: true,
          autoAnalyze: true,
          defaultModel: 'gemini-2.5-flash',
          highlights: { ...DEFAULT_HIGHLIGHTS },
        },
      },
      conflicts: seed.conflicts,
      chatMessages: {},
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialState, null, 2), 'utf-8');
    return initialState;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local db, initializing clean state:', err);
    return {
      users: [],
      profiles: [],
      documents: [],
      settings: {},
      conflicts: [],
      chatMessages: {},
    };
  }
}

// Write to database file atomically
function writeLocalDb(state: LocalDatabaseState): void {
  ensureDataDir();
  const tempFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(state, null, 2), 'utf-8');
  fs.renameSync(tempFile, DB_FILE);
}

export const db = {
  // USER & PROFILE
  async getUser(id: string): Promise<User | null> {
    const state = readLocalDb();
    const user = state.users.find((u) => u.id === id) || null;
    if (user) {
      user.profile = state.profiles.find((p) => p.userId === id) || null;
    }
    return user;
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const state = readLocalDb();
    const user = state.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
    if (user) {
      user.profile = state.profiles.find((p) => p.userId === user.id) || null;
    }
    return user;
  },

  async upsertUser(user: { id: string; email: string; name?: string | null; avatarUrl?: string | null }): Promise<User> {
    const state = readLocalDb();
    const existingIndex = state.users.findIndex((u) => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
    const now = new Date().toISOString();

    let savedUser: User;
    if (existingIndex >= 0) {
      state.users[existingIndex] = {
        ...state.users[existingIndex],
        ...user,
        updatedAt: now,
      };
      savedUser = state.users[existingIndex];
    } else {
      savedUser = {
        id: user.id,
        email: user.email,
        name: user.name || user.email.split('@')[0],
        avatarUrl: user.avatarUrl || null,
        createdAt: now,
        updatedAt: now,
      };
      state.users.push(savedUser);

      // Create default settings
      state.settings[user.id] = {
        id: `settings-${user.id}`,
        userId: user.id,
        theme: 'dark',
        emailNotifications: true,
        autoAnalyze: true,
        defaultModel: 'gemini-2.5-flash',
        highlights: { ...DEFAULT_HIGHLIGHTS },
      };
    }
    writeLocalDb(state);
    return savedUser;
  },

  async updateProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
    const state = readLocalDb();
    const now = new Date().toISOString();
    const index = state.profiles.findIndex((p) => p.userId === userId);

    let updated: UserProfile;
    if (index >= 0) {
      state.profiles[index] = {
        ...state.profiles[index],
        ...profileData,
        updatedAt: now,
      };
      updated = state.profiles[index];
    } else {
      updated = {
        id: `profile-${Date.now()}`,
        userId,
        school: profileData.school || null,
        college: profileData.college || null,
        degree: profileData.degree || null,
        currentStatus: profileData.currentStatus || 'student',
        company: profileData.company || null,
        role: profileData.role || null,
        location: profileData.location || null,
        bio: profileData.bio || null,
        dob: profileData.dob || null,
        createdAt: now,
        updatedAt: now,
      };
      state.profiles.push(updated);
    }
    writeLocalDb(state);
    return updated;
  },

  // SETTINGS & HIGHLIGHTS
  async getUserSettings(userId: string): Promise<UserSettings> {
    const state = readLocalDb();
    if (!state.settings[userId]) {
      state.settings[userId] = {
        id: `settings-${userId}`,
        userId,
        theme: 'dark',
        emailNotifications: true,
        autoAnalyze: true,
        defaultModel: 'gemini-2.5-flash',
        highlights: { ...DEFAULT_HIGHLIGHTS },
      };
      writeLocalDb(state);
    }
    return state.settings[userId];
  },

  async updateHighlightSettings(userId: string, highlights: Partial<HighlightColorSettings>): Promise<HighlightColorSettings> {
    const state = readLocalDb();
    const currentSettings = await this.getUserSettings(userId);
    currentSettings.highlights = {
      ...currentSettings.highlights,
      ...highlights,
    };
    state.settings[userId] = currentSettings;
    writeLocalDb(state);
    return currentSettings.highlights;
  },

  // DOCUMENTS
  async getDocuments(userId: string): Promise<DocumentItem[]> {
    const state = readLocalDb();
    const userDocs = state.documents.filter((d) => d.userId === userId);
    // Sort chronologically ascending for stable library 1-based numbering
    userDocs.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    return userDocs.map((doc, idx) => ({
      ...doc,
      docNumber: idx + 1,
    }));
  },

  async getDocumentById(userId: string, id: string): Promise<DocumentItem | null> {
    const docs = await this.getDocuments(userId);
    return docs.find((d) => d.id === id) || null;
  },

  async createDocument(doc: Omit<DocumentItem, 'createdAt' | 'updatedAt'>): Promise<DocumentItem> {
    const state = readLocalDb();
    const now = new Date().toISOString();
    const newDoc: DocumentItem = {
      ...doc,
      createdAt: now,
      updatedAt: now,
      status: doc.status || 'UPLOADING',
    };
    state.documents.push(newDoc);
    writeLocalDb(state);
    return newDoc;
  },

  async updateDocument(userId: string, id: string, updates: Partial<DocumentItem>): Promise<DocumentItem | null> {
    const state = readLocalDb();
    const index = state.documents.findIndex((d) => d.id === id && d.userId === userId);
    if (index === -1) return null;

    state.documents[index] = {
      ...state.documents[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    writeLocalDb(state);
    return state.documents[index];
  },

  async deleteDocument(userId: string, id: string): Promise<boolean> {
    const state = readLocalDb();
    const initialLen = state.documents.length;
    state.documents = state.documents.filter((d) => !(d.id === id && d.userId === userId));

    // Also remove conflicts associated with this document
    state.conflicts = state.conflicts.filter(
      (c) => c.primaryDocId !== id && c.conflictingDocId !== id
    );

    // Also remove chat messages
    delete state.chatMessages[id];

    writeLocalDb(state);
    return state.documents.length < initialLen;
  },

  // CONFLICTS
  async getConflicts(userId: string): Promise<Conflict[]> {
    const state = readLocalDb();
    const userDocs = state.documents.filter((d) => d.userId === userId);
    const docIds = new Set(userDocs.map((d) => d.id));
    return state.conflicts.filter(
      (c) => docIds.has(c.primaryDocId) || docIds.has(c.conflictingDocId)
    );
  },

  async saveConflicts(conflicts: Conflict[]): Promise<void> {
    const state = readLocalDb();
    // Merge or replace conflicts
    for (const conf of conflicts) {
      const idx = state.conflicts.findIndex((c) => c.id === conf.id);
      if (idx >= 0) {
        state.conflicts[idx] = conf;
      } else {
        state.conflicts.push(conf);
      }
    }
    writeLocalDb(state);
  },

  // CHAT MESSAGES
  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    const state = readLocalDb();
    return state.chatMessages[sessionId] || [];
  },

  async addChatMessage(sessionId: string, message: ChatMessage): Promise<void> {
    const state = readLocalDb();
    if (!state.chatMessages[sessionId]) {
      state.chatMessages[sessionId] = [];
    }
    state.chatMessages[sessionId].push(message);
    writeLocalDb(state);
  },

  // DASHBOARD STATS
  async getDashboardStats(userId: string): Promise<DashboardStats> {
    const docs = await this.getDocuments(userId);
    const conflicts = await this.getConflicts(userId);

    let totalDocs = docs.length;
    let processedDocs = docs.filter((d) => d.status === 'COMPLETED').length;
    let missingInfoCount = 0;
    const upcomingDeadlines: DashboardStats['upcomingDeadlines'] = [];

    docs.forEach((doc) => {
      if (doc.missingInformation) {
        missingInfoCount += doc.missingInformation.length;
      }
      if (doc.insights) {
        doc.insights
          .filter((i) => i.category === 'Deadline' || i.title.toLowerCase().includes('deadline'))
          .forEach((i) => {
            upcomingDeadlines.push({
              docId: doc.id,
              docTitle: doc.title,
              deadline: i.title,
              description: i.description,
              sourceRef: i.sourceRef || doc.title,
            });
          });
      }
      if (doc.entities) {
        doc.entities
          .filter((e) => e.category === 'Deadline')
          .forEach((e) => {
            if (!upcomingDeadlines.some((d) => d.deadline === e.name && d.docId === doc.id)) {
              upcomingDeadlines.push({
                docId: doc.id,
                docTitle: doc.title,
                deadline: e.name,
                description: e.context || 'Critical date requirement',
                sourceRef: e.sourceRef || doc.title,
              });
            }
          });
      }
    });

    const docsNeedingReview = docs.filter(
      (d) =>
        (d.missingInformation && d.missingInformation.length > 0) ||
        (d.insights && d.insights.some((i) => i.priority === 'CRITICAL' || i.priority === 'NEEDS_REVIEW'))
    ).length;

    // Recent activity log derived from document events
    const recentActivities: DashboardStats['recentActivities'] = docs.slice(0, 5).map((d) => ({
      id: `act-${d.id}`,
      action: d.status === 'COMPLETED' ? 'Intelligence Analysis Completed' : `Processing: ${d.status}`,
      docTitle: d.title,
      timestamp: d.updatedAt,
      type: 'analysis',
    }));

    if (conflicts.length > 0) {
      recentActivities.unshift({
        id: `act-conf-${conflicts[0].id}`,
        action: `Conflict Flagged: ${conflicts[0].fieldName}`,
        docTitle: `${conflicts[0].primaryDocTitle || 'Doc'} vs ${conflicts[0].conflictingDocTitle || 'Doc'}`,
        timestamp: conflicts[0].createdAt,
        type: 'conflict',
      });
    }

    return {
      totalDocuments: totalDocs,
      documentsProcessed: processedDocs,
      documentsNeedingReview: docsNeedingReview,
      missingInformationCount: missingInfoCount,
      potentialConflicts: conflicts.filter((c) => c.status === 'NEEDS_HUMAN_REVIEW').length,
      upcomingDeadlines,
      recentDocuments: docs.slice(-5).reverse(),
      recentActivities,
    };
  },
};
