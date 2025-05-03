import React from 'react'
import { Link } from 'react-router-dom'
import SearchBar from './SearchBar'

const Hero = () => {
  return (
      <div className="relative h-screen">
        <img 
          src="https://content.api.news/v3/images/bin/4491bf978b849ce0b2f54b196c81cbd9"
          alt="Mountain View"
          className="w-full h-full object-cover "
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
        <div className="absolute top-1/10 left-20 max-w-xl text-white">
          <h1 className=" mb-6">
            <span className="text-[#ffb700] text-[350px]" id='trip'>Trip</span>
            <br />
            <span className='text-[48px] absolute mt-[-120px]'>your next Vacation</span>
          </h1>
          <Link to='/signUp'>
          <button className="bg-white text-blue-900 px-8 py-3 text-[22px] rounded-full font-medium hover:bg-blue-50 cursor-pointer transition-colors">
            GET STARTED NOW
          </button>
          </Link>
        </div>
    </div>
    
  )
}

export default Hero
