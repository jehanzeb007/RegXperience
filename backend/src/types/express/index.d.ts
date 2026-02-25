import { IUser } from "../../models/User";

export interface RequestUser {
  id: string;
  email: string;
  role: "client" | "manager";
}

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}

export {};
