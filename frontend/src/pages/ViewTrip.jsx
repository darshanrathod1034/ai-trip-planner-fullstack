import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import axios from "axios";

// Create a new file in src/hooks/useLoadGoogleMaps.js
const useLoadGoogleMaps = (apiKey) => {
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

const dayColors = [
  "#FF5252", // Red
  "#4285F4", // Google Blue
  "#0F9D58", // Google Green
  "#FF9800", // Orange
  "#9C27B0", // Purple
  "#00BCD4", // Teal
];

const ViewTrip = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [recommendations, setRecommendations] = useState(null);
  const [tripDetails, setTripDetails] = useState(null);
  const [error, setError] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const [map, setMap] = useState(null);
  const [destinationImage, setDestinationImage] = useState("");
  const [placeImages, setPlaceImages] = useState({});
  const [loading, setLoading] = useState({
    destinationImage: true,
    placeImages: true,
  });

  // Get API keys from environment variables
  const unsplashAccessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const isGoogleMapsLoaded = useLoadGoogleMaps(googleMapsApiKey);

  // Fetch destination image from Unsplash
  const fetchDestinationImage = async (destination) => {
    try {
      setLoading(prev => ({ ...prev, destinationImage: true }));
      const response = await axios.get(
        `https://api.unsplash.com/photos/random`,
        {
          params: {
            query: `${destination} city`,
            orientation: 'landscape',
            client_id: unsplashAccessKey,
          }
        }
      );
      setDestinationImage(response.data.urls.regular);
    } catch (error) {
      console.error("Unsplash error:", error);
      setDestinationImage(`https://source.unsplash.com/1600x900/?travel,${destination}`);
    } finally {
      setLoading(prev => ({ ...prev, destinationImage: false }));
    }
  };

  // Fetch images for each place
  const fetchPlaceImages = async () => {
    const images = {};
    try {
      setLoading(prev => ({ ...prev, placeImages: true }));
      
      for (const dayPlan of recommendations) {
        for (const place of dayPlan.places) {
          try {
            const response = await axios.get(
              `https://api.unsplash.com/photos/random`,
              {
                params: {
                  query: `${place.name} ${tripDetails.destination}`,
                  client_id: unsplashAccessKey,
                }
              }
            );
            images[place.name] = response.data.urls.small;
          } catch (error) {
            console.error("Unsplash error for place:", place.name, error);
            images[place.name] = `https://source.unsplash.com/200x200/?landmark`;
          }
        }
      }
    } finally {
      setPlaceImages(images);
      setLoading(prev => ({ ...prev, placeImages: false }));
    }
  };

  useEffect(() => {
    if (location.state) {
      setRecommendations(location.state.itinerary);
      setTripDetails(location.state.tripDetails);
      fetchDestinationImage(location.state.tripDetails.destination);
    } else {
      setError("No trip data found. Please generate a new trip.");
    }
  }, [location.state]);

  useEffect(() => {
    if (recommendations && tripDetails) {
      fetchPlaceImages();
    }
  }, [recommendations, tripDetails]);

  const handleMarkerClick = (marker) => {
    setActiveMarker(marker);
  };

  const handleMapLoad = (map) => {
    setMap(map);
  };

  const handleDayClick = (dayNumber) => {
    const dayPlaces = allPlaces.filter(place => place.day === dayNumber);
    if (dayPlaces.length > 0 && map) {
      const bounds = new window.google.maps.LatLngBounds();
      dayPlaces.forEach(place => {
        bounds.extend(new window.google.maps.LatLng(place.lat, place.lng));
      });
      map.fitBounds(bounds);
      if (map.getZoom() > 15) map.setZoom(15);
    }
  };

  const openGoogleMaps = (lat, lng) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  if (error) {
    return (
      <div>
        <Navbar />
        <p className="text-center mt-10 text-red-500">{error}</p>
        <button
          className="block mx-auto mt-4 bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
          onClick={() => navigate("/create-trip")}
        >
          Create New Trip
        </button>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0 || !tripDetails) {
    return (
      <div>
        <Navbar />
        <p className="text-center mt-10">Loading itinerary...</p>
      </div>
    );
  }

  const allPlaces = recommendations.flatMap((dayPlan) =>
    dayPlan.places.map((place) => ({ ...place, day: dayPlan.day }))
  );

  const mapCenter = allPlaces.length ? { lat: allPlaces[0].lat, lng: allPlaces[0].lng } : { lat: 0, lng: 0 };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Left Column - Itinerary (Scrollable) */}
        <div className="w-full lg:w-1/2 overflow-y-auto">
          {/* Destination Header with Unsplash Image */}
          <div className="relative h-64 w-full">
            {loading.destinationImage ? (
              <div className="w-full h-full bg-gray-200 animate-pulse"></div>
            ) : (
              <img
                src={destinationImage}
                alt={tripDetails.destination}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://source.unsplash.com/1600x900/?travel,${tripDetails.destination}`;
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <h1 className="text-4xl font-bold text-white">
                {tripDetails.destination}
              </h1>
            </div>
          </div>

          {/* Trip Summary */}
          <div className="p-6">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h3 className="text-2xl font-semibold mb-4 text-blue-800">Trip Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Destination</p>
                  <p className="text-lg font-medium">{tripDetails.destination}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Budget</p>
                  <p className="text-lg font-medium">{tripDetails.budget}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Interests</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {tripDetails.interests.map((interest, index) => (
                      <span 
                        key={index} 
                        className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Itinerary */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Daily Plan</h2>
            
            {recommendations.map((dayPlan, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-opacity-90 transition-colors"
                  onClick={() => handleDayClick(dayPlan.day)}
                  style={{ backgroundColor: `${dayColors[(dayPlan.day - 1) % dayColors.length]}20` }}
                >
                  <div className="flex items-center">
                    <span 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white mr-3 font-bold"
                      style={{ backgroundColor: dayColors[(dayPlan.day - 1) % dayColors.length] }}
                    >
                      {dayPlan.day}
                    </span>
                    <h3 className="text-xl font-semibold">Day {dayPlan.day}</h3>
                  </div>
                  <button className="text-sm bg-white/80 text-gray-700 px-3 py-1 rounded-lg shadow-sm hover:bg-white transition-colors">
                    View on Map
                  </button>
                </div>
                
                <div className="p-4 space-y-4">
                  {dayPlan.places.map((place, placeIndex) => (
                    <div 
                      key={placeIndex} 
                      className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                    >
                      <div className="relative w-16 h-16 flex-shrink-0">
                        {placeImages[place.name] ? (
                          <img
                            src={placeImages[place.name]}
                            alt={place.name}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = `https://source.unsplash.com/200x200/?landmark`;
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg"></div>
                        )}
                        <span 
                          className="absolute -top-2 -left-2 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: dayColors[(dayPlan.day - 1) % dayColors.length] }}
                        >
                          {dayPlan.day}
                        </span>
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-gray-800">{place.name}</h4>
                          <button 
                            onClick={() => openGoogleMaps(place.lat, place.lng)}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                          >
                            Map
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{place.address}</p>
                        {place.rating && (
                          <div className="flex items-center mt-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-sm ml-1">{place.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-medium py-3 px-4 rounded-lg shadow-md transition-colors mt-6"
              onClick={() => navigate("/")}
            >
              Back to Home
            </button>
          </div>
        </div>

        {/* Right Column - Google Map (Fixed) */}
        <div className="hidden lg:block lg:w-1/2 sticky top-0 h-screen">
          {isGoogleMapsLoaded ? (
            <GoogleMap 
              mapContainerStyle={{
                width: '100%',
                height: '100%',
                position: 'sticky',
                top: 0
              }}
              center={mapCenter}
              zoom={12}
              onLoad={handleMapLoad}
              options={{
                styles: [
                  {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }]
                  },
                  {
                    featureType: "transit",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }]
                  },
                  {
                    featureType: "road",
                    elementType: "labels",
                    stylers: [{ visibility: "on" }]
                  },
                  {
                    featureType: "landscape",
                    stylers: [{ saturation: -100 }, { lightness: 60 }]
                  },
                  {
                    featureType: "road.highway",
                    stylers: [{ saturation: -100 }, { lightness: 40 }]
                  },
                  {
                    featureType: "water",
                    stylers: [{ saturation: -40 }, { lightness: 40 }]
                  }
                ],
                zoomControl: true,
                mapTypeControl: false,
                scaleControl: true,
                streetViewControl: false,
                rotateControl: true,
                fullscreenControl: true
              }}
            >
              {allPlaces.map((place, index) => (
                <Marker
                  key={index}
                  position={{ lat: place.lat, lng: place.lng }}
                  onClick={() => handleMarkerClick(place)}
                  icon={{
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: dayColors[(place.day - 1) % dayColors.length],
                    fillOpacity: 1,
                    strokeColor: "#FFFFFF",
                    strokeWeight: 2,
                  }}
                />
              ))}

              {activeMarker && (
                <InfoWindow
                  position={{ lat: activeMarker.lat, lng: activeMarker.lng }}
                  onCloseClick={() => setActiveMarker(null)}
                >
                  <div className="p-2">
                    <h4 className="font-bold text-lg">{activeMarker.name}</h4>
                    <p className="text-sm text-gray-600">Day {activeMarker.day}</p>
                    <p className="text-sm">{activeMarker.address}</p>
                    <button 
                      onClick={() => openGoogleMaps(activeMarker.lat, activeMarker.lng)}
                      className="mt-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                    >
                      Open in Maps
                    </button>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              Loading Map...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewTrip;