import { api } from './api';
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

  logout: async (): Promise<void> => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      await api.post('/auth/logout', { refreshToken });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }
};
