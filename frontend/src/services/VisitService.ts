import axios from 'axios';
import type { VisitRequest, VisitResponse } from '@/lib/types/visit.types';

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

export const visitService = {
  /**
   * Envoyer une demande de visite
   */
  requestVisit: async (data: VisitRequest): Promise<VisitResponse> => {
    const response = await api.post<VisitResponse>('/visites', data);
    return response.data;
  },

  /**
   * Récupérer les demandes de visite envoyées par le client
   */
  getMySentRequests: async (): Promise<VisitResponse[]> => {
    const response = await api.get<VisitResponse[]>('/visites/client');
    return response.data;
  },

  /**
   * Récupérer les demandes de visite reçues par le propriétaire
   */
  getMyReceivedRequests: async (): Promise<VisitResponse[]> => {
    const response = await api.get<VisitResponse[]>('/visites/proprietaire');
    return response.data;
  }
};
