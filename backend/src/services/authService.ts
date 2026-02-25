import User, { IUser } from "../models/User";
import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET: string = process.env.JWT_SECRET || "change_this_secret";
const JWT_EXPIRES: string = process.env.JWT_EXPIRES_IN || "1h";

export async function findUserByEmail(email: string) {
  return User.findOne({ email });
}

export async function authenticate(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const ok = await user.comparePassword(password);
  if (!ok) return null;
  const payload = { id: user._id, role: user.role, email: user.email };
  const options: SignOptions = { expiresIn: JWT_EXPIRES as unknown as any };
  const token = jwt.sign(payload, JWT_SECRET, options);
  return { user, token };
}

export async function createUser(data: Partial<IUser>) {
  const user = new User(data as any);
  return user.save();
}
