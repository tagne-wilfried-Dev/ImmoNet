// src/lib/types/admin.types.ts
// Types partagés entre AdminDashboard, ModerationPage, UtilisateursPage, etc.

export type ModerationStatus = 'pending' | 'flagged';
export type ModerationItemType = 'annonce' | 'pro_request' | 'signalement';

export interface ModerationItem {
  id: number;
  type: ModerationItemType;
  title: string;
  submittedBy: string;
  submittedAt: string;
  status: ModerationStatus;
}

export type UserRole = 'CLIENT' | 'PRO' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED' | 'BANNED';

export interface RecentUser {
  id: number;
  nom: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  registeredAt: string;
}

export interface AbonnementStats {
  starter: number;
  business: number;
  premium: number;
}

export interface PlatformStats {
  tauxOccupation: string;
  annoncesModereesAujourdhui: number;
  logementsVendus: number;
  logementsLoues: number;
  signalements: number;
  abonnementsActifs: AbonnementStats;
}

export interface KpiData {
  id: string;
  title: string;
  value: string;
  unit?: string;
  trend: string;
  trendLabel: string;
  positive: boolean;
  icon: string;
  urgent?: boolean;
}

export interface AdminDashboardData {
  kpis: KpiData[];
  moderationQueue: ModerationItem[];
  recentUsers: RecentUser[];
  platformStats: PlatformStats;
}