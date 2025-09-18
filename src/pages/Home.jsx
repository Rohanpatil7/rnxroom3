import React from 'react'
import AllRooms from '../component/AllRooms'
import { BookingProvider } from '../context/BookingContext';
// import RoomFilters from '../component/RoomFilters';
// import DatePicker from '../component/DatePicker'; // Adjust path if needed
function Home() {

   
  return (
      <div>
         <BookingProvider>
            <AllRooms />
         </BookingProvider>
      </div>
  )
}

export default Home 