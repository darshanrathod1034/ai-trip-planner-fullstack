import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Navbar from "../components/Navbar";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Background from "../components/Background";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import animationData from "../assets/plane-loading.json"; // Make sure you have this animation file

const budgetMap = {
  'cheap': 1000,
  'moderate': 2500,
  'luxury': 4000
};

const CreateTrip = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    destination: "",
    budget: "",
    interests: [],
    startDate: null,
    endDate: null
  });
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (formData.destination.length > 2) {
        axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${formData.destination}`)
          .then((response) => setSuggestions(response.data))
          .catch((error) => {
            console.error("Error fetching location data:", error);
            setError("Failed to fetch location suggestions");
          });
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [formData.destination]);

  const handleGenerateTrip = async () => {
    if (!user?.token) {
      setError("Please log in to create a trip");
      navigate("/login");
      return;
    }
  
    if (!formData.destination || !formData.startDate || !formData.endDate || !formData.budget) {
      setError("Please fill in all required fields");
      return;
    }
  
    setIsLoading(true);
    setShowLoading(true);
    setError("");
  
    try {
      const response = await axios.post(
        "http://localhost:5555/ai/recommend",
        {
          destination: formData.destination,
          startDate: formData.startDate,
          endDate: formData.endDate,
          budget: budgetMap[formData.budget],
          preferences: formData.interests,
        },
        {
          headers: { 
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          },
        }
      );
  
      if (response.data?.success) {
        navigate("/view-trip", {
          state: {
            itinerary: response.data.recommendations,
            tripDetails: {
              ...formData,
              numericalBudget: budgetMap[formData.budget]
            }
          }
        });
      } else {
        throw new Error(response.data?.message || "Failed to create trip");
      }
    } catch (error) {
      console.error("Trip creation error:", error);
      
      if (error.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
        logout();
        navigate("/login");
      } else {
        setError(error.response?.data?.message || error.message || "An error occurred");
      }
    } finally {
      setIsLoading(false);
      setShowLoading(false);
    }
  };

  const budgetOptions = [
    { label: "💰 Cheap (~$1000)", value: "cheap" },
    { label: "⚖️ Moderate (~$2500)", value: "moderate" },
    { label: "💎 Luxury (~$4000)", value: "luxury" },
  ];

  const interestOptions = [
    { label: "🏖️ Nature", value: "nature" },
    { label: "🏯 History", value: "history" },
    { label: "🌃 Nightlife", value: "nightlife" },
    { label: "🛍️ Shopping", value: "shopping" },
    { label: "🎮 Entertainment", value: "entertainment" },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen mt-[80px] bg-gray-50 relative overflow-hidden">
      <Navbar />
      <Background />
      
      {/* Loading Overlay */}
      <AnimatePresence>
        {showLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex flex-col items-center justify-center"
          >
            <div className="w-64 h-64">
              <Lottie animationData={animationData} loop={true} />
            </div>
            <motion.p 
              className="text-white text-xl mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Crafting your perfect itinerary...
            </motion.p>
            <motion.p 
              className="text-gray-300 text-sm mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              This may take a moment
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-4xl mx-auto px-4 py-8 relative z-10"
      >
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-lg shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-6 text-white">
            <motion.h1 
              className="text-3xl font-bold mb-2"
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              Plan Your Dream Trip
            </motion.h1>
            <motion.p 
              className="text-blue-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Fill in your travel preferences and let us create a personalized itinerary
            </motion.p>
          </div>

          <div className="p-6">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Destination Input */}
            <motion.div variants={itemVariants} className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Destination *
              </label>
              <motion.div whileHover={{ scale: 1.01 }}>
                <input
                  type="text"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Where do you want to go?"
                  value={formData.destination}
                  onChange={(e) => handleChange("destination", e.target.value)}
                />
              </motion.div>
              {suggestions.length > 0 && (
                <motion.ul 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-2 border-2 border-blue-100 rounded-xl bg-white shadow-lg max-h-60 overflow-auto"
                >
                  {suggestions.map((place) => (
                    <motion.li
                      key={place.place_id}
                      className="p-3 hover:bg-blue-50 cursor-pointer border-b border-blue-50 last:border-b-0"
                      whileHover={{ x: 5 }}
                      onClick={() => {
                        handleChange("destination", place.display_name);
                        setSuggestions([]);
                      }}
                    >
                      {place.display_name}
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </motion.div>

            {/* Date Pickers */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
            >
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Start Date *
                </label>
                <motion.div whileHover={{ scale: 1.01 }}>
                  <DatePicker
                    selected={formData.startDate}
                    onChange={(date) => handleChange("startDate", date)}
                    selectsStart
                    startDate={formData.startDate}
                    endDate={formData.endDate}
                    minDate={new Date()}
                    placeholderText="Select start date"
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </motion.div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  End Date *
                </label>
                <motion.div whileHover={{ scale: 1.01 }}>
                  <DatePicker
                    selected={formData.endDate}
                    onChange={(date) => handleChange("endDate", date)}
                    selectsEnd
                    startDate={formData.startDate}
                    endDate={formData.endDate}
                    minDate={formData.startDate}
                    placeholderText="Select end date"
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Budget Selection */}
            <motion.div variants={itemVariants} className="mb-8">
              <label className="block text-gray-700 font-medium mb-2">
                Budget *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {budgetOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 border-2 rounded-xl transition-all ${
                      formData.budget === option.value
                        ? "bg-blue-50 border-blue-500 shadow-md"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                    onClick={() => handleChange("budget", option.value)}
                  >
                    <span className="block font-medium text-gray-800">{option.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Interests Selection */}
            <motion.div variants={itemVariants} className="mb-8">
              <label className="block text-gray-700 font-medium mb-2">
                Interests
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {interestOptions.map((interest) => (
                  <motion.button
                    key={interest.value}
                    type="button"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 border-2 rounded-xl transition-all ${
                      formData.interests.includes(interest.value)
                        ? "bg-blue-50 border-blue-500 shadow-md"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                    onClick={() =>
                      handleChange(
                        "interests",
                        formData.interests.includes(interest.value)
                          ? formData.interests.filter((i) => i !== interest.value)
                          : [...formData.interests, interest.value]
                      )
                    }
                  >
                    <span className="block font-medium text-gray-800">{interest.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <motion.button
                onClick={handleGenerateTrip}
                disabled={isLoading}
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg ${
                  isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                } transition-all relative overflow-hidden`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="inline-block mr-2"
                    >
                      ⏳
                    </motion.span>
                    Generating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    ✈️ Generate Trip Plan
                  </span>
                )}
                {!isLoading && (
                  <motion.span
                    className="absolute inset-0 bg-white opacity-0 hover:opacity-10"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.1 }}
                  />
                )}
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CreateTrip;