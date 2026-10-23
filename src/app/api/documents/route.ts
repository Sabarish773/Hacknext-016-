import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { storage } from '@/lib/storage';
import { parseDocumentFile } from '@/lib/parsers';
import { analyzeDocumentText } from '@/lib/ai/documentAnalyzer';
import { generateDocumentVisualizations } from '@/lib/ai/visualizationEngine';
import { detectDocumentConflicts } from '@/lib/ai/conflictDetector';
import { DocumentItem } from '@/types';


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'user-default-1';
    const query = (searchParams.get('q') || '').toLowerCase().trim();

    let docs = await db.getDocuments(userId);

    // Filter by search query if provided
    if (query) {
      docs = docs.filter((doc) => {
        const titleMatch = doc.title.toLowerCase().includes(query);
        const textMatch = (doc.rawText || '').toLowerCase().includes(query);
        const entityMatch = (doc.entities || []).some(
          (e) => e.name.toLowerCase().includes(query) || (e.context || '').toLowerCase().includes(query)
        );
        const insightMatch = (doc.insights || []).some(
          (i) => i.title.toLowerCase().includes(query) || i.description.toLowerCase().includes(query)
        );
        const missingMatch = (doc.missingInformation || []).some(
          (m) => m.itemName.toLowerCase().includes(query) || m.reason.toLowerCase().includes(query)
        );
        return titleMatch || textMatch || entityMatch || insightMatch || missingMatch;
      });
    }

    return NextResponse.json({ documents: docs, count: docs.length });
  } catch (err: any) {
    console.error('Error in GET /api/documents:', err);
    return NextResponse.json({ error: 'Failed to retrieve documents', details: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const userId = (formData.get('userId') as string) || 'user-default-1';
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided for upload' }, { status: 400 });
    }

    const processedDocuments: DocumentItem[] = [];

    // Process each uploaded document sequentially to ensure atomic state updates
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const originalName = file.name;
      const mimeType = file.type || 'application/octet-stream';
      const fileSizeBytes = buffer.length;

      // 1. Permanent Storage
      const stored = await storage.saveFile(buffer, originalName);

      // 2. Initial document record in db (status: PROCESSING)
      const docId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      let docItem: DocumentItem = {
        id: docId,
        userId,
        title: originalName.replace(/\.[^/.]+$/, ''),
        originalName,
        mimeType,
        fileSizeBytes,
        storagePath: stored.publicUrl,
        status: 'PROCESSING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await db.createDocument(docItem);

      try {
        // 3. Document Parsing
        const parsed = await parseDocumentFile(buffer, originalName, mimeType);
        docItem.rawText = parsed.text;
        docItem.pageCount = parsed.pageCount;
        docItem.status = 'ANALYSING';
        await db.updateDocument(userId, docId, {
          rawText: parsed.text,
          pageCount: parsed.pageCount,
          status: 'ANALYSING',
        });

        // 4. AI Deep Cognitive Analysis
        const analysisResult = await analyzeDocumentText(parsed.text, originalName, parsed.pageCount);

        const analysisWithId = {
          ...analysisResult.analysis,
          id: `analysis-${docId}`,
          documentId: docId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const entitiesWithIds = analysisResult.entities.map((e, idx) => ({
          ...e,
          id: `ent-${docId}-${idx}`,
          documentId: docId,
          createdAt: new Date().toISOString(),
        }));

        const insightsWithIds = analysisResult.insights.map((ins, idx) => ({
          ...ins,
          id: `ins-${docId}-${idx}`,
          documentId: docId,
          createdAt: new Date().toISOString(),
        }));

        const missingWithIds = analysisResult.missingInformation.map((m, idx) => ({
          ...m,
          id: `miss-${docId}-${idx}`,
          documentId: docId,
          createdAt: new Date().toISOString(),
        }));

        // 5. Intelligent Visualization Engine
        const visResult = await generateDocumentVisualizations(
          docId,
          originalName,
          parsed.text,
          parsed.structuredData
        );

        // 6. Update document with complete intelligence
        const finalDoc = await db.updateDocument(userId, docId, {
          status: 'COMPLETED',
          analysis: analysisWithId,
          entities: entitiesWithIds,
          insights: insightsWithIds,
          missingInformation: missingWithIds,
          visualizations: visResult.visualizations,
        });

        if (finalDoc) {
          processedDocuments.push(finalDoc);
        }
      } catch (procErr: any) {
        console.error(`Error processing file ${originalName}:`, procErr);
        await db.updateDocument(userId, docId, {
          status: 'FAILED',
          errorMessage: procErr.message || 'Error occurred during parsing or analysis',
        });
      }
    }

    // 7. Check for conflicts with other documents in the user's collection
    try {
      const allUserDocs = await db.getDocuments(userId);
      if (allUserDocs.length >= 2) {
        const conflictRes = await detectDocumentConflicts(allUserDocs);
        if (conflictRes.conflicts.length > 0) {
          await db.saveConflicts(conflictRes.conflicts);
        }
      }
    } catch (confErr) {
      console.warn('Conflict detection notice:', confErr);
    }

    return NextResponse.json({
      success: true,
      count: processedDocuments.length,
      documents: processedDocuments,
    });
  } catch (err: any) {
    console.error('Error in POST /api/documents:', err);
    return NextResponse.json({ error: 'Upload process failed', details: err.message }, { status: 500 });
  }
}
