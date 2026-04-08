import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useMutation } from '@tanstack/react-query';
import { loginWithGoogle } from '../service/requests/auth';
import { resetAndNavigate } from '../utils/NavigationUtils';
GoogleSignin.configure({
  webClientId:
    '90409122631-v8j3clms6t8ink1u2nh665p1j1gtl5p3.apps.googleusercontent.com',
});
const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const loginMutation = useMutation({
    mutationFn: loginWithGoogle,
    onSuccess: data => {
      resetAndNavigate('HomeScreen');
    },
  });

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      loginMutation.mutate(response.data?.idToken as string);
    } catch (error) {
      console.error('Google Sign-In error:', error);
    }
  };

  return (
    <View>
      <Image
        source={require('../assets/images/cover.jpeg')}
        className="w-full h-64 bg-cover"
      />
      <View className="p-4">
        <Text className="font-okra font-semibold text-xl text-center">
          Create Account or Sign in
        </Text>
        <View className="my-4 mt-12 border-[1px] gap-2 border-black px-2 flex-row items-center">
          <Text className="font-okra w-[10%] font-bold text-base">+91</Text>
          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            maxLength={10}
            keyboardType="number-pad"
            placeholder="Enter 10 digit phone number"
            className="font-okra h-11 w-[90%]"
          ></TextInput>
        </View>
        <TouchableOpacity
          onPress={handleGoogleLogin}
          className="bg-tertiary justify-center items-center p-3"
        >
          <Text className="font-okra text-white font-semibold">Let's Go</Text>
        </TouchableOpacity>
        <Text className="text-center my-8 text-sm font-okra text-gray-500">
          ---------- OR -----------
        </Text>

        <View className=" items-center justify-center flex-row gap-4">
          <TouchableOpacity
            className="border border-1 border-gray-300 p-2"
            onPress={handleGoogleLogin}
          >
            <Image
              source={require('../assets/images/google.png')}
              className="w-5 h-5 contain-size"
            ></Image>
          </TouchableOpacity>
          <TouchableOpacity className="border border-1 border-gray-300 p-2">
            <Image
              source={require('../assets/images/apple.png')}
              className="w-5 h-5 contain-size"
            ></Image>
          </TouchableOpacity>
        </View>
        <Text className="mt-5 font-okra font-semibold text-center text-gray-500">
          By Signing in, you agree to our Terms of Service and Privacy Policy.
          We will
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;
