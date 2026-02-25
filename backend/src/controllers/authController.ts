import { Request, Response } from "express";
import * as authService from "../services/authService";
import { success, badRequest, error as errResp } from "../utils/response";

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const result = await authService.authenticate(email, password);
    if (!result) return errResp(res, "Invalid credentials", 401);
    const { user, token } = result;
    return success(res, {
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    return errResp(res, "Server error");
  }
}

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return badRequest(res, "Missing fields");
    const existing = await authService.findUserByEmail(email);
    if (existing) return errResp(res, "Email already in use", 409);
    const user = await authService.createUser({ name, email, password, role });
    return success(
      res,
      { id: user._id, email: user.email, name: user.name, role: user.role },
      "User created",
      201,
    );
  } catch (err) {
    console.error(err);
    return errResp(res, "Server error");
  }
}
