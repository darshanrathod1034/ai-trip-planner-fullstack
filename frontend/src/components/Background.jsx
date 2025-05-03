import React from 'react';
import { outline, skyline } from '../assets/assets';

const Background = () => {
  return (
    <div className='w-full mt-10 bg-blue-50 relative overflow-hidden'>
      {/* Outline image with responsive sizing */}
      <img 
        src={outline} 
        className='w-full h-auto object-cover'
        alt="City outline silhouette"
        loading="lazy"
      />
      
      {/* Skyline image with responsive sizing */}
      <img 
        src={skyline}  
        className='w-full h-auto object-contain max-w-[1800px] mx-auto'
        alt="Detailed city skyline"
        loading="lazy"
      />
    </div>
  );
};

export default Background;