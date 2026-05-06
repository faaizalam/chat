import { View, Text, Alert, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { navigate } from '../../utils/NavigationUtils';
import LinearGradient from 'react-native-linear-gradient';
import { MagnifyingGlassIcon } from 'react-native-heroicons/solid';
import { CalendarDaysIcon } from 'react-native-heroicons/solid';
import DatePickerModal from '../ui/DatePickerModal';
import LocationPicker from '../ui/LocationPicker';



const Search = () => {
  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [locationType, setLocationType] = useState<'from' | 'to'>('from');
  const [showLocationPicker, setShowLocationPicker] = useState(false);


  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 2);


  const handleLocationSet = (location: string, type: 'from' | 'to') => {
    if (type === 'from') {
      setFrom(location);
      if (location === to) {
        setTo(null);
      }
    } else {
      setTo(location);
    }
  };


  const handleSearchBuses = () => {
    if (!from || !to) {
      Alert.alert('Missing Information', 'Please select both source and destination');
      return;
    }
    if (from === to) {
      Alert.alert('Invalid Selection', 'Source and destination cannot be the same');
      return;
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      Alert.alert('Invalid Date', 'Please select a future travel date');

      return;
    }
    navigate("BusListScreen", { item: { from, to, date: date.toISOString() } })


  }


  console.log(showDatePicker);

  return (
    <View className="rounded-b-3xl overflow-hidden  ">
      <LinearGradient colors={["#78B0E6", "#fff"]} start={{ x: 1, y: 1 }} end={{ x: 1, y: 0 }}>
        <View className='p-4'>
          <View className="my-4 border border-1  z-20 bg-white rounded-md border-gray-600" >
            <TouchableOpacity onPress={() => {
              setLocationType("from")
              setShowLocationPicker(true)
            }} className="flex-row gap-4 items-center p-4">
              <Image className='h-6 w-6' source={(require("../../assets/images/bus.png"))} />
              <Text className='w-[90%] text-lg font-okra text-gray-600'>
                {from || "From"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setLocationType("to")
              setShowLocationPicker(true)
            }} className="flex-row gap-4 items-center p-4 border-t-[1px] border-b-[1px] ">
              <Image className='h-6 w-6' source={(require("../../assets/images/bus.png"))} />
              <Text className='w-[90%] text-lg font-okra text-gray-600'>
                {to || "To"}
              </Text>
            </TouchableOpacity>
            <View className='flex-row items-center p-2 justify-between'>
              <View className='flex-row items-center'>

                <TouchableOpacity className='p-2 mr-2 rounded-lg bg-secondary'
                  onPress={() => setDate(new Date())}
                >
                  <Text className="font-bold text-sm font-okra">
                    Today
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity className='p-2 mr-2 rounded-lg bg-secondary'
                  onPress={() => {

                    const currDate = new Date()
                    const tommDate = currDate.getDate() + 1
                    currDate.setDate(tommDate)
                    setDate(currDate)
                  }
                  }
                >
                  <Text className="font-bold text-sm font-okra">
                    Tommorrow
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity className='flex-row items-center ' onPress={() => setShowDatePicker(true)}>
                <View className='mx-2'>
                  <Text className='font-bold text-gray-500 font-okra'>
                    Date of Journey
                  </Text>
                  <Text className='font-bold text-gray-500 font-okra'>
                    {date?.toDateString()}
                  </Text>

                </View>
                <CalendarDaysIcon color={"#000"} size={25} />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity className='p-2 mr-2 rounded-xl bg-tertiary flex-row items-center gap-4 justify-center'
            onPress={handleSearchBuses}
          >
            <MagnifyingGlassIcon color={"#fff"} size={22} />
            <Text className="font-bold text-lg font-okra text-white">
              Search Buses
            </Text>
          </TouchableOpacity>
          <Image source={require("../../assets/images/sidebus.jpg")} className='h-40 rounded-lg w-full my-4' />
        </View>

      </LinearGradient>
      {showDatePicker && (
        <DatePickerModal
          visible={showDatePicker}
          onClose={() => {
            setShowDatePicker(false)
          }}
          onConfirm={setDate}
          selectedDate={date}
        />

      )}


      {
        showLocationPicker && (

          <LocationPicker
            visible={showLocationPicker}
            fromLocation={from || undefined}
            type={locationType}
            onSelect={handleLocationSet}
            onClose={() => {
              setShowLocationPicker(false)
            }}
          />
        )
      }


    </View>
  )
}

export default Search