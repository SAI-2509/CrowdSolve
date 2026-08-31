import path from "node:path";
import multer from "multer";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, "../uploads");

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadsDir);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname || ".jpg");
    callback(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${extension}`);
  }
});

export default multer({ storage });
