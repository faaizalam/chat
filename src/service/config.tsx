import { Platform } from 'react-native';

export const BASE_URL = Platform.select({
  ios: 'http://localhost:4000',
  android: 'http://10.0.2.2:4000',
});
