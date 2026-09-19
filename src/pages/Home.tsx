import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-gray-950 to-blue-900/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-cyan-300 text-sm font-medium">IoT Programming Made Simple</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                MekaMind
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
              Program your ESP32 boards visually. Drag, connect, and generate production-ready code — then flash directly via USB.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/workspace"
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
              >
                <i className="fas fa-rocket mr-2"></i> Start Programming
              </Link>
              <Link
                to="/boards"
                className="px-8 py-4 bg-gray-800 text-gray-200 font-semibold rounded-xl hover:bg-gray-700 transition-all border border-gray-700"
              >
                <i className="fas fa-microchip mr-2"></i> View Boards
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Three simple steps from visual design to deployed firmware
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: 'fa-layer-group',
                title: '1. Select Your Board',
                description: 'Choose from our catalog of approved MekaMind boards. Each board comes with pre-configured pin mappings.',
                color: 'from-cyan-400 to-cyan-600',
              },
              {
                icon: 'fa-project-diagram',
                title: '2. Design Visually',
                description: 'Connect inputs to outputs using our visual editor. Define logic rules and configure behaviors without writing code.',
                color: 'from-blue-400 to-blue-600',
              },
              {
                icon: 'fa-download',
                title: '3. Generate & Flash',
                description: 'Generate optimized C++ code with correct GPIO mappings, then flash directly to your board via USB cable.',
                color: 'from-purple-400 to-purple-600',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 hover:border-cyan-500/30 transition-all group"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <i className={`fas ${feature.icon} text-white text-xl`}></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Boards Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Supported Boards</h2>
            <p className="text-gray-400 text-lg">Pre-configured and ready to use</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'ESP32 Pro', pins: 12, chip: 'ESP32-WROOM-32', badge: 'Popular' },
              { name: 'ESP32 Lite', pins: 5, chip: 'ESP32-WROOM-32', badge: 'Beginner' },
              { name: 'ESP32 Industrial', pins: 21, chip: 'ESP32-WROVER', badge: 'Advanced' },
            ].map((board, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 hover:border-cyan-500/30 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center">
                    <i className="fas fa-microchip text-cyan-400 text-xl"></i>
                  </div>
                  <span className="text-xs font-medium bg-cyan-500/10 text-cyan-300 px-3 py-1 rounded-full">
                    {board.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">MekaMind {board.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{board.chip}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span><i className="fas fa-plug mr-1"></i> {board.pins} Pins</span>
                  <span><i className="fas fa-wifi mr-1"></i> WiFi + BT</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Technical Architecture</h2>
            <p className="text-gray-400 text-lg">Decoupled services with centralized security</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-user text-green-400"></i>
                </div>
                <h3 className="text-xl font-bold text-white">User Platform</h3>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start space-x-2">
                  <i className="fas fa-check text-green-400 mt-1 text-sm"></i>
                  <span>Visual board selection & pin mapping display</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="fas fa-check text-green-400 mt-1 text-sm"></i>
                  <span>Connection designer with logic rules</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="fas fa-check text-green-400 mt-1 text-sm"></i>
                  <span>Auto-generated C++ code with GPIO injection</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="fas fa-check text-green-400 mt-1 text-sm"></i>
                  <span>Direct USB flashing via Web Serial API</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="fas fa-check text-green-400 mt-1 text-sm"></i>
                  <span>Read-only access to approved boards</span>
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 border border-red-500/20 rounded-2xl p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-shield-alt text-red-400"></i>
                </div>
                <h3 className="text-xl font-bold text-white">Admin Panel <span className="text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full ml-2">Protected</span></h3>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start space-x-2">
                  <i className="fas fa-lock text-red-400 mt-1 text-sm"></i>
                  <span>JWT Authentication + RBAC (Role-Based Access)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="fas fa-lock text-red-400 mt-1 text-sm"></i>
                  <span>Full CRUD for boards & pin mappings</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="fas fa-lock text-red-400 mt-1 text-sm"></i>
                  <span>GPIO-to-label mapping configuration</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="fas fa-lock text-red-400 mt-1 text-sm"></i>
                  <span>Completely isolated from user platform</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="fas fa-lock text-red-400 mt-1 text-sm"></i>
                  <span>Route guards prevent unauthorized access</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/20 rounded-3xl p-12 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Build?</h2>
            <p className="text-gray-300 text-lg mb-8">
              No coding experience needed. Select a board, design your logic, and deploy in minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/workspace"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25"
              >
                <i className="fas fa-arrow-right mr-2"></i> Open Workspace
              </Link>
              <Link
                to="/admin/login"
                className="inline-flex items-center px-8 py-4 text-gray-400 hover:text-white font-medium rounded-xl border border-gray-700 hover:border-gray-500 transition-all"
              >
                <i className="fas fa-shield-alt mr-2"></i> Admin Access
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-600 rounded flex items-center justify-center">
                <i className="fas fa-microchip text-white text-xs"></i>
              </div>
              <span className="text-gray-400 text-sm">© 2024 MekaMind. All rights reserved.</span>
            </div>
            <div className="flex items-center space-x-6 text-gray-500 text-sm">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Contact</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
