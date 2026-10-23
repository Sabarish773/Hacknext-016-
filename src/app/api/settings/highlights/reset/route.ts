import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

const DEFAULT_HIGHLIGHTS = {
  critical: '#ef4444',
  important: '#f97316',
  warning: '#eab308',
  missing: '#a855f7',
  conflict: '#ec4899',
  deadline: '#3b82f6',
  informational: '#10b981',
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId || 'user-default-1';

    const updated = await db.updateHighlightSettings(userId, DEFAULT_HIGHLIGHTS);
    return NextResponse.json({ success: true, highlights: updated });
  } catch (err: any) {
    console.error('Error resetting highlights:', err);
    return NextResponse.json({ error: 'Failed to reset highlight settings', details: err.message }, { status: 500 });
  }
}
