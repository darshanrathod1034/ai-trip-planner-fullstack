import React from 'react';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import { outline, skyline, world } from '../assets/assets';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className='relative'>
        <Navbar/>
        <Hero/>
        <img src={world} alt=""  className='mt-40 ml-85' />
        <div className='mt-20  text-center'>
          <h1 className='text-4xl font-bold'>Top destinations for your next holiday</h1>
          <h3 className='p-4 text-xl'>Here's where your fellow travellers are headed</h3>
        </div>



        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-[60%] place-items-center ml-85 mt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="relative rounded-lg overflow-hidden group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1563492065599-3520f775eeed?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Bangkok"
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-2xl font-bold">Bangkok,</h3>
                <p className="text-lg">Thailand</p>
              </div>
            </div>
          ))}
        </div>

          <img src={outline} className=' w-full ' />
          
          <div className='text-center mt-[-350px]'>
            <h1 className='text-5xl font-black'>Dont take our word for it</h1>
            <h4  className='text-xl mt-4'>See what our users have to say about revolutionizing their travel experiences with Trip Planner AI.
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-[60%] mt-8 ml-85">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-blue-50 p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="User"
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="ml-4">
                    <h4 className="font-semibold">Darshan Rathod</h4>
                    <div className="flex text-yellow-400">
                      {'★'.repeat(5)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">
                  Trip Planner AI saves time and stress by aiding travel planning, relieving indecision or uncertainty.
                </p>
              </div>
            ))}
          </div>
          </div>
          <img src={skyline} className='w-full' />
          <Footer/>
        </div>
  );
};

export default Home;