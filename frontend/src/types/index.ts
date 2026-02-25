export type User = {
  id?: string;
  name?: string;
  email?: string;
  role?: "admin" | "client" | string;
};

export type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: User;
};
