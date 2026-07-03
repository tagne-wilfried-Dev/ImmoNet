import axios from 'axios';
import type {
  PropertyDetail,
  PropertySummary,
  SearchFilters,
  PaginatedProperties,
  PropertyCreateRequest,
  PropertyUpdateRequest,
  PhotoResponse
} from '@/lib/types/property.types';

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
   * Recherche paginée de biens immobiliers (Public)
   */
  getProperties: async (filters: SearchFilters, page = 0, size = 20): Promise<PaginatedProperties> => {
    const response = await api.get('/biens', {
      params: { ...filters, page, size }
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
   * Récupère les détails d'un bien spécifique
   */
  getPropertyById: async (id: number | string): Promise<PropertyDetail> => {
    const response = await api.get<PropertyDetail>(`/biens/${id}`);
    return response.data;
  },

  /**
   * Création d'une annonce (données textuelles)
   */
  createProperty: async (data: PropertyCreateRequest): Promise<PropertySummary> => {
    const response = await api.post<PropertySummary>('/biens', data);
    return response.data;
  },

  /**
   * Met à jour les informations d'un bien existant (réservé au propriétaire / ADMIN)
   */
  updateProperty: async (id: number | string, data: PropertyUpdateRequest): Promise<PropertyDetail> => {
    const response = await api.put<PropertyDetail>(`/biens/${id}`, data);
    return response.data;
  },

  /**
   * Récupère les photos d'un bien avec leur ID (pour l'édition : suppression, photo principale)
   */
  getPropertyPhotos: async (id: number | string): Promise<PhotoResponse[]> => {
    const response = await api.get<PhotoResponse[]>(`/biens/${id}/photos`);
    return response.data;
  },

  /**
   * Supprime une photo d'un bien
   */
  deletePhoto: async (id: number | string, photoId: number): Promise<void> => {
    await api.delete(`/biens/${id}/photos/${photoId}`);
  },

  /**
   * Définit la photo principale d'un bien
   */
  setMainPhoto: async (id: number | string, photoId: number): Promise<void> => {
    await api.patch(`/biens/${id}/photos/${photoId}/principale`);
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
   * Récupère TOUS les biens du patrimoine (Brouillon, Loué, Publié) du propriétaire connecté
   */
  getMyProperties: async (page = 0, size = 50): Promise<PaginatedProperties> => {
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
   * Récupère uniquement les annonces actuellement PUBLIÉES du propriétaire connecté
   */
  getMyListings: async (page = 0, size = 50): Promise<PaginatedProperties> => {
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
   * Récupère les biens publiables (Brouillon, Suspendu, Loué) pour la modal de mise en ligne
   */
  getAvailableProperties: async (): Promise<PropertySummary[]> => {
    const response = await api.get<PropertySummary[]>('/biens/mine/available');
    return response.data;
  },

  /**
   * Met à jour le statut d'un bien (Publication, Suspension, Archivage)
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
