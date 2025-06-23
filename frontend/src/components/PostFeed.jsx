import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaComment, FaRegComment, FaBookmark, FaRegBookmark, FaEllipsisH } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import { motion } from 'framer-motion';

const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedPosts, setLikedPosts] = useState([]);
  const [activeComment, setActiveComment] = useState(null);
  const [commentText, setCommentText] = useState('');
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
      await axios.put(`http://localhost:5555/users/likepost/${postId}`);
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

  const handleCommentSubmit = async (postId) => {
    if (!commentText.trim()) return;
    
    try {
      const newComment = {
        userid: 'currentUserId', // Replace with actual user ID
        comment: commentText,
        createdAt: new Date()
      };

      const updatedPosts = posts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      });
      
      setPosts(updatedPosts);
      setCommentText('');
      setActiveComment(null);
      
      // In real app, make API call to save comment
      // await axios.post(`/api/posts/${postId}/comments`, { text: commentText });
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <p className="text-red-500 mb-4 text-lg">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Social Feed
          </h1>
          <Link 
            to="/createpost"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <span className="font-medium">Create</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {posts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-white rounded-xl shadow-sm"
          >
            <p className="text-gray-500 text-xl mb-6">No posts yet. Be the first to share!</p>
            <Link 
              to="/createpost"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg"
            >
              <span>Create Your First Post</span>
            </Link>
          </motion.div>
        ) : (
          posts.map(post => (
            <motion.div 
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Post Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                    <img 
                      src={post.userid?.picture || 'https://via.placeholder.com/150'} 
                      alt={post.userid?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{post.userid?.name || 'User'}</h3>
                    <p className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button className="text-gray-500 hover:text-gray-700">
                  <FaEllipsisH />
                </button>
              </div>

              {/* Post Image */}
              <div className="relative">
                <img 
                  src={post.picture} 
                  alt={post.name}
                  className="w-full h-auto max-h-[600px] object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/500x500?text=Image+Not+Found';
                  }}
                />
              </div>

              {/* Post Actions */}
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex space-x-4">
                    <button 
                      onClick={() => handleLike(post._id)}
                      className="flex items-center space-x-1"
                    >
                      {likedPosts.includes(post._id) ? (
                        <FaHeart className="text-red-500 text-xl" />
                      ) : (
                        <FaRegHeart className="text-xl hover:text-red-500" />
                      )}
                    </button>
                    <button 
                      onClick={() => setActiveComment(activeComment === post._id ? null : post._id)}
                      className="flex items-center space-x-1"
                    >
                      {activeComment === post._id ? (
                        <FaComment className="text-blue-500 text-xl" />
                      ) : (
                        <FaRegComment className="text-xl hover:text-blue-500" />
                      )}
                    </button>
                  </div>
                  <button className="text-gray-500 hover:text-gray-700">
                    <FiSend className="text-xl" />
                  </button>
                </div>

                {/* Likes count */}
                {post.likes > 0 && (
                  <p className="font-semibold text-sm mb-2">
                    {post.likes} {post.likes === 1 ? 'like' : 'likes'}
                  </p>
                )}

                {/* Post Caption */}
                <div className="mb-2">
                  <p className="text-sm">
                    <span className="font-semibold mr-2">{post.userid?.name || 'User'}</span>
                    {post.description}
                  </p>
                </div>

                {/* Comments section */}
                {post.comments.length > 0 && (
                  <div className="mb-2">
                    {post.comments.slice(0, 2).map((comment, index) => (
                      <div key={index} className="flex items-start mb-1">
                        <p className="text-sm">
                          <span className="font-semibold mr-2">{comment.userid?.name || 'User'}</span>
                          {comment.comment}
                        </p>
                      </div>
                    ))}
                    {post.comments.length > 2 && (
                      <button 
                        onClick={() => setActiveComment(activeComment === post._id ? null : post._id)}
                        className="text-gray-500 text-sm"
                      >
                        View all {post.comments.length} comments
                      </button>
                    )}
                  </div>
                )}

                {/* Comment input (shown when active) */}
                {activeComment === post._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3"
                  >
                    <div className="flex items-center border-t border-gray-100 pt-3">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 border-none text-sm focus:ring-0"
                        onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit(post._id)}
                      />
                      <button 
                        onClick={() => handleCommentSubmit(post._id)}
                        disabled={!commentText.trim()}
                        className={`ml-2 font-semibold text-sm ${commentText.trim() ? 'text-blue-500' : 'text-blue-300'}`}
                      >
                        Post
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </main>
    </div>
  );
};

export default PostFeed;