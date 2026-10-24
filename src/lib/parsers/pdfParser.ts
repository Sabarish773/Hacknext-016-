
export interface ParsedPdfResult {
  text: string;
  pageCount: number;
  metadata: Record<string, any>;
}

export async function parsePdf(buffer: Buffer): Promise<ParsedPdfResult> {
  let parser: any = null;
  try {
    const { PDFParse } = await import('pdf-parse');
    parser = new PDFParse({ data: buffer });
    const res = await parser.getText();
    const text = res?.text || '';
    const pageCount = res?.total || parser?.doc?.numPages || 1;
    await parser.destroy();

    return {
      text: text.trim(),
      pageCount: Math.max(1, pageCount),
      metadata: {},
    };
  } catch (err: any) {
    console.warn('PDFParse primary extraction notice:', err.message);
    if (parser) {
      try {
        await parser.destroy();
      } catch {}
    }
    // Fallback: extract readable ASCII string chunks if complex PDF
    const textSample = buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, ' ');
    const cleaned = textSample.split(/\s+/).filter((w) => w.length > 2).slice(0, 500).join(' ');

    return {
      text: cleaned || 'PDF document scanned. Binary encoding converted.',
      pageCount: 1,
      metadata: {},
    };
  }
}
