import { resetAndNavigate } from '../../utils/NavigationUtils';
import apiClient from '../apiClient';
import { handleStorage } from '../storage';

export const loginWithGoogle = async (idToken: string) => {

  console.log(idToken);
  const { data } = await apiClient.post('/user/google', { id_token: idToken });
  console.log(data,"worked");
  handleStorage('setAccessToken', data.tokens?.accessToken, 'accessToken');
  handleStorage('setRefreshToken', data.tokens?.refreshToken, 'refreshToken');
  return data?.user;
};

export const logout = async () => {
  handleStorage('removeAccessToken', '', 'accessToken');
  handleStorage('removeRefreshToken', '', 'refreshToken');
  resetAndNavigate('LoginScreen');
};

export const refresh_tokens = async (): Promise<boolean> => {
  try {
    const refreshToken = handleStorage('getRefreshToken',"", 'refreshToken');
    if (!refreshToken) throw new Error('No refresh token found');
    const { data } = await apiClient.post('/user/refresh', {
      refreshToken: refreshToken,
    });
    handleStorage('setAccessToken', data?.accessToken, 'accessToken');
    
    return true;
  } catch (error) {
    console.error('Error refreshing tokens:', error);
    return false;
  }
};
