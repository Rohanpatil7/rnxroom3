import React, { useState, useEffect, useMemo } from 'react';
// import { useBooking } from '../context/BookingContext'; // Adjust path if needed    

const RoomFilters = ({ rooms=[], onFilterChange }) => {
  // State to manage the visibility of the filter modal on mobile
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  // State for each filter
  const [price, setPrice] = useState(500);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);

  /// Make sure rooms is initialized to an empty array
//   const rooms = props.rooms || [];

  // Derive unique room types and amenities from the room data
  const uniqueTypes = useMemo(() => [...new Set(rooms.map   (room => room.roomType))], [rooms]);
  const allAmenities = useMemo(() => [...new Set(rooms.flatMap(room => room.amenities))], [rooms]);

  // This effect triggers the filtering logic whenever a filter state changes
  useEffect(() => {
    let filtered = rooms;

    // 1. Filter by availability
    if (showAvailableOnly) {
      filtered = filtered.filter(room => room.isAvailable);
    }
    
    // 2. Filter by price
    filtered = filtered.filter(room => room.pricePerNight <= price);

    // 3. Filter by room type
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(room => selectedTypes.includes(room.roomType));
    }

    // 4. Filter by amenities
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter(room => 
        selectedAmenities.every(amenity => room.amenities.includes(amenity))
      );
    }

    onFilterChange(filtered);
  }, [price, selectedTypes, selectedAmenities, showAvailableOnly, rooms, onFilterChange]);

  const handleTypeChange = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleAmenityChange = (amenity) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const clearFilters = () => {
      setPrice(500);
      setSelectedTypes([]);
      setSelectedAmenities([]);
      setShowAvailableOnly(true);
  }

  const filtersUI = (
    <div className="space-y-6">
      {/* Price Filter */}
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Max Price: <span className="font-bold text-blue-600">₹{price}</span></label>
        <input
          type="range"
          id="price"
          min="100"
          max="500"
          step="25"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Availability Filter */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Show Available Only</span>
        <button
          onClick={() => setShowAvailableOnly(!showAvailableOnly)}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${showAvailableOnly ? 'bg-blue-600' : 'bg-gray-300'}`}
        >
          <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${showAvailableOnly ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>

      {/* Room Type Filter */}
      <div>
        <h4 className="font-medium text-gray-700 mb-2">Room Type</h4>
        <div className="space-y-2">
          {uniqueTypes.map(type => (
            <label key={type} className="flex items-center">
              <input type="checkbox" checked={selectedTypes.includes(type)} onChange={() => handleTypeChange(type)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="ml-2 text-sm text-gray-600">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities Filter */}
      <div>
        <h4 className="font-medium text-gray-700 mb-2">Amenities</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {allAmenities.map(amenity => (
            <label key={amenity} className="flex items-center">
              <input type="checkbox" checked={selectedAmenities.includes(amenity)} onChange={() => handleAmenityChange(amenity)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="ml-2 text-sm text-gray-600">{amenity}</span>
            </label>
          ))}
        </div>
      </div>
       <button onClick={clearFilters} className="w-full text-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
        Clear All Filters
      </button>
    </div>
  );

  return (
    <>
      {/* --- DESKTOP FILTERS (Sidebar) --- */}
      <aside className="hidden lg:block lg:w-64 xl:w-72 flex-shrink-0 pr-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Filters</h3>
        {filtersUI}
      </aside>

      {/* --- MOBILE FILTERS (Button + Modal) --- */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsMobileFiltersOpen(true)}
          className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          {/* SVG Filter Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Show Filters
        </button>
      </div>

      {/* Mobile Filter Modal */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" aria-hidden="true">
          <div className="fixed inset-0 flex">
            <div className="relative w-full max-w-xs bg-white h-full shadow-xl py-4 pb-6 flex flex-col overflow-y-auto">
              <div className="px-4 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  className="-mr-2 w-10 h-10 p-2 flex items-center justify-center text-gray-400 hover:text-gray-500"
                  onClick={() => setIsMobileFiltersOpen(false)}
                >
                  {/* SVG Close (X) Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mt-4 border-t border-gray-200 px-4 py-6">
                {filtersUI}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RoomFilters;