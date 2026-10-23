import fs from 'fs';
import path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

function ensureUploadsDir(): void {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

export interface StoredFileResult {
  storagePath: string;
  publicUrl: string;
  fileSizeBytes: number;
  fileName: string;
}

export const storage = {
  async saveFile(buffer: Buffer, originalFileName: string): Promise<StoredFileResult> {
    ensureUploadsDir();
    const safeExt = path.extname(originalFileName) || '.bin';
    const timestamp = Date.now();
    const cleanBaseName = path
      .basename(originalFileName, safeExt)
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueFileName = `${cleanBaseName}_${timestamp}${safeExt}`;
    const destinationPath = path.join(UPLOADS_DIR, uniqueFileName);

    await fs.promises.writeFile(destinationPath, buffer);

    return {
      storagePath: destinationPath,
      publicUrl: `/uploads/${uniqueFileName}`,
      fileSizeBytes: buffer.length,
      fileName: uniqueFileName,
    };
  },

  async deleteFile(storagePathOrUrl: string): Promise<boolean> {
    try {
      const fileName = path.basename(storagePathOrUrl);
      const safePath = path.join(UPLOADS_DIR, fileName);
      if (fs.existsSync(safePath)) {
        await fs.promises.unlink(safePath);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting file:', err);
      return false;
    }
  },

  async readFile(storagePathOrUrl: string): Promise<Buffer | null> {
    try {
      const fileName = path.basename(storagePathOrUrl);
      const safePath = path.join(UPLOADS_DIR, fileName);
      if (fs.existsSync(safePath)) {
        return await fs.promises.readFile(safePath);
      }
      return null;
    } catch (err) {
      console.error('Error reading file from storage:', err);
      return null;
    }
  },
};
