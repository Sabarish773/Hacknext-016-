import path from 'path';
import { parsePdf } from './pdfParser';
import { parseDocx } from './docxParser';
import { parseSpreadsheet } from './spreadsheetParser';
import { parseImage } from './imageParser';

export interface ParseResult {
  text: string;
  pageCount: number;
  format: string;
  structuredData?: Record<string, any>;
  hasTabularData: boolean;
}

export const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

export async function parseDocumentFile(
  buffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<ParseResult> {
  const ext = (path.extname(fileName) || '').toLowerCase().replace('.', '');

  if (buffer.length > MAX_FILE_SIZE) {
    throw new Error(`File size (${(buffer.length / (1024 * 1024)).toFixed(1)}MB) exceeds maximum allowed size of 25MB.`);
  }

  // 1. PDF
  if (ext === 'pdf' || mimeType.includes('pdf')) {
    const res = await parsePdf(buffer);
    return {
      text: res.text,
      pageCount: res.pageCount,
      format: 'PDF',
      hasTabularData: false,
    };
  }

  // 2. DOCX / DOC
  if (ext === 'docx' || ext === 'doc' || mimeType.includes('word') || mimeType.includes('officedocument.wordprocessingml')) {
    const res = await parseDocx(buffer);
    return {
      text: res.text,
      pageCount: res.pageCount,
      format: 'DOCX',
      hasTabularData: false,
    };
  }

  // 3. SPREADSHEETS: CSV, XLS, XLSX
  if (['csv', 'xls', 'xlsx'].includes(ext) || mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType.includes('csv')) {
    const res = parseSpreadsheet(buffer, fileName);
    return {
      text: res.text,
      pageCount: res.pageCount,
      format: ext.toUpperCase(),
      structuredData: {
        columns: res.columns,
        numericColumns: res.numericColumns,
        sampleData: res.sampleData,
        totalRows: res.totalRows,
        sheetNames: res.sheetNames,
      },
      hasTabularData: true,
    };
  }

  // 4. IMAGES
  if (['png', 'jpg', 'jpeg'].includes(ext) || mimeType.startsWith('image/')) {
    const res = await parseImage(buffer, fileName);
    return {
      text: res.text,
      pageCount: res.pageCount,
      format: ext.toUpperCase(),
      hasTabularData: false,
    };
  }

  // 5. PLAIN TEXT / MARKDOWN / JSON / LOGS
  if (['txt', 'md', 'markdown', 'log', 'json'].includes(ext) || mimeType.startsWith('text/')) {
    const text = buffer.toString('utf-8');
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    return {
      text,
      pageCount: Math.max(1, Math.ceil(wordCount / 350)),
      format: ext.toUpperCase() || 'TXT',
      hasTabularData: ext === 'json',
    };
  }

  // Unsupported fallback: attempt text decode
  try {
    const text = buffer.toString('utf-8');
    return {
      text,
      pageCount: 1,
      format: ext.toUpperCase() || 'UNKNOWN',
      hasTabularData: false,
    };
  } catch {
    throw new Error(`Unsupported document format: .${ext}. Please upload PDF, Word, Excel, CSV, Text, or Image files.`);
  }
}
