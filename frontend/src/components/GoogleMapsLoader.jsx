import React from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const GoogleMapsLoader = ({ children }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY", // ✅ Replace with your key
    libraries: ["places"],
  });

  if (!isLoaded) return <p className="text-center mt-10">🗺️ Loading Google Maps...</p>;

  return <>{children}</>;
};

export default GoogleMapsLoader;
