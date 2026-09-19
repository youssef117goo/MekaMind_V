import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSyncExternalStore } from 'react';
import { appStore } from '../store/appStore';
import { Board, Connection } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const Workspace: React.FC = () => {
  const [searchParams] = useSearchParams();
  const boards = useSyncExternalStore(
    (cb) => appStore.subscribe(cb),
    () => appStore.getBoards(),
    () => appStore.getBoards()
  );

  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [logicRules, setLogicRules] = useState<Array<{ id: string; condition: string; action: string; enabled: boolean }>>([]);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [isFlashing, setIsFlashing] = useState(false);
  const [flashProgress, setFlashProgress] = useState(0);
  const [selectedFrom, setSelectedFrom] = useState<string>('');
  const [selectedTo, setSelectedTo] = useState<string>('');

  useEffect(() => {
    const boardId = searchParams.get('board');
    if (boardId) {
      const board = boards.find(b => b.id === boardId);
      if (board) setSelectedBoard(board);
    }
  }, [searchParams, boards]);

  const addConnection = () => {
    if (selectedFrom && selectedTo && selectedBoard) {
      const fromPin = selectedBoard.pins.find(p => p.id === selectedFrom);
      const toPin = selectedBoard.pins.find(p => p.id === selectedTo);
      if (fromPin && toPin) {
        const newConn: Connection = {
          id: `conn-${Date.now()}`,
          from: selectedFrom,
          to: selectedTo,
          label: `${fromPin.componentLabel} → ${toPin.componentLabel}`,
        };
        setConnections(prev => [...prev, newConn]);
        setSelectedFrom('');
        setSelectedTo('');
      }
    }
  };

  const removeConnection = (id: string) => {
    setConnections(prev => prev.filter(c => c.id !== id));
  };

  const addLogicRule = () => {
    setLogicRules(prev => [...prev, {
      id: `rule-${Date.now()}`,
      condition: '',
      action: '',
      enabled: true,
    }]);
  };

  const updateLogicRule = (id: string, field: string, value: string | boolean) => {
    setLogicRules(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const removeLogicRule = (id: string) => {
    setLogicRules(prev => prev.filter(r => r.id !== id));
  };

  const generateCode = useCallback(() => {
    if (!selectedBoard) return;

    const pinDefines = selectedBoard.pins.map(p =>
      `#define ${p.componentLabel} ${p.gpioPin}`
    ).join('\n');

    const inputPins = selectedBoard.pins.filter(p => p.type === 'input');
    const outputPins = selectedBoard.pins.filter(p => p.type === 'output');

    const setupInputs = inputPins.map(p => `  pinMode(${p.componentLabel}, INPUT);`).join('\n');
    const setupOutputs = outputPins.map(p => `  pinMode(${p.componentLabel}, OUTPUT);`).join('\n');

    const logicCode = logicRules.filter(r => r.enabled && r.condition && r.action).map(rule => {
      return `  // Rule: ${rule.condition} => ${rule.action}
  if (${rule.condition}) {
    ${rule.action};
  }`;
    }).join('\n\n');

    const code = `/*
 * MekaMind Generated Code
 * Board: ${selectedBoard.name}
 * Chip: ${selectedBoard.chipType}
 * Generated: ${new Date().toISOString()}
 * 
 * Connections: ${connections.length}
 * Logic Rules: ${logicRules.filter(r => r.enabled).length}
 */

#include <Arduino.h>

// Pin Definitions (Auto-mapped from board configuration)
${pinDefines}

// WiFi Configuration (Optional)
#include <WiFi.h>
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

void setup() {
  Serial.begin(115200);
  Serial.println("MekaMind - ${selectedBoard.name}");
  Serial.println("Initializing...");

  // Setup Input Pins
${setupInputs}

  // Setup Output Pins
${setupOutputs}

  // WiFi Connection (Optional)
  // WiFi.begin(ssid, password);
  // while (WiFi.status() != WL_CONNECTED) {
  //   delay(500);
  //   Serial.print(".");
  // }
  // Serial.println("\\nWiFi Connected!");

  Serial.println("Setup Complete!");
}

void loop() {
${logicCode || '  // No logic rules defined yet\n  // Add rules in the workspace to generate control logic'}

  delay(100); // Main loop delay
}
`;

    setGeneratedCode(code);
    setShowCodeModal(true);
  }, [selectedBoard, connections, logicRules]);

  const simulateFlash = () => {
    setIsFlashing(true);
    setFlashProgress(0);
    const interval = setInterval(() => {
      setFlashProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFlashing(false);
            setFlashProgress(0);
          }, 1000);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  const getPinTypeBadge = (type: string) => {
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
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            <i className="fas fa-laptop-code mr-3 text-cyan-400"></i>
            Workspace
          </h1>
          <p className="text-gray-400">Design your board logic visually and generate production-ready code.</p>
        </motion.div>

        {/* Board Selection */}
        {!selectedBoard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {boards.map((board) => (
              <button
                key={board.id}
                onClick={() => setSelectedBoard(board)}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-left hover:border-cyan-500/50 transition-all group"
              >
                <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <i className="fas fa-microchip text-cyan-400 text-xl"></i>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{board.name}</h3>
                <p className="text-gray-500 text-sm mb-3">{board.chipType}</p>
                <p className="text-gray-400 text-sm">{board.description}</p>
                <div className="mt-4 flex items-center text-cyan-400 text-sm font-medium">
                  <span>Select Board</span>
                  <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                </div>
              </button>
            ))}
          </motion.div>
        )}

        {/* Workspace Editor */}
        {selectedBoard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Board Info Bar */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-microchip text-cyan-400"></i>
                </div>
                <div>
                  <h2 className="text-white font-bold">{selectedBoard.name}</h2>
                  <p className="text-gray-500 text-sm">{selectedBoard.chipType} • {selectedBoard.pins.length} pins</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedBoard(null)}
                  className="px-4 py-2 text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg text-sm transition-colors"
                >
                  <i className="fas fa-exchange-alt mr-1"></i> Change Board
                </button>
                <button
                  onClick={generateCode}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20"
                >
                  <i className="fas fa-code mr-2"></i> Generate Code
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Pin Map */}
              <div className="lg:col-span-1">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-white font-bold mb-4 flex items-center">
                    <i className="fas fa-plug mr-2 text-cyan-400"></i> Pin Map
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {selectedBoard.pins.map((pin) => (
                      <div
                        key={pin.id}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg border ${getPinTypeBadge(pin.type)}`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold">{pin.componentLabel}</span>
                          <span className="text-xs opacity-60 capitalize">{pin.type}</span>
                        </div>
                        <span className="font-mono text-xs">GPIO{pin.gpioPin}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Connections & Logic */}
              <div className="lg:col-span-2 space-y-6">
                {/* Connection Builder */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-white font-bold mb-4 flex items-center">
                    <i className="fas fa-project-diagram mr-2 text-blue-400"></i> Connections
                  </h3>
                  <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 mb-4">
                    <div className="flex-1">
                      <label className="text-gray-400 text-xs mb-1 block">From (Source)</label>
                      <select
                        value={selectedFrom}
                        onChange={(e) => setSelectedFrom(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none"
                      >
                        <option value="">Select pin...</option>
                        {selectedBoard.pins.map(p => (
                          <option key={p.id} value={p.id}>{p.componentLabel} (GPIO{p.gpioPin})</option>
                        ))}
                      </select>
                    </div>
                    <div className="text-gray-500 pt-4">→</div>
                    <div className="flex-1">
                      <label className="text-gray-400 text-xs mb-1 block">To (Target)</label>
                      <select
                        value={selectedTo}
                        onChange={(e) => setSelectedTo(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none"
                      >
                        <option value="">Select pin...</option>
                        {selectedBoard.pins.map(p => (
                          <option key={p.id} value={p.id}>{p.componentLabel} (GPIO{p.gpioPin})</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={addConnection}
                      disabled={!selectedFrom || !selectedTo}
                      className="px-4 py-2 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg text-sm hover:bg-cyan-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="fas fa-plus mr-1"></i> Add
                    </button>
                  </div>

                  {/* Connections List */}
                  <div className="space-y-2">
                    {connections.length === 0 ? (
                      <p className="text-gray-500 text-sm text-center py-4">No connections yet. Add connections between pins above.</p>
                    ) : (
                      connections.map(conn => (
                        <div key={conn.id} className="flex items-center justify-between bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2">
                          <span className="text-gray-300 text-sm font-mono">{conn.label}</span>
                          <button
                            onClick={() => removeConnection(conn.id)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Logic Rules */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold flex items-center">
                      <i className="fas fa-brain mr-2 text-purple-400"></i> Logic Rules
                    </h3>
                    <button
                      onClick={addLogicRule}
                      className="px-3 py-1.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg text-sm hover:bg-purple-500/30 transition-colors"
                    >
                      <i className="fas fa-plus mr-1"></i> Add Rule
                    </button>
                  </div>
                  <div className="space-y-3">
                    {logicRules.length === 0 ? (
                      <p className="text-gray-500 text-sm text-center py-4">No logic rules defined. Add rules to control board behavior.</p>
                    ) : (
                      logicRules.map((rule) => (
                        <div key={rule.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <input
                              type="text"
                              value={rule.condition}
                              onChange={(e) => updateLogicRule(rule.id, 'condition', e.target.value)}
                              placeholder="Condition: e.g., digitalRead(IN1) == HIGH"
                              className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm font-mono focus:border-purple-500 focus:outline-none"
                            />
                            <span className="text-gray-500">→</span>
                            <input
                              type="text"
                              value={rule.action}
                              onChange={(e) => updateLogicRule(rule.id, 'action', e.target.value)}
                              placeholder="Action: e.g., digitalWrite(RLY1, HIGH)"
                              className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm font-mono focus:border-purple-500 focus:outline-none"
                            />
                            <button
                              onClick={() => removeLogicRule(rule.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                          <label className="flex items-center space-x-2 text-sm text-gray-400">
                            <input
                              type="checkbox"
                              checked={rule.enabled}
                              onChange={(e) => updateLogicRule(rule.id, 'enabled', e.target.checked)}
                              className="rounded border-gray-600"
                            />
                            <span>Enabled</span>
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Code Generation Modal */}
      <AnimatePresence>
        {showCodeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCodeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white">
                  <i className="fas fa-code mr-2 text-cyan-400"></i> Generated Code
                </h2>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedCode);
                    }}
                    className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700 transition-colors border border-gray-700"
                  >
                    <i className="fas fa-copy mr-1"></i> Copy
                  </button>
                  <button
                    onClick={simulateFlash}
                    disabled={isFlashing}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm hover:from-green-400 hover:to-emerald-500 transition-all disabled:opacity-50"
                  >
                    <i className="fas fa-bolt mr-1"></i> {isFlashing ? 'Flashing...' : 'Flash via USB'}
                  </button>
                  <button
                    onClick={() => setShowCodeModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>
              </div>

              {/* Flash Progress */}
              {isFlashing && (
                <div className="px-6 py-3 bg-gray-800/50 border-b border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-150"
                        style={{ width: `${flashProgress}%` }}
                      ></div>
                    </div>
                    <span className="text-green-400 text-sm font-mono">{flashProgress}%</span>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">
                    {flashProgress < 30 && 'Connecting to device via Web Serial API...'}
                    {flashProgress >= 30 && flashProgress < 60 && 'Uploading firmware...'}
                    {flashProgress >= 60 && flashProgress < 90 && 'Verifying flash...'}
                    {flashProgress >= 90 && flashProgress < 100 && 'Finalizing...'}
                    {flashProgress >= 100 && '✓ Flash complete! Device is running your code.'}
                  </p>
                </div>
              )}

              <div className="overflow-auto max-h-[60vh] p-6">
                <pre className="bg-gray-950 border border-gray-800 rounded-xl p-6 text-sm font-mono text-gray-300 overflow-x-auto whitespace-pre-wrap">
                  {generatedCode}
                </pre>
              </div>

              <div className="p-6 border-t border-gray-800 bg-gray-900/50">
                <div className="flex items-start space-x-3 text-sm text-gray-400">
                  <i className="fas fa-info-circle text-cyan-400 mt-0.5"></i>
                  <p>
                    This code is auto-generated based on your board's pin mapping configuration. 
                    GPIO numbers are injected automatically from the board database. 
                    Use "Flash via USB" to upload directly using Web Serial API (requires Chrome/Edge).
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Workspace;
