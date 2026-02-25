import { NextResponse } from 'next/server';

/**
 * FAQ chat API (Node.js backend, no Supabase).
 * Uses request body faqData to answer from FAQ content; streams response for compatibility with FAQChatbot.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { messages = [], faqData = [] } = body;
    const lastUser = messages.filter((m) => m.role === 'user').pop();
    const query = (lastUser?.content || '').toLowerCase().trim();
    if (!query) {
      return NextResponse.json({ error: 'No message' }, { status: 400 });
    }

    // Simple match: find first FAQ whose question or answer contains the query (or query contains question)
    let reply = "I'm the Houspire FAQ assistant. I can help with pricing, process, design, and more. Try asking: \"What is Houspire?\" or \"How much does it cost?\"";
    for (const item of faqData) {
      const q = (item.question || '').toLowerCase();
      const a = (item.answer || '').toLowerCase();
      if (q && (query.includes(q.slice(0, 20)) || q.includes(query.slice(0, 15)) || query.split(/\s+/).some((w) => w.length > 3 && (q.includes(w) || a.includes(w))))) {
        reply = item.answer || item.question;
        break;
      }
    }

    // Stream response in the format the FAQChatbot expects (SSE-style)
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        const chunk = JSON.stringify({
          choices: [{ delta: { content: reply } }],
        });
        controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (e) {
    console.error('FAQ chat error:', e);
    return NextResponse.json({ error: 'Chat failed' }, { status: 500 });
  }
}
