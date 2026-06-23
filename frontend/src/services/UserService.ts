import api from '@/lib/axios';
import { type UserDto, type UpdateProfileRequest, type ChangePasswordRequest } from '@/types/user.types';

export const userService = {
  getCurrentUser: async (): Promise<UserDto> => {
    const response = await api.get<UserDto>('/users/me');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<UserDto> => {
    const response = await api.put<UserDto>('/users/me', data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await api.post('/users/me/change-password', data);
  },

  /** Fait évoluer le compte CLIENT vers PRO (propriétaire). */
  becomePro: async (): Promise<UserDto> => {
    const response = await api.post<UserDto>('/users/me/devenir-pro');
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
  }
};
