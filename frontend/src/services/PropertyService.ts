import axios from 'axios';
import type { PropertyDetail, PropertySummary, SearchFilters, PaginatedProperties } from '@/lib/types/property.types';

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_BASE_URL = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Intercepteur pour ajouter le JWT (Access Token) si présent
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const propertyService = {
  /**
   * Recherche paginée de biens immobiliers
   */
  getProperties: async (filters: SearchFilters, page = 0, size = 20): Promise<PaginatedProperties> => {
    const response = await api.get('/biens', {
      params: { ...filters, page, size }
    });
    
    // Adaptation de la structure Spring Data Page vers PaginatedProperties
    return {
      data: response.data.content,
      total: response.data.totalElements,
      page: response.data.number,
      pageSize: response.data.size,
      totalPages: response.data.totalPages
    };
  },

  /**
   * Récupère les détails d'un bien spécifique
   */
  getPropertyById: async (id: number | string): Promise<PropertyDetail> => {
    const response = await api.get<PropertyDetail>(`/biens/${id}`);
    return response.data;
  },

  /**
   * Création d'une annonce (données textuelles)
   */
  createProperty: async (data: any): Promise<PropertySummary> => {
    const response = await api.post<PropertySummary>('/biens', data);
    return response.data;
  },

  /**
   * Upload de plusieurs photos pour un bien
   */
  uploadPhotos: async (id: number | string, files: File[]): Promise<string[]> => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    const response = await api.post<string[]>(`/biens/${id}/photos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Récupère TOUS les biens du patrimoine (Brouillon, Loué, Publié)
   */
  getMyProperties: async (page = 0, size = 20): Promise<PaginatedProperties> => {
    const response = await api.get('/biens/mine', {
      params: { page, size }
    });
    return {
      data: response.data.content,
      total: response.data.totalElements,
      page: response.data.number,
      pageSize: response.data.size,
      totalPages: response.data.totalPages
    };
  },

  /**
   * Récupère uniquement les biens en ligne (PUBLIE)
   */
  getMyListings: async (page = 0, size = 20): Promise<PaginatedProperties> => {
    const response = await api.get('/biens/mine/annonces', {
      params: { page, size }
    });
    return {
      data: response.data.content,
      total: response.data.totalElements,
      page: response.data.number,
      pageSize: response.data.size,
      totalPages: response.data.totalPages
    };
  },

  /**
   * Récupère les biens disponibles pour une nouvelle publication
   */
  getAvailableProperties: async (): Promise<PropertySummary[]> => {
    const response = await api.get<PropertySummary[]>('/biens/mine/available');
    return response.data;
  },

  /**
   * Change le statut d'un bien (PUBLIE, EN_LOCATION, VENDU, BROUILLON)
   */
  updatePropertyStatus: async (id: number | string, status: string): Promise<PropertyDetail> => {
    const response = await api.patch<PropertyDetail>(`/biens/${id}/statut`, null, {
      params: { statut: status }
    });
    return response.data;
  },

  /**
   * Archivage d'un bien (Soft Delete)
   */
  archiveProperty: async (id: number | string): Promise<void> => {
    await api.delete(`/biens/${id}`);
  }
};
