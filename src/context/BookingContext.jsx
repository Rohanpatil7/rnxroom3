import React, { createContext, useState, useContext } from 'react';
// Import the raw room data from your file
import { rooms as initialRooms } from '../assets/data'; // Adjust the path if necessary

// 1. Create the Context
// This defines the "shape" of the data that will be available.
const BookingContext = createContext({
  rooms: [],
  booking: [],
  addRoomToBooking: () => {},
  removeRoomFromBooking: () => {},
});

// 2. Create the Provider Component
export const BookingProvider = ({ children }) => {
  // State for the list of all rooms (initialized from your data file)
  const [rooms] = useState(initialRooms);
  
  // State for the user's current booking (starts empty)
  const [booking, setBooking] = useState([]);

  // Function to add a room to the booking
  const addRoomToBooking = (roomToAdd) => {
    // Prevent adding the same room twice
    if (!booking.find(room => room.roomId === roomToAdd.roomId)) {
      setBooking(prevBooking => [...prevBooking, roomToAdd]);
    } else {
      console.warn("This room is already in the booking.");
    }
  };

  // Function to remove a room from the booking
  const removeRoomFromBooking = (roomIdToRemove) => {
    setBooking(prevBooking => prevBooking.filter(room => room.roomId !== roomIdToRemove));
  };

  // The value object holds all the state and functions
  const value = {
    rooms,
    booking,
    addRoomToBooking,
    removeRoomFromBooking,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

// 3. Create a Custom Hook for easy consumption (Best Practice)
// eslint-disable-next-line react-refresh/only-export-components
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};