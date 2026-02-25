import { Router } from "express";
import { uploadFile } from "../controllers/uploadController";
import { defaultUpload } from "../utils/multer";

const router = Router();

router.post("/", defaultUpload.single("file"), uploadFile);

export default router;
