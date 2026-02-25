import multer from "multer";
import path from "path";
import fs from "fs";

export function getOrCreateUploadDir(dirName: string = "uploads"): string {
  const uploadDir = path.join(process.cwd(), dirName);
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  return uploadDir;
}

export function createMulterStorage(uploadDir: string) {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const name = `${Date.now()}-${file.originalname}`;
      cb(null, name);
    },
  });
}

export function createMulterInstance(uploadDir?: string) {
  const dir = uploadDir || getOrCreateUploadDir();
  const storage = createMulterStorage(dir);
  return multer({ storage });
}

// Common multer instance (singleton-like)
export const defaultUpload = createMulterInstance();
