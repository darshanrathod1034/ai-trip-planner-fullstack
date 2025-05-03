import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const AccountPage = () => {
  const { user, logout } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
  });
  const [posts, setPosts] = useState([]);
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/users/${user._id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        
        const userData = response.data;
        setFormData({
          fullname: userData.fullname || '',
          email: userData.email || '',
          phone: userData.phone || '',
        });
        
        setPosts(userData.posts || []);
        setSavedPlaces(userData.saved_places || []);
        setTrips(userData.trips || []);
      } catch (error) {
        toast.error('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchUserData();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5555/users/${user._id}`, formData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      toast.success('Profile updated successfully');
      setEditMode(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) return <div className="flex justify-center py-20">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Section */}
        <div className="md:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 rounded-full bg-gray-200 mb-4 overflow-hidden">
                {user.picture ? (
                  <img src={user.picture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-gray-500">
                    {user.fullname?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              
              {editMode ? (
                <form onSubmit={handleSubmit} className="w-full">
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="px-4 py-2 border rounded hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-center">{user.fullname}</h2>
                  <p className="text-gray-600 text-center mb-4">{user.email}</p>
                  
                  <div className="w-full space-y-3">
                    <div>
                      <span className="font-medium">Phone:</span> {formData.phone || 'Not provided'}
                    </div>
                    
                    <div className="pt-4">
                      <button
                        onClick={() => setEditMode(true)}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="md:w-2/3 space-y-6">
          {/* My Posts Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">My Posts ({posts.length})</h3>
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {posts.map(post => (
                  <div key={post._id} className="border rounded-lg overflow-hidden">
                    {post.picture && (
                      <img 
                        src={post.picture} 
                        alt={post.name} 
                        className="w-full h-40 object-cover"
                      />
                    )}
                    <div className="p-3">
                      <h4 className="font-medium">{post.name}</h4>
                      <p className="text-sm text-gray-600 truncate">{post.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">You haven't created any posts yet.</p>
            )}
          </div>

          {/* Saved Places Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">Saved Places ({savedPlaces.length})</h3>
            {savedPlaces.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedPlaces.map(place => (
                  <div key={place._id} className="border rounded-lg overflow-hidden">
                    {place.image && (
                      <img 
                        src={place.image} 
                        alt={place.name} 
                        className="w-full h-40 object-cover"
                      />
                    )}
                    <div className="p-3">
                      <h4 className="font-medium">{place.name}</h4>
                      <p className="text-sm text-gray-600">{place.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">You haven't saved any places yet.</p>
            )}
          </div>

          {/* My Trips Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">My Trips ({trips.length})</h3>
            {trips.length > 0 ? (
              <div className="space-y-4">
                {trips.map(trip => (
                  <div key={trip._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{trip.destination}</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded ${
                        trip.status === 'planned' ? 'bg-yellow-100 text-yellow-800' :
                        trip.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {trip.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">You don't have any trips planned yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;