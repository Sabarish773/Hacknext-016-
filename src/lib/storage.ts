import path from 'path';
import { putFile, getFile, removeFile } from './pg';

export interface StoredFileResult {
  storagePath: string;
  publicUrl: string;
  fileSizeBytes: number;
  fileName: string;
}

export const storage = {
  async saveFile(buffer: Buffer, originalFileName: string): Promise<StoredFileResult> {
    const safeExt = path.extname(originalFileName) || '.bin';
    const timestamp = Date.now();
    const cleanBaseName = path
      .basename(originalFileName, safeExt)
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueFileName = `${cleanBaseName}_${timestamp}${safeExt}`;

    await putFile(uniqueFileName, buffer);

    return {
      storagePath: uniqueFileName,
      publicUrl: `/uploads/${uniqueFileName}`,
      fileSizeBytes: buffer.length,
      fileName: uniqueFileName,
    };
  },

  async deleteFile(storagePathOrUrl: string): Promise<boolean> {
    try {
      return await removeFile(path.basename(storagePathOrUrl));
    } catch (err) {
      console.error('Error deleting file:', err);
      return false;
    }
  },

  async readFile(storagePathOrUrl: string): Promise<Buffer | null> {
    try {
      return await getFile(path.basename(storagePathOrUrl));
    } catch (err) {
      console.error('Error reading file from storage:', err);
      return null;
    }
  },
};