import { Request, Response } from "express";
import { success, error as errResp, badRequest } from "../utils/response";
import { processFile } from "../services/uploadService";
import fs from "fs";

export async function uploadFile(req: Request, res: Response) {
  try {
    const file = (req as any).file;
    const query = req.body?.query;
    if (!file) return badRequest(res, "file is required");
    if (!query) return badRequest(res, "query is required");

    const saved = await processFile(
      file.path,
      file.mimetype,
      query,
      file.originalname,
    );

    // Optionally remove file after processing
    try {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    } catch (e) {
      console.warn("Failed to remove uploaded file", e);
    }

    return success(res, { assessments: saved }, "Assessments created", 201);
  } catch (err) {
    console.error(err);
    return errResp(res, "Failed to process file", 500, err);
  }
}
