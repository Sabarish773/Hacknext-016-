import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId || 'user-default-1';
    const profileData = body.profile || {};

    const updated = await db.updateProfile(userId, profileData);
    return NextResponse.json({ success: true, profile: updated });
  } catch (err: any) {
    console.error('Error updating profile:', err);
    return NextResponse.json({ error: 'Failed to update profile', details: err.message }, { status: 500 });
  }
}
