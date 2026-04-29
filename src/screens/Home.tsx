import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { UserCircleIcon } from "react-native-heroicons/solid";
import Bookings from '../componenets/home/Bookings';
import { logout } from '../service/requests/auth';
const Home = () => {
  return (
<View className="flex-1 bg-white">
  <SafeAreaView/>
  <View className='flex-row justify-between items-center px-4 py-2'>
  <Text className='font-okra font-semibold text-3xl'>
Bus Tickets
  </Text>
  <UserCircleIcon size={35} color="red" onPress={() => {
    logout();
  }} />
  </View>
  <Bookings/>
</View> 
  );
};

export default Home;
