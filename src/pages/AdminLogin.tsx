import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { appStore } from '../store/appStore';
import { motion } from 'framer-motion';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const success = appStore.login(email, password);
    setIsLoading(false);

    if (success) {
      const user = appStore.getCurrentUser();
      if (user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        setError('Access denied. Admin privileges required.');
        appStore.logout();
      }
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/20">
              <i className="fas fa-shield-alt text-red-400 text-2xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
            <p className="text-gray-400 text-sm">Restricted area. Authorized personnel only.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-gray-400 text-sm mb-1.5 block">Email Address</label>
              <div className="relative">
                <i className="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mekamind.com"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1.5 block">Password</label>
              <div className="relative">
                <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-all"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center space-x-2"
              >
                <i className="fas fa-exclamation-circle text-red-400"></i>
                <span className="text-red-300 text-sm">{error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white font-semibold rounded-xl hover:from-red-400 hover:to-orange-500 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? (
                <><i className="fas fa-spinner fa-spin mr-2"></i> Authenticating...</>
              ) : (
                <><i className="fas fa-sign-in-alt mr-2"></i> Sign In</>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="bg-gray-800/50 rounded-xl p-4">
              <p className="text-gray-500 text-xs mb-2">
                <i className="fas fa-info-circle mr-1"></i> Demo Credentials:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-900 rounded-lg p-2">
                  <span className="text-gray-400">Admin:</span>
                  <p className="text-gray-300 font-mono">admin@mekamind.com</p>
                  <p className="text-gray-300 font-mono">admin123</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-2">
                  <span className="text-gray-400">User:</span>
                  <p className="text-gray-300 font-mono">user@mekamind.com</p>
                  <p className="text-gray-300 font-mono">user123</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
