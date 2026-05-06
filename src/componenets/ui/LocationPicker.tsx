import { View, Text, Modal, TextInput, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import { locations } from '../../utils/dummyData';
import { SafeAreaView } from 'react-native-safe-area-context';


type LocationPickerProps = {
    visible: boolean;
    onClose: () => void;
    type: "from" | "to"
    fromLocation?: string;
    onSelect: (location: string, type: "from" | "to") => void;
}
const LocationPicker = (props: LocationPickerProps) => {
    const { visible, onClose, type, fromLocation, onSelect } = props;
    const [search, setSeacrh] = React.useState("");
    const filetredLocations = locations.filter((location) => location.toLowerCase().includes(search.toLowerCase()));
    return (
        <Modal transparent={false} visible={visible} animationType='slide'>

            <View className='flex-1 bg-white p-4'>
         <SafeAreaView/>
                <Text className='text-lg font-okra font-bold text-center mb-4'>
                    Select {type === "from" ? "Departure" : "Arrival"} City
                </Text>
                <TextInput className='border border-gray-400 rounded mb-4'
                    placeholder='Search City...'
                    value={search}
                    onChangeText={setSeacrh}
                />
          <FlatList data={filetredLocations} keyExtractor={(item) => item} renderItem={({ item }) => {
            if(type === "to" && item === fromLocation) {
                return null;
            }
            return (
                <TouchableOpacity className='p-3 border-b border-gray-200' onPress={() => {
                    onSelect(item, type);
                    onClose();
                }}>
                    <Text className={`text-base font-okra ${item === fromLocation ? "text-gray-400" : "text-black"}`}>
                        {item}
                    </Text>
                </TouchableOpacity>
            )
          }
            }
            />


         

                <TouchableOpacity onPress={onClose}
                    className='p-3 bg-gray-300 rounded-lg mt-4'
                >
                    <Text className="text-center text-back font-bold">
                        Cancel
                    </Text>

                </TouchableOpacity>
            </View>





        </Modal>
    )
}

export default LocationPicker