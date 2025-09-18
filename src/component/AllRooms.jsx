import React from 'react';
import { useBooking } from '../context/BookingContext'; // Adjust path if needed
import RoomCard from '../component/RoomCard'; // Adjust path if needed
// Line 4 in AllRooms.jsx
// Corrected Line 4 in AllRooms.jsx
import DatePicker from '../component/Datepicker'

// import RoomFilters from '../component/RoomFilters';
const AllRooms = () => {
  const { rooms } = useBooking();

  if (!rooms || rooms.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-gray-700">No rooms available at the moment.</h2>
        
        <p className="text-gray-500">Please check back later.</p>
      </div>
    );
  }

  // const handleFilterChange = (filters) => {
  //   // Handle the filter change, e.g., update state or fetch data
  //   console.log('Filters changed:', filters);
  // };
  

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <header className="text-center mb-2 sm:mb-4">
          <h1 className="text-2xl md:text-4xl sm:text-md font-extrabold text-gray-900 tracking-tight">
            Explore Our Rooms
          </h1>
          <div className='mt-4'>
            <DatePicker />
          </div>
          
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 ">
            Choose the perfect space for your stay. Each room is designed for your comfort and convenience.
          </p>
          {/* <RoomFilters onFilterChange={handleFilterChange} /> */}
        </header>
        
        {/* Responsive grid layout for room cards */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {rooms.map((room) => (
            <RoomCard key={room.roomId} room={room} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllRooms;