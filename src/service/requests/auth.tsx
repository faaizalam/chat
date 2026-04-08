import { resetAndNavigate } from '../../utils/NavigationUtils';
import apiClient from '../apiClient';
import { handleStorage } from '../storage';

export const loginWithGoogle = async (idToken: string) => {
  const { data } = await apiClient.post('/user/login', { id_token: idToken });

  handleStorage('setAccessToken', data?.accessToken, 'accessToken');
  handleStorage('setRefreshToken', data?.refreshToken, 'refreshToken');
  return data?.user;
};

export const logout = async () => {
  handleStorage('removeAccessToken', '', 'accessToken');
  handleStorage('removeRefreshToken', '', 'refreshToken');
  resetAndNavigate('LoginScreen');
};

export const refresh_tokens = async (): Promise<boolean> => {
  try {
    const refreshToken = handleStorage('getRefreshToken', 'refreshToken');
    if (!refreshToken) throw new Error('No refresh token found');
    const { data } = await apiClient.post('/user/refresh', {
      refresh_token: refreshToken,
    });
    handleStorage('setAccessToken', data?.accessToken, 'accessToken');
    handleStorage('setRefreshToken', data?.refreshToken, 'refreshToken');
    return true;
  } catch (error) {
    console.error('Error refreshing tokens:', error);
    return false;
  }
};
