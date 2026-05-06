import { View, Text, Image, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native'
import React, { useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import { fetchBuses } from '../service/requests/bus'
import { SafeAreaView } from 'react-native-safe-area-context'
import { goBack, navigate } from '../utils/NavigationUtils'
import { ArrowLeftIcon } from 'react-native-heroicons/solid'
import { buses } from 'src/utils/dummyData'

const BusListScreen = () => {
    const route = useRoute()
    const params = route.params as any


    const { from, to, date } = params.item || {}
    console.log(date);
    const { data:buses, isLoading, error } = useQuery({ queryKey: ['searchBuses', from, to, date], queryFn: () => fetchBuses(from, to, date), enabled: !!from && !!to && !!date })
   
   const renderItem=({item}: {item: any})=>{
        return (
            <TouchableOpacity
            className='bg-white mb-4 p-4 rounded-lg shadow-sm'
            onPress={()=>navigate("SeatSelectionScreen",{busId:item.busId})}
            >

            </TouchableOpacity>
        )
   }
   console.log(buses,error);
    return (
        <View className='flex-1 bg-white'>
            <SafeAreaView />
            <View className='bg-white p-4 flex-row items-center border-b-[1px] border-teal-800'>
                <TouchableOpacity onPress={goBack}>
                    <ArrowLeftIcon size={24} color='#000' />

                </TouchableOpacity>
                <View className="ml-4">
                    <Text className='text-lg font-bold'>
                        {from} - {to}
                    </Text>
                    <Text className='text-sm text-gray-500'>{new Date(date).toDateString()}</Text>
                </View>
            </View>
            {
                isLoading && (
                    <View  className='flex-1 justify-center items-center'>
                        <ActivityIndicator size={"large"} color="teal" />
                        <Text className=''>Loading buses....</Text>
                    </View>
                )
            }
            {
                error && (
                    <View  className='flex-1 justify-center items-center'>
                        <Text className='text-red-500 font-bold text-center'>Error loading buses:{error.message} </Text>
                        
                    </View>
                )
            }
            {
                !error && !isLoading && buses.length === 0 && (
                    <View  className='flex-1 justify-center items-center'>
                        <Text className="text-gray-500 font-bold">No Buses found</Text>
                        
                    </View>
                )
            }

            <FlatList
            data={buses}
            renderItem={renderItem}
            keyExtractor={(item)=>item.busId}
            contentContainerStyle={{padding:16}}
            />


        </View>
    )
}

export default BusListScreen