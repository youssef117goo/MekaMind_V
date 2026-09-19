import React, { useState } from 'react';
import { useSyncExternalStore } from 'react';
import { appStore } from '../store/appStore';
import { Board, PinMapping } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard: React.FC = () => {
  const boards = useSyncExternalStore(
    (cb) => appStore.subscribe(cb),
    () => appStore.getBoards(),
    () => appStore.getBoards()
  );
  const currentUser = useSyncExternalStore(
    (cb) => appStore.subscribe(cb),
    () => appStore.getCurrentUser(),
    () => null
  );

  const [activeTab, setActiveTab] = useState<'boards' | 'add-board' | 'stats'>('boards');
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Add Board Form State
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardDesc, setNewBoardDesc] = useState('');
  const [newBoardChip, setNewBoardChip] = useState('ESP32-WROOM-32');
  const [newPins, setNewPins] = useState<PinMapping[]>([]);

  const addPinToNewBoard = () => {
    setNewPins(prev => [...prev, {
      id: `pin-${Date.now()}`,
      componentLabel: '',
      gpioPin: 0,
      type: 'input',
    }]);
  };

  const updateNewPin = (index: number, field: string, value: string | number) => {
    setNewPins(prev => prev.map((p, i) => i === index ? { ...p, [field]: value } : p));
  };

  const removeNewPin = (index: number) => {
    setNewPins(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddBoard = () => {
    if (!newBoardName || newPins.length === 0) return;
    appStore.addBoard({
      name: newBoardName,
      description: newBoardDesc,
      chipType: newBoardChip,
      pins: newPins,
    });
    setNewBoardName('');
    setNewBoardDesc('');
    setNewBoardChip('ESP32-WROOM-32');
    setNewPins([]);
    setActiveTab('boards');
  };

  const handleDeleteBoard = (id: string) => {
    appStore.deleteBoard(id);
    setShowDeleteConfirm(null);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Admin Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center">
                <i className="fas fa-shield-alt mr-3 text-red-400"></i>
                Admin Dashboard
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Welcome, {currentUser?.name} • Managing boards and configurations
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-xs bg-red-500/10 text-red-300 px-3 py-1 rounded-full border border-red-500/20">
                <i className="fas fa-lock mr-1"></i> Admin Only
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Boards', value: boards.length, icon: 'fa-microchip', color: 'cyan' },
            { label: 'Total Pins', value: boards.reduce((acc, b) => acc + b.pins.length, 0), icon: 'fa-plug', color: 'blue' },
            { label: 'Input Pins', value: boards.reduce((acc, b) => acc + b.pins.filter(p => p.type === 'input').length, 0), icon: 'fa-sign-in-alt', color: 'green' },
            { label: 'Output Pins', value: boards.reduce((acc, b) => acc + b.pins.filter(p => p.type === 'output').length, 0), icon: 'fa-sign-out-alt', color: 'red' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 bg-${stat.color}-500/10 rounded-lg flex items-center justify-center`}>
                  <i className={`fas ${stat.icon} text-${stat.color}-400`}></i>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center space-x-1 bg-gray-900 rounded-xl p-1 mb-8 border border-gray-800">
          {[
            { id: 'boards' as const, label: 'Manage Boards', icon: 'fa-list' },
            { id: 'add-board' as const, label: 'Add New Board', icon: 'fa-plus-circle' },
            { id: 'stats' as const, label: 'System Info', icon: 'fa-chart-bar' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <i className={`fas ${tab.icon} mr-2`}></i>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Boards Tab */}
        {activeTab === 'boards' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {boards.map((board) => (
              <div key={board.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center border border-cyan-500/20">
                      <i className="fas fa-microchip text-cyan-400 text-lg"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{board.name}</h3>
                      <p className="text-gray-500 text-sm">{board.chipType} • {board.pins.length} pins</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingBoard(editingBoard?.id === board.id ? null : board)}
                      className="px-3 py-1.5 text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg text-sm transition-colors"
                    >
                      <i className="fas fa-edit mr-1"></i> Edit
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(board.id)}
                      className="px-3 py-1.5 text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/50 rounded-lg text-sm transition-colors"
                    >
                      <i className="fas fa-trash mr-1"></i> Delete
                    </button>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-4">{board.description}</p>

                {/* Pin Mapping Table */}
                <div className="bg-gray-800/50 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left px-4 py-2 text-gray-400 font-medium">Label</th>
                        <th className="text-left px-4 py-2 text-gray-400 font-medium">GPIO</th>
                        <th className="text-left px-4 py-2 text-gray-400 font-medium">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {board.pins.map((pin) => (
                        <tr key={pin.id} className="border-b border-gray-700/50">
                          <td className="px-4 py-2 text-white font-mono">{pin.componentLabel}</td>
                          <td className="px-4 py-2 text-gray-300 font-mono">{pin.gpioPin}</td>
                          <td className="px-4 py-2">
                            <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded capitalize">{pin.type}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Edit Mode */}
                <AnimatePresence>
                  {editingBoard?.id === board.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 overflow-hidden"
                    >
                      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                        <h4 className="text-white font-medium mb-3">Edit Board Configuration</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-gray-400 text-xs mb-1 block">Board Name</label>
                            <input
                              type="text"
                              defaultValue={board.name}
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-gray-400 text-xs mb-1 block">Chip Type</label>
                            <input
                              type="text"
                              defaultValue={board.chipType}
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-gray-400 text-xs mb-1 block">Description</label>
                            <textarea
                              defaultValue={board.description}
                              rows={2}
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none resize-none"
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 mt-4">
                          <button
                            onClick={() => {
                              appStore.updateBoard(board.id, { name: board.name });
                              setEditingBoard(null);
                            }}
                            className="px-4 py-2 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg text-sm hover:bg-cyan-500/30 transition-colors"
                          >
                            <i className="fas fa-save mr-1"></i> Save Changes
                          </button>
                          <button
                            onClick={() => setEditingBoard(null)}
                            className="px-4 py-2 text-gray-400 hover:text-white text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Delete Confirmation */}
                <AnimatePresence>
                  {showDeleteConfirm === board.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 overflow-hidden"
                    >
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center justify-between">
                        <p className="text-red-300 text-sm">
                          <i className="fas fa-exclamation-triangle mr-2"></i>
                          Are you sure? This will permanently delete "{board.name}" and all its pin mappings.
                        </p>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleDeleteBoard(board.id)}
                            className="px-4 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-400 transition-colors"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="px-4 py-1.5 text-gray-400 hover:text-white text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        )}

        {/* Add Board Tab */}
        {activeTab === 'add-board' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <i className="fas fa-plus-circle mr-3 text-cyan-400"></i>
                Add New Board
              </h3>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-gray-400 text-sm mb-1.5 block">Board Name *</label>
                  <input
                    type="text"
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    placeholder="e.g., MekaMind ESP32 Custom"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1.5 block">Chip Type</label>
                  <select
                    value={newBoardChip}
                    onChange={(e) => setNewBoardChip(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="ESP32-WROOM-32">ESP32-WROOM-32</option>
                    <option value="ESP32-WROVER">ESP32-WROVER</option>
                    <option value="ESP32-S3">ESP32-S3</option>
                    <option value="ESP32-C3">ESP32-C3</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-gray-400 text-sm mb-1.5 block">Description</label>
                  <textarea
                    value={newBoardDesc}
                    onChange={(e) => setNewBoardDesc(e.target.value)}
                    placeholder="Describe the board features and capabilities..."
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Pin Configuration */}
              <div className="border-t border-gray-800 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-bold flex items-center">
                    <i className="fas fa-plug mr-2 text-blue-400"></i> Pin Configuration
                  </h4>
                  <button
                    onClick={addPinToNewBoard}
                    className="px-4 py-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg text-sm hover:bg-blue-500/30 transition-colors"
                  >
                    <i className="fas fa-plus mr-1"></i> Add Pin
                  </button>
                </div>

                <div className="space-y-3">
                  {newPins.map((pin, index) => (
                    <div key={pin.id} className="flex items-center gap-3 bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                      <span className="text-gray-500 text-sm w-6">#{index + 1}</span>
                      <input
                        type="text"
                        value={pin.componentLabel}
                        onChange={(e) => updateNewPin(index, 'componentLabel', e.target.value)}
                        placeholder="Label (e.g., IN1)"
                        className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm font-mono focus:border-cyan-500 focus:outline-none"
                      />
                      <input
                        type="number"
                        value={pin.gpioPin || ''}
                        onChange={(e) => updateNewPin(index, 'gpioPin', parseInt(e.target.value) || 0)}
                        placeholder="GPIO"
                        className="w-24 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm font-mono focus:border-cyan-500 focus:outline-none"
                      />
                      <select
                        value={pin.type}
                        onChange={(e) => updateNewPin(index, 'type', e.target.value)}
                        className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none"
                      >
                        <option value="input">Input</option>
                        <option value="output">Output</option>
                        <option value="i2c">I2C</option>
                        <option value="spi">SPI</option>
                        <option value="uart">UART</option>
                        <option value="adc">ADC</option>
                      </select>
                      <button
                        onClick={() => removeNewPin(index)}
                        className="text-red-400 hover:text-red-300 p-2"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                  {newPins.length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-4">No pins configured yet. Click "Add Pin" to start.</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4 mt-8 pt-6 border-t border-gray-800">
                <button
                  onClick={handleAddBoard}
                  disabled={!newBoardName || newPins.length === 0}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-save mr-2"></i> Create Board
                </button>
                <button
                  onClick={() => setActiveTab('boards')}
                  className="px-6 py-3 text-gray-400 hover:text-white border border-gray-700 rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* System Info Tab */}
        {activeTab === 'stats' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <i className="fas fa-server mr-3 text-green-400"></i>
                System Information
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Database Status</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Boards Table', status: 'Active', records: boards.length },
                      { label: 'Pin Mappings', status: 'Active', records: boards.reduce((a, b) => a + b.pins.length, 0) },
                      { label: 'Users Table', status: 'Active', records: 2 },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-gray-300 text-sm">{item.label}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-gray-500 text-xs">{item.records} records</span>
                          <span className="text-green-400 text-xs">{item.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Security</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Authentication', value: 'JWT + RBAC', icon: 'fa-shield-alt' },
                      { label: 'Route Guards', value: 'Active', icon: 'fa-route' },
                      { label: 'Session Encryption', value: 'AES-256', icon: 'fa-lock' },
                      { label: 'Admin Isolation', value: 'Enforced', icon: 'fa-user-shield' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <i className={`fas ${item.icon} text-cyan-400 text-sm`}></i>
                          <span className="text-gray-300 text-sm">{item.label}</span>
                        </div>
                        <span className="text-cyan-300 text-xs font-mono">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-800">
                <h4 className="text-white font-medium mb-4">Architecture Overview</h4>
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                  <div className="grid md:grid-cols-3 gap-4 text-center">
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <i className="fas fa-globe text-cyan-400 text-2xl mb-2"></i>
                      <p className="text-white text-sm font-medium">User Platform</p>
                      <p className="text-gray-500 text-xs">app.mekamind.com</p>
                      <p className="text-gray-400 text-xs mt-1">Read-Only Access</p>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <i className="fas fa-database text-blue-400 text-2xl mb-2"></i>
                      <p className="text-white text-sm font-medium">Shared Database</p>
                      <p className="text-gray-500 text-xs">Centralized Storage</p>
                      <p className="text-gray-400 text-xs mt-1">Boards + Pin Mappings</p>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-4 border border-red-500/30">
                      <i className="fas fa-shield-alt text-red-400 text-2xl mb-2"></i>
                      <p className="text-white text-sm font-medium">Admin Panel</p>
                      <p className="text-gray-500 text-xs">admin.mekamind.com</p>
                      <p className="text-gray-400 text-xs mt-1">Full CRUD Access</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
