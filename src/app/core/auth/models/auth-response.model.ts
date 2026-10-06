export interface AuthResponse {
  token: string;
  expiresAt: string;
  userId: number;
  name: string;
  email: string;
  role: string;
}