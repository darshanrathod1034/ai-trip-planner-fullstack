// hooks/useLoadGoogleMaps.js
import { useState, useEffect } from 'react';

export const useLoadGoogleMaps = (apiKey) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setLoaded(true);
      document.head.appendChild(script);
    } else {
      setLoaded(true);
    }
  }, [apiKey]);

  return loaded;
};