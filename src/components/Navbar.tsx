import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { appStore } from '../store/appStore';
import { useSyncExternalStore } from 'react';

const Navbar: React.FC = () => {
  const location = useLocation();
  const currentUser = useSyncExternalStore(
    (cb) => appStore.subscribe(cb),
    () => appStore.getCurrentUser(),
    () => null
  );

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-microchip text-white text-sm"></i>
              </div>
              <span className="text-white font-bold text-xl">MekaMind</span>
            </Link>
            {!isAdminRoute && (
              <div className="hidden md:flex space-x-4">
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/boards"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Boards
                </Link>
                <Link
                  to="/workspace"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Workspace
                </Link>
                <Link
                  to="/getting-started"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <i className="fas fa-download mr-1"></i> Download
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <span className="text-gray-300 text-sm">
                  <i className="fas fa-user-circle mr-1"></i>
                  {currentUser.name} ({currentUser.role})
                </span>
                <button
                  onClick={() => {
                    appStore.logout();
                    window.location.href = '/';
                  }}
                  className="text-gray-400 hover:text-white text-sm px-3 py-1.5 rounded border border-gray-700 hover:border-gray-500 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="text-gray-400 hover:text-white text-sm px-3 py-1.5 rounded border border-gray-700 hover:border-gray-500 transition-colors"
              >
                <i className="fas fa-sign-in-alt mr-1"></i> Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
