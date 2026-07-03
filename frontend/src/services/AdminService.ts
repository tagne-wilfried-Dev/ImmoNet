import api from '@/lib/axios';
import type {
  AdminStats,
  AdminUser,
  AdminUserStatut,
  AdminBien,
} from '@/lib/types/admin.types';

export const adminService = {
  /**
   * Agrégats réels pour le tableau de bord admin
   */
  getStats: async (): Promise<AdminStats> => {
    const response = await api.get<AdminStats>('/admin/stats');
    return response.data;
  },

  /**
   * Liste tous les utilisateurs de la plateforme
   */
  getUsers: async (): Promise<AdminUser[]> => {
    const response = await api.get<AdminUser[]>('/admin/users');
    return response.data;
  },

  /**
   * Change le statut d'un utilisateur (ACTIVE / SUSPENDED / BANNED)
   */
  updateUserStatut: async (id: number, statut: AdminUserStatut): Promise<AdminUser> => {
    const response = await api.patch<AdminUser>(`/admin/users/${id}/statut`, null, {
      params: { statut },
    });
    return response.data;
  },

  /**
   * Liste tous les biens de la plateforme (tous propriétaires confondus)
   */
  getBiens: async (): Promise<AdminBien[]> => {
    const response = await api.get<AdminBien[]>('/admin/biens');
    return response.data;
  },

  /**
   * Modère un bien : suspendre / republier / archiver
   */
  updateBienStatut: async (id: number, statut: AdminBien['statut']): Promise<AdminBien> => {
    const response = await api.patch<AdminBien>(`/admin/biens/${id}/statut`, null, {
      params: { statut },
    });
    return response.data;
  },
};
