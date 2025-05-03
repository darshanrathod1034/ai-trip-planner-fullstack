import React from 'react'
import Navbar from '../components/Navbar'
import SearchBar from '../components/SearchBar'
import { outline, skyline, world } from '../assets/assets'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar/>
      <main className="flex-grow">
        {/* Hero Section */}
        <div className='mt-[80px] md:mt-[120px] text-center px-4'>
          <h1 className='text-3xl md:text-5xl font-bold text-[#E79C01]'>Discover Your Next Adventure with AI</h1>
          <Link to='/create-trip'>
            <button className='mt-8 md:mt-12 px-6 py-2 md:px-8 md:py-3 bg-blue-950 text-white rounded-full hover:bg-blue-900 transition-colors'>
              + Create Trip
            </button>
          </Link>
        </div>
        
        {/* World Image */}
        <div className="mt-10 md:mt-20 px-4">
          <img src={world} alt="World map" className='mx-auto w-full max-w-[1200px]' />
        </div>
        
        {/* Top Destinations Section */}
        <div className='mt-12 md:mt-20 text-center px-4'>
          <h1 className='text-2xl md:text-4xl font-bold'>Top destinations for your next holiday</h1>
          <h3 className='p-4 text-lg md:text-xl'>Here's where your fellow travellers are headed</h3>
        </div>
        
        {/* Destination Cards */}
        <div className="relative">
          <img src={outline} className='w-full' alt="Travel outline" />
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-[1200px] mx-auto mt-[-150px] md:mt-[-250px] lg:mt-[-350px] relative z-10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative rounded-lg overflow-hidden group cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1563492065599-3520f775eeed?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    alt="Bangkok"
                    className="w-full h-48 sm:h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl sm:text-2xl font-bold">Bangkok,</h3>
                    <p className="text-base sm:text-lg">Thailand</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Skyline Image */}
        <div className="mt-12 md:mt-20">
          <img src={skyline} className='w-full' alt="City skyline" />
        </div>
        <Footer/>
      </main>
      
      
    </div>
  )
}

export default Dashboard