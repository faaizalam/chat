import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native'
import React from 'react'
import { tabs } from '../../utils/dummyData';
import Search from './Search';
import { useQuery } from '@tanstack/react-query';
import { useFocusEffect } from '@react-navigation/native';
import BookItem from './BookItem';
import { fetchUserTickets } from '../../service/requests/bus';

const Bookings = () => {
  const [selectedTab, setSelectedTab] = React.useState('All');
  const [refreshing, setRefreshing] = React.useState(false);
  const { data: tickets, isLoading, isError,refetch } = useQuery<any[]>({
    queryKey: ["userTickets"],
    staleTime: 1000 * 60 * 5,
    queryFn:fetchUserTickets,
    refetchOnWindowFocus: true
  })

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  const onRefresh = async() => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }

  const filteredBookings = selectedTab === "All" ? tickets : tickets?.filter((ticket: any) => ticket.status === selectedTab)

  if(isLoading) {
    return (
      <View className='flex-1 justify-center items-center bg-white'>
        <ActivityIndicator size="large" color="teal" />
        <Text className='text-gray-500 mt-2'>Fetching bookings...</Text>
      </View>
    )
  }
  if(isError) {
    return (
      <View className='flex-1 justify-center items-center bg-white'>
        <Text className='text-red-500'>Error fetching bookings.</Text>
        <TouchableOpacity onPress={()=>refetch()} className='mt-4 px-4 py-2 bg-teal-500 rounded'>
          <Text className='text-white font-bold'>Try Again</Text>
        </TouchableOpacity>
      </View>
    )
  } 
   
  return (
    <View className='flex-1 p-2 bg-white'>
      <FlatList
        ListHeaderComponent={
          <>
            <Search />
            <Text className='text-2xl font-bold my-4'>
              Past Bookings
            </Text>

            <View className='flex-row mb-4'>
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab}
                  className={`px-4 py-2 rounded-lg  mx-1
                     ${selectedTab === tab ? "bg-red-500" : 'bg-gray-300'}`}
                  onPress={() => setSelectedTab(tab)}
                >
                  <Text className={` text-sm font-bold ${selectedTab === tab ? 'text-white' : 'text-black'}`}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        }
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item._id}
        data={filteredBookings}
        nestedScrollEnabled
        ListEmptyComponent={
          <View className='items-center mt-6'>
            <Text className='text-gray-500'>No bookings found.</Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
        }
        renderItem={({item})=><BookItem  item={item}/>}

      />


    </View>
  )
}

export default Bookings