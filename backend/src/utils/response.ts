import { Response } from "express";

export function success(
  res: Response,
  data: any = null,
  message = "OK",
  status = 200,
) {
  return res.status(status).json({ success: true, message, data });
}

export function error(
  res: Response,
  message = "Error",
  status = 500,
  details?: any,
) {
  const payload: any = { success: false, message };
  if (details !== undefined) payload.details = details;
  return res.status(status).json(payload);
}

export function unauthorized(res: Response, message = "Unauthorized") {
  return error(res, message, 401);
}

export function badRequest(res: Response, message = "Bad Request") {
  return error(res, message, 400);
}
