import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { HighlightColorSettings } from '@/types';


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'user-default-1';

    const settings = await db.getUserSettings(userId);
    return NextResponse.json({ success: true, highlights: settings.highlights });
  } catch (err: any) {
    console.error('Error fetching highlights:', err);
    return NextResponse.json({ error: 'Failed to retrieve highlight settings', details: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId || 'user-default-1';
    const category = body.category as keyof HighlightColorSettings;
    const color = body.color as string;

    if (!category || !color) {
      return NextResponse.json({ error: 'Category and color are required' }, { status: 400 });
    }

    const updated = await db.updateHighlightSettings(userId, { [category]: color });
    return NextResponse.json({ success: true, highlights: updated });
  } catch (err: any) {
    console.error('Error updating highlights:', err);
    return NextResponse.json({ error: 'Failed to update highlight settings', details: err.message }, { status: 500 });
  }
}
