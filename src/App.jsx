import React from 'react'
import {Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Booking from './pages/Booking'
import Payment from './pages/Payment'
import RNHOTEL from './assets/RN Castel.png'
// import { data } from './assets/data'
function App() {
  // console.log(data);

  return (
    <>
      <header className='flex justify-evenly h-24 bg-orange-600 items-center text-white'>
        <div className='h-24 w-24'>
          <img src={RNHOTEL} alt="" />
        </div>  

        <div className='flex flex-col items-center'>
          <div className='font-bold text-2xl'>Hotel RN Castel</div>
          <div className='text-sm'>Kolhapur</div>
        </div>

        <div>
          {/* Nav Menu */}
        </div>
      </header>
      
      <Routes >
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<Booking />} />
        <Route path='/payment' element={<Payment />} />
      </Routes>
     
    </>
  )
}

export default App

 