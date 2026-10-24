import path from 'path';
import { getFile } from '@/lib/pg';

const TYPES: Record<string, string> = {
    '.pdf': 'application/pdf',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.txt': 'text/plain',
    '.csv': 'text/csv',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ name: string }> }
) {
    const { name } = await params;
    const safeName = path.basename(name);
    const file = await getFile(safeName);
    if (!file) return new Response('Not found', { status: 404 });
    const type = TYPES[path.extname(safeName).toLowerCase()] || 'application/octet-stream';
    return new Response(new Uint8Array(file), { headers: { 'Content-Type': type } });
}