import api from '@/lib/axios';
import type { PropertySummary } from '@/lib/types/property.types';

export const favoriService = {
  /** Liste de mes biens favoris (les plus récents d'abord). */
  getFavoris: async (): Promise<PropertySummary[]> => {
    const response = await api.get<PropertySummary[]>('/favoris');
    return response.data;
  },

  /** Ids de mes biens favoris — pour colorer les cœurs dans les listes. */
  getFavorisIds: async (): Promise<number[]> => {
    const response = await api.get<number[]>('/favoris/ids');
    return response.data;
  },

  /** Ajoute un bien aux favoris. */
  addFavori: async (bienId: number | string): Promise<void> => {
    await api.post(`/favoris/${bienId}`);
  },

  /** Retire un bien des favoris. */
  removeFavori: async (bienId: number | string): Promise<void> => {
    await api.delete(`/favoris/${bienId}`);
  },
};
