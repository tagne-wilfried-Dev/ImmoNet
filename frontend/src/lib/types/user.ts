export type UserRole = 'CLIENT' | 'PRO' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED' | 'BANNED';

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: UserRole;
  status: UserStatus;
  isEmailVerified: boolean;
  avatarUrl?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string; // Géré via cookie HttpOnly côté serveur
}