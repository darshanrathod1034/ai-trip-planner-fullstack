import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const CreatePost = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Only JPEG, JPG, or PNG images are allowed');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB');
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !description.trim()) {
      setError('Name and description are required');
      return;
    }

    if (!image) {
      setError('Please select an image');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('image', image);

      console.log('Form data entries:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value instanceof File ? `${value.name} (${value.size} bytes)` : value);
      }

      const response = await axios.post(
        'http://localhost:5555/posts/create',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${user.token}`
          }
        }
      );

      if (response.status === 201) {
        navigate('/posts', { 
          state: { success: 'Post created successfully!' } 
        });
      }
    } catch (err) {
      console.error('Post creation error:', err);
      
      let errorMessage = 'Failed to create post';
      
      if (err.response) {
        if (err.response.status === 400 && err.response.data.errors) {
          errorMessage = Object.values(err.response.data.errors)
                            .map(err => err.message || err)
                            .join(', ');
        } else {
          errorMessage = err.response.data?.message || 
                       `Server error (${err.response.status})`;
        }
      } else if (err.request) {
        errorMessage = 'No response from server. Check your connection.';
      } else {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Create New Post</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Name <span className='text-red-500'><sup>*</sup></span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Post name"
            maxLength={100}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Description <span className='text-red-500'><sup>*</sup></span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="Write your post description here..."
            maxLength={2000}
            required
          ></textarea>
        </div>

        {/* Image Upload Section */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Image<span className='text-red-500'><sup>*</sup></span> (JPEG/PNG, max 5MB)
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              {preview ? (
                <div className="relative w-full h-full">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="w-full h-full object-cover rounded-lg" 
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImage(null);
                      setPreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">JPEG or PNG (MAX. 5MB)</p>
                </div>
              )}
              <input 
                type="file" 
                className="hidden" 
                accept="image/jpeg, image/png"
                onChange={handleFileChange}
                required
              />
            </label>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/posts')}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center min-w-32"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Posting...
              </>
            ) : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;