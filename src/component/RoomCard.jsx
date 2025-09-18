import { useState } from 'react';

import { useBooking } from '../context/BookingContext'; // Adjust path if needed

const RoomCard = ({ room }) => {
  const { booking, addRoomToBooking, removeRoomFromBooking } = useBooking();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isBooked = booking.some(bookedRoom => bookedRoom.roomId === room.roomId);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  // --- Slider Navigation Handlers ---
  const hasMultipleImages = room.images && room.images.length > 1;

  const nextImage = (e) => {
    e.stopPropagation(); // Prevents card-level clicks if any
    setCurrentImageIndex(prevIndex => 
      prevIndex === room.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex(prevIndex => 
      prevIndex === 0 ? room.images.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index, e) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
  }

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 h-full">
        {/* --- Image Slider --- */}
      <div className="relative group">
        <img
          className="w-full h-56 object-cover"
          src={room.images?.[currentImageIndex] || 'https://via.placeholder.com/400x250?text=No+Image'}
          alt={`${room.roomType} view ${currentImageIndex + 1}`}
        />

        {!room.isAvailable && (
          <div className="absolute top-0 right-0 bg-red-700 text-white text-xs font-bold px-3 py-1 m-2 rounded-full z-10">
            Not Available
          </div>
        )}

        {/* Slider Controls */}
        {hasMultipleImages && (
          <>
            {/* Prev Button */}
            <button
              onClick={prevImage}
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1.5 hover:bg-opacity-75 focus:outline-none transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next Button */}
            <button
              onClick={nextImage}
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1.5 hover:bg-opacity-75 focus:outline-none transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
              {room.images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => goToImage(index, e)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentImageIndex === index ? 'bg-white scale-125' : 'bg-gray-300 bg-opacity-75'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                ></button>
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Room Image */}
      {/* <div className="relative">
        <img
          className="w-full h-56 object-cover"
          src={room.images?.[0] || 'https://via.placeholder.com/400x250?text=No+Image'}
          alt={room.roomType}
        />
        {!room.isAvailable && (
          <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 m-2 rounded-full">
            Not Available
          </div>
        )}
      </div> */}

      {/* Room Details */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{room.roomType}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{room.description}</p>

        {/* Icons for key info */}
        <div className="flex items-center justify-between text-gray-700 mb-4">
          <div className="flex items-center" title="Max Occupancy">
            {/* SVG Users Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0019 16v1h-6.07zM6 11a5 5 0 00-5 5v1h12v-1a5 5 0 00-5-5H6z" />
            </svg>
            <span>{room.maxOccupancy} Guests</span>
          </div>
          <div className="flex items-center" title="Bed Configuration">
            {/* SVG Bed Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h8V3a1 1 0 112 0v1h1a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zm1 10a1 1 0 00-1 1v1a1 1 0 102 0v-1a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{room.bedConfiguration.map(b => `${b.count} ${b.type}`).join(', ')}</span>
          </div>
        </div>
        
        {/* Amenities */}
        <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-500 mb-2">Amenities:</h4>
            <div className="flex flex-wrap gap-2">
                {room.amenities.slice(0, 4).map((amenity, index) => (
                    <span key={index} className="bg-orange-100 text-black text-xs font-medium px-2.5 py-1 rounded-full">
                        {amenity}
                    </span>
                ))}
                {room.amenities.length > 4 && (
                    <span className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full">
                        +{room.amenities.length - 4} more
                    </span>
                )}
            </div>
        </div>

        {/* Price and Action Button */}
        <div className="mt-auto pt-4 border-t border-gray-200 flex justify-between items-center">
          <p className="text-xl font-extrabold text-gray-900">
            {formatPrice(room.pricePerNight)}
            <span className="text-sm font-normal text-gray-500"> / night</span>
          </p>
          
          {isBooked ? (
            <button
              onClick={() => removeRoomFromBooking(room.roomId)}
              className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition-colors"
            >
              Remove
            </button>
          ) : (
            <button
              onClick={() => addRoomToBooking(room)}
              disabled={!room.isAvailable}
              className="px-4 py-2 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Add to Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomCard;