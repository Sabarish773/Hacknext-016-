import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'user-default-1';

    const stats = await db.getDashboardStats(userId);
    return NextResponse.json({ success: true, stats });
  } catch (err: any) {
    console.error('Error in GET /api/dashboard/stats:', err);
    return NextResponse.json({ error: 'Failed to retrieve stats', details: err.message }, { status: 500 });
  }
}
