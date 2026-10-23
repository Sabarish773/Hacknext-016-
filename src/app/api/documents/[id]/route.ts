import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { storage } from '@/lib/storage';


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'user-default-1';

    const doc = await db.getDocumentById(userId, id);
    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json({ document: doc });
  } catch (err: any) {
    console.error('Error in GET /api/documents/[id]:', err);
    return NextResponse.json({ error: 'Failed to retrieve document', details: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'user-default-1';

    const doc = await db.getDocumentById(userId, id);
    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // 1. Delete physical stored file
    if (doc.storagePath) {
      await storage.deleteFile(doc.storagePath);
    }

    // 2. Delete database records (cascades entities, analysis, insights, missing info)
    const deleted = await db.deleteDocument(userId, id);

    return NextResponse.json({
      success: deleted,
      message: 'Document and all associated intelligence permanently removed',
    });
  } catch (err: any) {
    console.error('Error in DELETE /api/documents/[id]:', err);
    return NextResponse.json({ error: 'Failed to delete document', details: err.message }, { status: 500 });
  }
}
