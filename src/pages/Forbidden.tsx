import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Forbidden: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-red-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative text-center"
      >
        <div className="w-24 h-24 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-500/20">
          <i className="fas fa-ban text-red-400 text-4xl"></i>
        </div>
        <h1 className="text-6xl font-bold text-white mb-4">403</h1>
        <h2 className="text-2xl font-bold text-gray-300 mb-4">Access Denied</h2>
        <p className="text-gray-400 max-w-md mx-auto mb-8">
          You don't have permission to access this resource. This area is restricted to authorized administrators only.
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Link
            to="/"
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all"
          >
            <i className="fas fa-home mr-2"></i> Go Home
          </Link>
          <Link
            to="/admin/login"
            className="px-6 py-3 text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-xl transition-colors"
          >
            <i className="fas fa-sign-in-alt mr-2"></i> Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Forbidden;
