import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { askDocumentAssistant } from '@/lib/ai/chatEngine';
import { ChatMessage } from '@/types';


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId || 'user-default-1';
    const question = (body.question || '').trim();
    const targetDocId = body.targetDocId || null;
    const sessionId = body.sessionId || `session-${userId}-${targetDocId || 'global'}`;

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const allDocs = await db.getDocuments(userId);

    // Save user message
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sessionId,
      role: 'user',
      content: question,
      createdAt: new Date().toISOString(),
    };
    await db.addChatMessage(sessionId, userMsg);

    // Generate grounded answer
    const response = await askDocumentAssistant(question, allDocs, targetDocId);

    // Save assistant message
    const assistantMsg: ChatMessage = {
      id: `msg-${Date.now()}-assistant`,
      sessionId,
      role: 'assistant',
      content: response.answer,
      sources: response.sources,
      createdAt: new Date().toISOString(),
    };
    await db.addChatMessage(sessionId, assistantMsg);

    return NextResponse.json({
      success: true,
      answer: response.answer,
      sources: response.sources,
      message: assistantMsg,
    });
  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    return NextResponse.json({ error: 'Chat processing failed', details: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'user-default-1';
    const targetDocId = searchParams.get('targetDocId') || null;
    const sessionId = searchParams.get('sessionId') || `session-${userId}-${targetDocId || 'global'}`;

    const messages = await db.getChatMessages(sessionId);
    return NextResponse.json({ messages });
  } catch (err: any) {
    console.error('Error in GET /api/chat:', err);
    return NextResponse.json({ error: 'Failed to retrieve chat history' }, { status: 500 });
  }
}
