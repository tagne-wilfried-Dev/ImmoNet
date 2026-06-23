import api from '@/lib/axios';

// ─── Types alignés sur ClientDashboardResponse (backend) ──────────────────────

export interface ClientDashboardKpis {
  favoris: number;
  visitesPlanifiees: number;
  reservationsActives: number;
  messagesNonLus: number;
}

export interface ClientActivityItem {
  type: 'reservation' | 'visit' | 'message';
  label: string;
  detail: string;
  /** Date ISO-8601 renvoyée par le backend. */
  date: string;
  status: 'success' | 'pending' | 'info' | 'neutral';
}

export interface ClientDashboardData {
  kpis: ClientDashboardKpis;
  recentActivity: ClientActivityItem[];
}

export const dashboardService = {
  /**
   * Agrégats du tableau de bord CLIENT (KPIs + activité récente).
   * Source : GET /api/dashboard/client
   */
  getClientDashboard: async (): Promise<ClientDashboardData> => {
    const response = await api.get<ClientDashboardData>('/dashboard/client');
    return response.data;
  },
};
