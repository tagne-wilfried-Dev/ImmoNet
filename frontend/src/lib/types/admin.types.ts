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

// ─── API réelle (backend AdminController) ─────────────────────────────────────

export type AdminUserStatut = 'ACTIVE' | 'SUSPENDED' | 'BANNED';

export interface AdminUser {
  id: number;
  nom: string;
  prenom?: string;
  email: string;
  telephone?: string;
  role: UserRole;
  statut: AdminUserStatut;
  nbBiens: number;
  dateInscription: string;
}

export interface AdminBien {
  id: number;
  titre: string;
  typeBien: string;
  typeOperation: 'VENTE' | 'LOCATION';
  statut: 'BROUILLON' | 'PUBLIE' | 'EN_LOCATION' | 'VENDU' | 'ARCHIVE' | 'SUSPENDU';
  prix: number;
  ville: string;
  urlPhotoPrincipale?: string;
  proprietaireId: number;
  proprietaireNom: string;
  proprietaireEmail: string;
  createdAt: string;
}

export interface AdminStats {
  totalUtilisateurs: number;
  totalClients: number;
  totalPros: number;
  totalAdmins: number;
  totalBiens: number;
  biensPublies: number;
  biensParStatut: Record<string, number>;
  abonnementsParPlan: Record<string, number>;
  signalementsActifs: number;
  utilisateursRecents: AdminUser[];
}