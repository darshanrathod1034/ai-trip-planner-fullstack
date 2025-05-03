import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import { FiClock, FiCalendar, FiMapPin, FiDollarSign } from "react-icons/fi";

const MyTrips = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get("http://localhost:5555/trips");
        setTrips(response.data);
      } catch (err) {
        setError("Failed to load trips. Please try again.");
        console.error("Error fetching trips:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">My Trips</h1>
          <div className="flex justify-center py-20">
            <div className="animate-pulse text-gray-500">Loading your trips...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">My Trips</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">My Trips</h1>
          <button
            onClick={() => navigate("/create-trip")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <span>+ New Trip</span>
          </button>
        </div>

        {trips.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow">
            <h2 className="text-xl font-medium text-gray-600 mb-4">No trips found</h2>
            <p className="text-gray-500 mb-6">Start by creating your first trip!</p>
            <button
              onClick={() => navigate("/create-trip")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Create Trip
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {trips.map((trip) => (
              <div 
                key={trip._id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/trips/${trip._id}`)}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">{trip.details.destination}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      trip.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : trip.status === 'upcoming' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {trip.status}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mt-4 text-gray-600">
                    <div className="flex items-center">
                      <FiCalendar className="mr-2" />
                      <span>{formatDate(trip.details.startDate)} - {formatDate(trip.details.endDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <FiDollarSign className="mr-2" />
                      <span className="capitalize">{trip.details.budget}</span>
                    </div>
                    <div className="flex items-center">
                      <FiMapPin className="mr-2" />
                      <span>{trip.itinerary.length} days</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-medium text-gray-700 mb-2">Interests:</h3>
                    <div className="flex flex-wrap gap-2">
                      {trip.details.interests.map((interest, index) => (
                        <span 
                          key={index} 
                          className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/trips/${trip._id}`);
                    }}
                    className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTrips;