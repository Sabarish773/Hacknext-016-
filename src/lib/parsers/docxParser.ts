import mammoth from 'mammoth';

export interface ParsedDocxResult {
  text: string;
  pageCount: number;
  headings: string[];
}

export async function parseDocx(buffer: Buffer): Promise<ParsedDocxResult> {
  try {
    const rawResult = await mammoth.extractRawText({ buffer });
    const text = rawResult.value || '';

    // Estimate page count based on average 350 words per page
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const estimatedPages = Math.max(1, Math.ceil(wordCount / 350));

    // Extract potential headings (lines that are short, uppercase or Title Case)
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    const headings = lines.filter((l) => l.length < 80 && /^[A-Z0-9\s:_-]+$/.test(l)).slice(0, 10);

    return {
      text,
      pageCount: estimatedPages,
      headings,
    };
  } catch (err: any) {
    console.error('DOCX parsing error:', err);
    throw new Error(`Failed to parse Word document: ${err.message || 'Corrupted DOCX file'}`);
  }
}
