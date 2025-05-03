import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaComment, FaShareAlt, FaPlus } from 'react-icons/fa';

const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedPosts, setLikedPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5555/users/allposts');
        setPosts(response.data.posts || response.data);
      } catch (err) {
        setError('Failed to load posts. Please try again.');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      await axios.put(`http://localhost:5555/posts/${postId}/like`);
      if (likedPosts.includes(postId)) {
        setLikedPosts(likedPosts.filter(id => id !== postId));
        setPosts(posts.map(post => 
          post._id === postId ? { ...post, likes: post.likes - 1 } : post
        ));
      } else {
        setLikedPosts([...likedPosts, postId]);
        setPosts(posts.map(post => 
          post._id === postId ? { ...post, likes: post.likes + 1 } : post
        ));
      }
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <p className="text-red-500 mb-4 text-lg">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Photo Gallery</h1>
          <Link 
            to="/createpost"
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FaPlus />
            <span>Create Post</span>
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500 text-xl mb-6">No posts yet. Be the first to share!</p>
            <Link 
              to="/createpost"
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              <FaPlus />
              <span>Create Your First Post</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <div key={post._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Post Image */}
                <div className="relative aspect-square">
                  <img 
                    src={post.picture} 
                    alt={post.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/500x500?text=Image+Not+Found';
                    }}
                  />
                </div>

                {/* Post Content */}
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2">{post.name}</h2>
                  <p className="text-gray-600 mb-4">{post.description}</p>

                  {/* Post Actions */}
                  <div className="flex justify-between items-center border-t pt-3">
                    <button 
                      onClick={() => handleLike(post._id)}
                      className="flex items-center text-gray-600 hover:text-red-500"
                    >
                      {likedPosts.includes(post._id) ? (
                        <FaHeart className="text-red-500 mr-1" />
                      ) : (
                        <FaRegHeart className="mr-1" />
                      )}
                      <span>{post.likes}</span>
                    </button>
                    
                    <button className="flex items-center text-gray-600 hover:text-blue-500">
                      <FaComment className="mr-1" />
                      <span>{post.comments.length}</span>
                    </button>
                    
                    <button className="flex items-center text-gray-600 hover:text-green-500">
                      <FaShareAlt />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostFeed;