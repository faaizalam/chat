import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native';
import { UserGroupIcon } from 'react-native-heroicons/solid';


type PaymentButtonProps = {
    seat: number;
    price: number;
    onPay: () => void;
}
export default function PaymentButton({ seat, price, onPay }: PaymentButtonProps) {


    return (
        <View className='absolute bottom-0 w-full p-5 bg-white border-t-4 border-gray-200 rounded-3xl'>
            <View className='flex-row items-center justify-between'>
                <View>
                    <Text className='font-semibold font-okra text-xl'>
                        Amount
                    </Text>
                    <Text className='font-semibold font-okra text-xl'>
                        Tax Included
                    </Text>
                </View>
                <View>
                    <View className='flex-row items-center gap-3'>

                        <Text className='text-sm text-gray-500 line-through font-okra font-medium'>
                            ${(seat * price - (seat * price > 200 ? 100 : 0)).toFixed(0)}
                        </Text>

                        <Text className='text-lg font-bold font-okra'>
                            ${(seat * price).toFixed(0)}
                        </Text>


                    </View>
                        <View className='flex-row self-end items-center gap-1' >
                            <UserGroupIcon color={"gray"} size={16} />
                            <Text className='font-okra font-medium text-md'>{seat} P</Text>
                        </View>
                </View>
            </View>

            <TouchableOpacity onPress={onPay} className='bg-tertiary my-4 rounded-xl justify-center items-center p-3'>
                <Text className='text-white font-semiBold'>
                    Pay Now!
                </Text>
            </TouchableOpacity>

        </View>
    )
}
