import { View, Text, ActivityIndicator, TouchableOpacity, Alert, ScrollView } from 'react-native'
import React from 'react'
import { useRoute, useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { bookTicket, fetchBuseDetails } from '../service/requests/bus'
import { goBack, resetAndNavigate } from '../utils/NavigationUtils'

import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowDownLeftIcon } from 'react-native-heroicons/solid'
import { ArrowLeftIcon } from 'react-native-heroicons/solid'
import TicketModal from '../componenets/ui/TicketModal'
import PaymentButton from '../componenets/ui/PaymentButton'
import { StarIcon } from 'react-native-heroicons/solid'
import Seats from '../componenets/ui/Seats'

type ticketDataProps = { busId: string; seatNumbers: number[], date: string }
const SeatSelectionScreen = () => {


  const [ticketVisible, setTicketVisible] = React.useState(false)
  const [selectedSeats, setSelectedSeats] = React.useState<number[]>([])
  const route = useRoute()
  const { busId } = route.params as { busId: string }
  console.log(busId);
  const { data: busInfo, isLoading, isError, refetch } = useQuery({
    queryKey: ['busDetails', busId],
    queryFn: () => fetchBuseDetails(busId),
  })




  useFocusEffect(
    useCallback(() => {
      refetch()
    }, [busId]),
  )


  const bookTicketMutation = useMutation({
    mutationFn: (ticketData: ticketDataProps) => {


      return bookTicket(ticketData)
    },
    onSuccess: (data) => {
      setTicketVisible(true)
    },
    onError: (error: any) => {
      const errorMessage = error instanceof Error
        ? (error as any)?.response?.data?.message || error.message || 'Unknown error'
        : 'Unknown error';
      Alert.alert('Booking Failed', errorMessage);
      console.error('Booking errors:', errorMessage);
    }
  })



  if (isLoading) {
    return (
      <View className='flex-1 items-center justify-center'>
        <ActivityIndicator size="large" color="teal" />
        <Text>Loading bus details...</Text>
      </View>
    )

  }

  const handdleSeatSelection = (seatNumber: number) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(prev => prev.filter(seat => seat !== seatNumber))
    } else {
      setSelectedSeats(prev => [...prev, seatNumber])
    }
  }


  const handleOnPay = () => {
    if (selectedSeats.length === 0) {
      Alert.alert('No Seats Selected', 'Please select at least one seat to proceed with booking.');
      return;
    }
    bookTicketMutation.mutate({
      busId,
      seatNumbers: selectedSeats,
      date: new Date(busInfo?.departureTime).toISOString()
    })
  }

  if (isError) {
    return (
      <View className='flex-1 items-center justify-center'>
        <Text>Error loading bus details.</Text>
        <TouchableOpacity onPress={goBack}>
          <Text className='text-blue-500'>Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }
  console.log(busInfo, "ueee");
  return (
    <View className='flex-1 bg-white'>
      <SafeAreaView />
      <View className='bg-white flex-row items-center border-b-4 border-teal-400 p-4'>
        <TouchableOpacity onPress={goBack}>
          <ArrowLeftIcon size={24} color="#000" />
        </TouchableOpacity>
        <View className='ml-4'>
          <Text className='text-lg font-bold'>
            Seat Selection

          </Text>
          <Text className='text-sm text-gray-500'>
            {busInfo?.from} - {busInfo?.to}

          </Text>
          <Text className='text-sm text-gray-500'>
            {new Date(busInfo.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            {" "}
            {new Date(busInfo?.departureTime).toLocaleDateString()}
          </Text>
        </View>

      </View>
      <ScrollView showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 200 }} className=' bg-teal-100 p-4 pb-20'>
        <Seats
        selectedSeats={selectedSeats}
        seats={busInfo?.seats}
        onSelectSeat={handdleSeatSelection}
        />
        <View className="bg-white rounded-lg p-4 drop-shadow-sm">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-semibold">
              {busInfo?.company}
            </Text>

            <View className="flex-row items-center">
              <StarIcon size={18} color="gold" />

              <Text className="ml-1 text-gray-600 text-sm">
                {busInfo?.rating} ({busInfo?.totalReviews})
              </Text>
            </View>
          </View>
          <Text>
            {busInfo?.busType}
          </Text>
          <View className="flex-row justify-between mt-2">
            <View className="items-center">
              <Text className="text-lg font-bold">
                {new Date(busInfo?.departureTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
              <Text className="text-sm text-gray-500">Departure</Text>
            </View>

            <Text className="text-sm text-gray-500">
              {busInfo?.duration}
            </Text>

            <View className="items-center">
              <Text className="text-lg font-bold">
                {new Date(busInfo?.arrivalTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
              <Text className="text-sm text-gray-500">Arrival</Text>
            </View>
          </View>
          <Text className="mt-3 text-green-600 text-sm">
            {
              busInfo?.seats?.flat().filter((seat: any) => !seat.booked)
                .length
            }{' '}
            Seats Available
          </Text>
          <View className="flex-row items-center mt-2">
            <Text className="text-gray-400 line-through text-lg">
              ₹{busInfo?.originalPrice}
            </Text>

            <Text className="text-xl font-bold text-black ml-2">
              ₹{busInfo?.price} (1/p)
            </Text>
          </View>

          <View className="flex-row gap-2 mt-3">
            {busInfo?.badges?.map((badge: string, index: number) => (
              <View
                key={index}
                className="bg-yellow-200 px-2 py-1 rounded-full"
              >
                <Text className="text-xs text-yellow-800 font-semibold">
                  {badge}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <PaymentButton
        seat={selectedSeats.length || 0}
        price={busInfo.price}
        onPay={handleOnPay}
      />

      {
        ticketVisible && (
          <TicketModal
            visible={ticketVisible}
            bookingInfo={{
              from: busInfo?.from,
              to: busInfo?.to,
              departureTime: new Date(busInfo?.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              arrivalTime: new Date(busInfo?.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              date: new Date(busInfo?.date).toDateString(),
              company: busInfo?.company,
              busType: busInfo?.busType || "xxxxxx",
              ticketNumber: bookTicketMutation.data?._id || "xxxxxxxxxxxx",
              pnr: bookTicketMutation.data?.pnr,
              seats: bookTicketMutation.data?.seatsNumbers,
              fare: `$${busInfo?.price * selectedSeats.length}`
            }}
            onClose={() => {
              resetAndNavigate("HomeScreen")
              setTicketVisible(false)

            }}
          />
        )
      }
    </View>
  )
}

export default SeatSelectionScreen