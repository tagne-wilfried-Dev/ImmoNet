import { api } from './api';
import { 
  type BienFilterRequest, 
  type BienSummaryResponse, 
  type BienDetailResponse, 
  type Page 
} from '@/types/bien.types';

export const bienService = {
  /**
   * Rechercher des biens avec filtres et pagination
   */
  rechercher: async (filter: BienFilterRequest, page: number = 0, size: number = 20): Promise<Page<BienSummaryResponse>> => {
    const response = await api.get<Page<BienSummaryResponse>>('/biens', {
      params: {
        ...filter,
        page,
        size
      }
    });
    return response.data;
  },

  /**
   * Obtenir les détails d'un bien par son ID
   */
  getDetail: async (id: number): Promise<BienDetailResponse> => {
    const response = await api.get<BienDetailResponse>(`/biens/${id}`);
    return response.data;
  },

  /**
   * Créer une nouvelle annonce (réservé PRO/ADMIN)
   */
  creer: async (data: any): Promise<BienSummaryResponse> => {
    const response = await api.post<BienSummaryResponse>('/biens', data);
    return response.data;
  },

  /**
   * Mettre à jour une annonce
   */
  modifier: async (id: number, data: any): Promise<BienDetailResponse> => {
    const response = await api.put<BienDetailResponse>(`/biens/${id}`, data);
    return response.data;
  },

  /**
   * Archiver une annonce
   */
  archiver: async (id: number): Promise<void> => {
    await api.delete(`/biens/${id}`);
  }
};
