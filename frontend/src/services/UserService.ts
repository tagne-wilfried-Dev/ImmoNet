import axios from 'axios';
import { type UserDto, type UpdateProfileRequest, type ChangePasswordRequest } from '@/types/user.types';

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// Supprime le slash final s'il est présent pour éviter les doubles slashes ("//")
const API_BASE_URL = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important pour les cookies HttpOnly
});

// Intercepteur pour ajouter le JWT (Access Token) avant chaque requête
api.interceptors.request.use((config) => {
  // Cohérence de la clé : on utilise 'accessToken' partout
  const accessToken = localStorage.getItem('refreshToken');

  if (accessToken) {
    console.log('Using Access Token:', accessToken);
    config.headers.Authorization = `Bearer ${accessToken}`;
  } else {
    console.warn('No Access Token found in localStorage. API call might fail if authentication is required.');
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Intercepteur pour gérer les réponses (401 Unauthorized et rafraîchissement)
api.interceptors.response.use((response) => {
  return response;
}, async (error) => {
  const originalRequest = error.config;

  // On vérifie d'abord si error.response existe pour éviter les crashs sur des erreurs réseau pures
  if (error.response && error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true; // Marquer la requête pour éviter une boucle infinie
    const refreshToken = localStorage.getItem('refreshToken');

    if (refreshToken) {
      try {
        // L'URL de base nettoyée évite désormais le double slash
        const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });
        const newAccessToken = refreshResponse.data.accessToken;

        // On sauvegarde le jeton sous la même clé 'accessToken'
        localStorage.setItem('accessToken', newAccessToken);

        // Retenter la requête originale avec le nouveau jeton
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        // Optionnel : Déconnecter l'utilisateur si le refresh token a expiré
        // localStorage.removeItem('accessToken');
        // localStorage.removeItem('refreshToken');
        return Promise.reject(refreshError);
      }
    }
  }
  return Promise.reject(error);
});

export const userService = {
  getCurrentUser: async (): Promise<UserDto> => {
    const response = await api.get<UserDto>('/users/me');
    console.log(response);
    return response.data;
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<UserDto> => {
    const response = await api.put<UserDto>('/users/me', data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await api.post('/users/me/change-password', data);
  },

  logout: async (): Promise<void> => {
    const data = localStorage.getItem('refreshToken');
    try {
      const reponse = await api.post('/auth/logout', data);
      console.log(reponse);

    } catch {
      console.log(Response);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }


  }
};