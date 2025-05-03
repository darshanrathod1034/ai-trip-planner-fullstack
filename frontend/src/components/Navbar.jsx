import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate(user ? '/dashboard' : '/', { replace: true });
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white shadow-md">
      <div className="flex items-center">
        <Link to={user ? '/dashboard' : '/'} onClick={handleLogoClick}>
          <img src="/logo.png" alt="Trip Planner" className="h-10" />
        </Link>
      </div>

      <div className="flex items-center space-x-6">
        {user ? (
          <>
            <Link to="/my-trips" className="text-gray-700 hover:text-blue-600 transition-colors">
              My Trips
            </Link>
            <Link to="/explore" className="text-gray-700 hover:text-blue-600 transition-colors">
              Explore
            </Link>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-1 focus:outline-none"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-blue-600">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-medium">
                      {user.displayName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-xl py-1 z-50 border border-gray-100">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.displayName || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email || 'No email available'}
                    </p>
                  </div>
                  <Link
                    to="/account"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Account Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link
              to="/signup"
              className="text-blue-600 border border-blue-600 px-4 py-1.5 rounded-full hover:bg-blue-50 transition-colors text-sm"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="px-4 py-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-sm"
            >
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;