import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { unauthorized, error as errResp } from "../utils/response";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

export interface AuthRequest extends Request {
  user?: any;
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;
  if (!header) return unauthorized(res, "Missing authorization");
  const parts = header.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer")
    return unauthorized(res, "Invalid auth header");
  try {
    const payload = jwt.verify(parts[1], JWT_SECRET) as any;
    req.user = payload;
    return next();
  } catch (err) {
    return unauthorized(res, "Invalid token");
  }
}

export function requireRole(role: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user as any;
    if (!user) return errResp(res, "Forbidden", 403);
    if (user.role !== role) return errResp(res, "Insufficient role", 403);
    return next();
  };
}
