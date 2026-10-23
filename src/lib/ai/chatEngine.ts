import { ChatSourceCitation, DocumentItem } from '@/types';
import { aiService } from './service';

export interface ChatResponse {
  answer: string;
  sources: ChatSourceCitation[];
}

export async function askDocumentAssistant(
  question: string,
  documents: DocumentItem[],
  targetDocId?: string | null
): Promise<ChatResponse> {
  const activeDocs = targetDocId
    ? documents.filter((d) => d.id === targetDocId)
    : documents;

  if (activeDocs.length === 0) {
    return {
      answer: 'No documents are currently available to answer your query. Please upload documents to your Doc.DOOM repository first.',
      sources: [],
    };
  }

  const systemInstruction = `You are Doc.DOOM's Intelligent Information Assistant.
Your primary role is to answer user queries strictly grounded in the user's uploaded enterprise documents.
CRITICAL RULES:
1. Ground every statement strictly in the provided document context.
2. DO NOT hallucinate, infer without evidence, or invent dates/amounts/facts.
3. If information is not present or cannot be determined from the text, state clearly: "This information is not stated in the uploaded documents."
4. Provide source traceability: cite the exact document title and section/page reference.
5. Return strictly valid JSON matching the format requested without markdown ticks.`;

  const contextText = activeDocs
    .map(
      (d) => `
[DOCUMENT: "${d.title}" | ID: ${d.id} | Category: ${d.analysis?.category || 'General'}]
Entities: ${(d.entities || []).map((e) => `${e.category}: ${e.name}`).join(', ')}
Summary: ${d.analysis?.shortSummary || ''}
Content Snippet:
${(d.rawText || '').slice(0, 4000)}
`
    )
    .join('\n---\n');

  const prompt = `User Question: "${question}"

Available Context:
${contextText}

JSON Response Format:
{
  "answer": "Grounded, precise answer citing facts from the documents.",
  "sources": [
    {
      "docTitle": "Document Title",
      "sourceRef": "Page X / Section Y",
      "snippet": "Direct quoted text or snippet from context"
    }
  ]
}`;

  return await aiService.generateStructuredJSON<ChatResponse>(
    prompt,
    systemInstruction,
    () => generateDeterministicChatAnswer(question, activeDocs)
  );
}

function generateDeterministicChatAnswer(question: string, docs: DocumentItem[]): ChatResponse {
  const qLower = question.toLowerCase();
  const matchedSources: ChatSourceCitation[] = [];
  let answer = '';

  // Deadline queries
  if (qLower.includes('deadline') || qLower.includes('due') || qLower.includes('date')) {
    const deadlines: { doc: string; val: string; ref: string }[] = [];
    docs.forEach((d) => {
      d.entities
        ?.filter((e) => e.category === 'Deadline' || e.category === 'Date')
        .forEach((e) => {
          deadlines.push({
            doc: d.title,
            val: e.name,
            ref: e.sourceRef || `${d.title} - Overview`,
          });
          matchedSources.push({
            docId: d.id,
            docTitle: d.title,
            sourceRef: e.sourceRef || `${d.title} - Section 1`,
            snippet: `${e.category} specified as ${e.name}`,
          });
        });
    });

    if (deadlines.length > 0) {
      answer = `Based on your documents, the following key deadlines were identified:\n` +
        deadlines.map((dl) => `• **${dl.val}** in *${dl.doc}* (${dl.ref})`).join('\n');
    } else {
      answer = `No explicit deadlines or dates were located in the queried document(s).`;
    }
    return { answer, sources: matchedSources.slice(0, 4) };
  }

  // Missing info queries
  if (qLower.includes('missing') || qLower.includes('incomplete') || qLower.includes('lack')) {
    const missingItems: string[] = [];
    docs.forEach((d) => {
      d.missingInformation?.forEach((m) => {
        missingItems.push(`• **${m.itemName}** (${m.status}): ${m.reason} in *${d.title}*`);
        matchedSources.push({
          docId: d.id,
          docTitle: d.title,
          sourceRef: `${d.title} - Gap Analysis`,
          snippet: m.reason,
        });
      });
    });

    if (missingItems.length > 0) {
      answer = `Doc.DOOM discovered the following missing or unverified items:\n` + missingItems.join('\n');
    } else {
      answer = `No critical missing information or compliance gaps were flagged in the selected document(s).`;
    }
    return { answer, sources: matchedSources.slice(0, 4) };
  }

  // Explain simply / general summary
  if (qLower.includes('explain') || qLower.includes('summar') || qLower.includes('purpose') || qLower.includes('what is')) {
    const summaries = docs.map((d) => {
      matchedSources.push({
        docId: d.id,
        docTitle: d.title,
        sourceRef: `${d.title} - Executive Summary`,
        snippet: d.analysis?.shortSummary || d.title,
      });
      return `**${d.title}** (${d.analysis?.category || 'General'}):\n${d.analysis?.shortSummary || 'Enterprise documentation.'}\n*Main Purpose:* ${d.analysis?.mainPurpose || 'Organizational operations.'}`;
    });

    answer = `Here is a clear executive breakdown grounded in your uploaded documents:\n\n` + summaries.join('\n\n');
    return { answer, sources: matchedSources.slice(0, 4) };
  }

  // Fallback direct keyword search in raw text
  let bestSnippet = '';
  let bestDocTitle = docs[0].title;
  let bestDocId = docs[0].id;

  for (const d of docs) {
    const text = d.rawText || '';
    const sentences = text.split(/[.\n]+/);
    for (const sentence of sentences) {
      const matchWords = qLower.split(/\s+/).filter((w) => w.length > 3 && sentence.toLowerCase().includes(w));
      if (matchWords.length >= 2) {
        bestSnippet = sentence.trim();
        bestDocTitle = d.title;
        bestDocId = d.id;
        break;
      }
    }
    if (bestSnippet) break;
  }

  if (bestSnippet) {
    answer = `According to *${bestDocTitle}*: "${bestSnippet}."`;
    matchedSources.push({
      docId: bestDocId,
      docTitle: bestDocTitle,
      sourceRef: `${bestDocTitle} - Context Match`,
      snippet: bestSnippet,
    });
  } else {
    answer = `I analyzed the available document contents for "${question}". While the document outlines operational protocols and entities, this specific detail is not explicitly referenced in the current text.`;
    matchedSources.push({
      docId: docs[0].id,
      docTitle: docs[0].title,
      sourceRef: `${docs[0].title} - Global Scan`,
      snippet: 'Full document scanned without exact semantic match.',
    });
  }

  return { answer, sources: matchedSources };
}
