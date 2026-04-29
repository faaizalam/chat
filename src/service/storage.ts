import { createMMKV } from 'react-native-mmkv'

export const storage = createMMKV()

// Rename function to avoid conflict with built-in localStorage
export const handleStorage = (
  action: string,
  value: string,
  key?: string,
): string | void => {
  switch (action) {
    case 'getAccessToken':
      console.log(key, "getting access token");
      if (!key) throw new Error('Key is required for getAccessToken');
      return storage.getString(key || 'accessToken') || '';
    case 'setAccessToken':
      if (!value) throw new Error('Value is required for setAccessToken');
      storage.set(key || 'accessToken', value);
      break;
    case 'removeAccessToken':
      if (!key) throw new Error('Key is required for removeAccessToken');
      storage.remove(key || 'accessToken');
      break;
    case 'removeRefreshToken':
      if (!key) throw new Error('Key is required for removeRefreshToken');
      storage.remove(key || 'accessToken');
      break;
    case 'setRefreshToken':
      if (!value) throw new Error('Value is required for setRefreshToken');
      storage.set(key || 'refreshToken', value);
      break;
    case 'getRefreshToken':
      console.log(key, "getting refresh token");
      if (!key) throw new Error('Key is required for getRefreshToken');
      return storage.getString(key || 'refreshToken') || '';
    default:
      throw new Error(`Unknown action: ${action}`);
  }
};
