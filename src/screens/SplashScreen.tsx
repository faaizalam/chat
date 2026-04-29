import { View, Text, Image, Alert } from 'react-native';
import React, { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { resetAndNavigate } from '../utils/NavigationUtils';
import { handleStorage } from '../service/storage';
import { refresh_tokens } from '../service/requests/auth';

type DecodedToken = {
  exp: number;
};

const SplashScreen = () => {
  console.log('SplashScreen rendered');
  const tokenCheck = async () => {
    const accessToken = handleStorage('getAccessToken',"", 'accessToken');
    const refreshToken = handleStorage(
      'getRefreshToken',
      "",
      'refreshToken',
    ) as string;
    if (!accessToken) {
      console.log(accessToken, 'nhi h');
      // No access token, navigate to login
      resetAndNavigate('LoginScreen');
      return;
    }

    const currentTime = Date.now() / 1000; // Current time in seconds
    const decodedAccessToken = jwtDecode<DecodedToken>(accessToken);
    const decodedRefreshToken = jwtDecode<DecodedToken>(refreshToken);
    if (decodedRefreshToken.exp < currentTime) {
      resetAndNavigate('LoginScreen');
      Alert.alert(
        'Session Expired',
        'Your session has expired. Please log in again.',
      );
      return;
    }
    if (decodedAccessToken?.exp < currentTime) {

      console.log(decodedAccessToken);
      console.log(decodedRefreshToken);
      const refreshed = await refresh_tokens();
      if (!refreshed) {
        Alert.alert('there was an error');
        return;
      }
    }

    resetAndNavigate('HomeScreen');
    return;
  };

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      console.log('wokred');
      await tokenCheck();
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <View className="flex-1 justify-center bg-white items-center">
      <Image
        source={require('../assets/images/logo_t.png')}
        className="h-[30%] w-[60%]"
      />
    </View>
  );
};

export default SplashScreen;
