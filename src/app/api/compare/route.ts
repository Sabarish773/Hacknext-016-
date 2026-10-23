import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { detectDocumentConflicts } from '@/lib/ai/conflictDetector';


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId || 'user-default-1';
    const docIds: string[] = body.docIds || [];

    if (!docIds || docIds.length < 2) {
      return NextResponse.json(
        { error: 'Please select at least 2 documents for cross-document comparison and conflict detection.' },
        { status: 400 }
      );
    }

    const allDocs = await db.getDocuments(userId);
    const targetDocs = allDocs.filter((d) => docIds.includes(d.id));

    if (targetDocs.length < 2) {
      return NextResponse.json(
        { error: 'Selected documents could not be found in user repository.' },
        { status: 404 }
      );
    }

    const comparisonResult = await detectDocumentConflicts(targetDocs);

    if (comparisonResult.conflicts.length > 0) {
      await db.saveConflicts(comparisonResult.conflicts);
    }

    return NextResponse.json({
      success: true,
      comparedCount: targetDocs.length,
      ...comparisonResult,
    });
  } catch (err: any) {
    console.error('Error in /api/compare:', err);
    return NextResponse.json({ error: 'Multi-document comparison failed', details: err.message }, { status: 500 });
  }
}
