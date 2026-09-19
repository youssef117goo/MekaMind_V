import React from 'react';
import { useSyncExternalStore } from 'react';
import { appStore } from '../store/appStore';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const BoardsPage: React.FC = () => {
  const boards = useSyncExternalStore(
    (cb) => appStore.subscribe(cb),
    () => appStore.getBoards(),
    () => appStore.getBoards()
  );

  const getPinTypeColor = (type: string) => {
    switch (type) {
      case 'input': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'output': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'i2c': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'uart': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'adc': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Available Boards</h1>
          <p className="text-gray-400 text-lg">
            Select a board to start building your IoT project. Each board has pre-configured pin mappings.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-1 gap-8">
          {boards.map((board, index) => (
            <motion.div
              key={board.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-cyan-500/30 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-8">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center border border-cyan-500/20">
                      <i className="fas fa-microchip text-cyan-400 text-xl"></i>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{board.name}</h2>
                      <p className="text-gray-500 text-sm">{board.chipType}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6">{board.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="text-xs bg-cyan-500/10 text-cyan-300 px-3 py-1 rounded-full border border-cyan-500/20">
                      {board.pins.filter(p => p.type === 'input').length} Inputs
                    </span>
                    <span className="text-xs bg-red-500/10 text-red-300 px-3 py-1 rounded-full border border-red-500/20">
                      {board.pins.filter(p => p.type === 'output').length} Outputs
                    </span>
                    <span className="text-xs bg-purple-500/10 text-purple-300 px-3 py-1 rounded-full border border-purple-500/20">
                      {board.pins.filter(p => p.type === 'i2c').length} I2C
                    </span>
                    <span className="text-xs bg-gray-500/10 text-gray-300 px-3 py-1 rounded-full border border-gray-500/20">
                      {board.pins.length} Total Pins
                    </span>
                  </div>
                  <Link
                    to={`/workspace?board=${board.id}`}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20"
                  >
                    <i className="fas fa-code mr-2"></i> Use This Board
                  </Link>
                </div>

                {/* Pin Map */}
                <div className="lg:w-96">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Pin Mapping</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {board.pins.map((pin) => (
                      <div
                        key={pin.id}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg border ${getPinTypeColor(pin.type)}`}
                      >
                        <span className="font-mono text-xs font-bold">{pin.componentLabel}</span>
                        <span className="font-mono text-xs opacity-75">GPIO{pin.gpioPin}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BoardsPage;
