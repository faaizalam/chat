import { View, Text, Platform, Modal } from 'react-native'
import React, { useState } from 'react'
import DateTimePicker from "@react-native-community/datetimepicker"

type DatePickerModalPorps={
    visible:boolean,
    onClose:()=>void
    onConfirm:(date:Date)=>void;
    selectedDate:Date
}
const DatePickerModal = ({visible,selectedDate,onClose,onConfirm}:DatePickerModalPorps) => {
    const [tempDate,setTempdate]=useState(selectedDate)

    if (Platform.OS==="android") {
        return(
            <DateTimePicker
            value={tempDate}
            mode='date'
            display="default"
            onChange={(event,date)=>{
                if (date) {
                    onConfirm(tempDate)
                    onClose()
                    
                }
            }}
            >

            </DateTimePicker>
        )
        
    }
  return (
   <Modal
   transparent
   visible={visible}
   animationType="slide"
   >
    <View className='flex-1 justify-center ' style={{backgroundColor:"rgba(0,0,0,0.5)"}}>
        <View className="bg-white p-4 rounded-3xl">

        </View>

    </View>

   </Modal>
  )
}

export default DatePickerModal