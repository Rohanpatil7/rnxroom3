import React, { useState, useRef, useEffect } from 'react';

// --- Helper Icons ---
const CalendarIcon = () => (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
);
const UserIcon = () => (
     <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
);
const MoonIcon = () => (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
);
const SearchIcon = () => (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
);


// Reusable Booking Widget Component
const DatePicker = () => {
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [guests, setGuests] = useState(1);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [activeInput, setActiveInput] = useState(null);

    const [displayDate, setDisplayDate] = useState(new Date());
    const [hoverDate, setHoverDate] = useState(null);
    
    const [calendarAnimation, setCalendarAnimation] = useState(false);

    const widgetRef = useRef(null);

    const GUEST_LIMIT = 10; // Set the guest limit

    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (widgetRef.current && !widgetRef.current.contains(event.target)) {
                if(isCalendarOpen) closeCalendar();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isCalendarOpen]);

    const openCalendar = () => {
        setIsCalendarOpen(true);
        setTimeout(() => setCalendarAnimation(true), 10); // allow DOM to update
    }

    const closeCalendar = () => {
        setCalendarAnimation(false);
        setTimeout(() => {
            setIsCalendarOpen(false);
            setActiveInput(null);
        }, 300); // match animation duration
    }
    
    const handleInputClick = (inputType) => {
        const newDisplayDate = (inputType === 'checkin' ? checkInDate : checkOutDate) || checkInDate || new Date();
        setDisplayDate(newDisplayDate);
        if (!isCalendarOpen) openCalendar();
        setActiveInput(inputType);
    };

    const handleDateSelect = (selected) => {
        if (activeInput === 'checkin') {
            setCheckInDate(selected);
            setCheckOutDate(null);
            setHoverDate(null);
            setActiveInput('checkout');
        } else if (activeInput === 'checkout' && checkInDate && selected > checkInDate) {
            setCheckOutDate(selected);
            closeCalendar();
        } else {
             setCheckInDate(selected);
             setCheckOutDate(null);
             setHoverDate(null);
             setActiveInput('checkout');
        }
    };
    
    const handleMonthChange = (offset) => {
        setDisplayDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + offset, 1));
    };

    const calculateDuration = () => {
        if (!checkInDate || !checkOutDate) return 0;
        const diffTime = Math.abs(checkOutDate - checkInDate);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const duration = calculateDuration();

    const formatDate = (date) => {
        if (!date) return null;
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // eslint-disable-next-line no-unused-vars
    const renderMonthGrid = (dateForMonth, monthOffset = 0) => {
        const year = dateForMonth.getFullYear();
        const month = dateForMonth.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();

        const blanks = Array(firstDay).fill(null);
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return (
            <div className="grid grid-cols-7 gap-1 text-center">
                 {daysOfWeek.map(day => <div key={`${month}-${day}`} className="text-xs font-semibold text-gray-400 py-1">{day}</div>)}
                 {blanks.map((_, i) => <div key={`blank-${month}-${i}`}></div>)}
                 {days.map(day => {
                    const date = new Date(year, month, day);
                    date.setHours(0,0,0,0);
                    
                    const isDisabled = date < today || (activeInput === 'checkout' && checkInDate && date <= checkInDate);
                    const isToday = date.getTime() === today.getTime();

                    const isCheckIn = checkInDate && date.getTime() === checkInDate.getTime();
                    const isCheckOut = checkOutDate && date.getTime() === checkOutDate.getTime();
                    
                    const isInRange = checkInDate && checkOutDate && date > checkInDate && date < checkOutDate;
                    const isHoverInRange = checkInDate && !checkOutDate && hoverDate && date > checkInDate && date <= hoverDate;

                    const dayClasses = `
                        w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 text-sm
                        ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer'}
                        ${isCheckIn && 'bg-indigo-600 text-white rounded-r-none'}
                        ${isCheckOut && 'bg-indigo-600 text-white rounded-l-none'}
                        ${(isInRange || isHoverInRange) && !(isCheckIn || isCheckOut) ? 'bg-indigo-100 text-indigo-700 rounded-none' : ''}
                        ${!isCheckIn && !isCheckOut && !(isInRange || isHoverInRange) && !isDisabled ? 'text-gray-700 hover:bg-gray-200' : ''}
                        ${isToday && !isCheckIn && !isCheckOut && !isInRange && 'font-bold ring-2 ring-indigo-300'}
                    `;

                    return (
                        <div key={day} 
                            className={dayClasses} 
                            onClick={() => !isDisabled && handleDateSelect(date)}
                            onMouseEnter={() => !isDisabled && checkInDate && !checkOutDate && setHoverDate(date)}
                            onMouseLeave={() => setHoverDate(null)}
                            >
                            {day}
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderCalendar = () => {
        const secondMonthDate = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1);
        
        return (
            <div className={`absolute z-10 top-[20%] mt-2 w-full md:w-auto bg-white border border-gray-200 rounded-2xl shadow-2xl p-4 right-0 md:right-auto transform transition-all duration-300 ease-in-out ${calendarAnimation ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                <div className="flex items-center justify-between mb-4 px-2">
                    <button type="button" onClick={() => handleMonthChange(-1)} className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <div className="flex-grow text-center text-lg font-semibold text-gray-800 md:hidden">
                        {monthNames[displayDate.getMonth()]} {displayDate.getFullYear()}
                    </div>
                    <button type="button" onClick={() => handleMonthChange(1)} className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
                <div className="flex flex-col md:flex-row md:gap-8">
                    <div>
                        <div className="hidden md:block text-lg font-semibold text-gray-800 text-center mb-2">
                            {monthNames[displayDate.getMonth()]} {displayDate.getFullYear()}
                        </div>
                        {renderMonthGrid(displayDate, 0)}
                    </div>
                    <div className="mt-4 md:mt-0 hidden md:block">
                        <div className="text-lg font-semibold text-gray-800 text-center mb-2">
                             {monthNames[secondMonthDate.getMonth()]} {secondMonthDate.getFullYear()}
                        </div>
                        {renderMonthGrid(secondMonthDate, 1)}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div ref={widgetRef} className="bg-white p-4 sm:p-6 rounded-2xl shadow-2xl shadow-gray-200/60 border border-gray-200/80 relative">
            <div className="space-y-4">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                        <label className="block text-xs font-bold text-gray-500 mb-1 tracking-wider uppercase">Check-in</label>
                        <div onClick={() => handleInputClick('checkin')} className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${activeInput === 'checkin' ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200'} rounded-lg cursor-pointer transition-all`}>
                            <span className={checkInDate ? 'text-gray-800 font-semibold' : 'text-gray-400'}>{checkInDate ? formatDate(checkInDate) : 'Add date'}</span>
                        </div>
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none mt-5"><CalendarIcon /></div>
                    </div>
                     <div className="relative">
                        <label className="block text-xs font-bold text-gray-500 mb-1 tracking-wider uppercase">Check-out</label>
                        <div onClick={() => handleInputClick('checkout')} className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${activeInput === 'checkout' ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200'} rounded-lg cursor-pointer transition-all`}>
                            <span className={checkOutDate ? 'text-gray-800 font-semibold' : 'text-gray-400'}>{checkOutDate ? formatDate(checkOutDate) : 'Add date'}</span>
                        </div>
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none mt-5"><CalendarIcon /></div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                        <label className="block text-xs font-bold text-gray-500 mb-1 tracking-wider uppercase">Guests</label>
                        <div className="relative flex items-center border border-gray-200 rounded-lg bg-gray-50">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><UserIcon /></div>
                            <span className="w-full text-center text-gray-800 font-semibold pl-12 py-3">{guests}  {guests > 1 ? 's' : ''}</span>
                            <div className="flex items-center p-1">
                                <button onClick={() => setGuests(g => Math.max(1, g - 1))} className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 transition-colors" disabled={guests <= 1}>-</button>
                                <button onClick={() => setGuests(g => g + 1)} className="p-2 rounded-full hover:bg-gray-200 transition-colors" disabled={guests >= GUEST_LIMIT}>+</button>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <label className="block text-xs font-bold text-gray-500 mb-1 tracking-wider uppercase">Duration</label>
                        <div className="relative flex items-center border border-gray-200 rounded-lg bg-gray-100 h-12">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><MoonIcon /></div>
                            <span className="w-full text-center text-gray-600 font-semibold">
                                {duration > 0 ? `${duration} night${duration > 1 ? 's' : ''}` : '--'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6">
                 <button className="w-full flex items-center justify-center bg-orange-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 active:scale-95 transition-all duration-200 shadow-xs shadow-indigo-500 ">
                    <SearchIcon/> Search
                </button>
            </div>
            
            {isCalendarOpen && renderCalendar()}
        </div>
    );
};

export default DatePicker;
