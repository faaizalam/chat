import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import { navigationRef } from '../utils/NavigationUtils';
import Home from '../screens/Home';
const Navigation = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="HomeScreen" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
