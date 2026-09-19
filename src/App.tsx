import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import BoardsPage from './pages/BoardsPage';
import Workspace from './pages/Workspace';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Forbidden from './pages/Forbidden';
import GettingStarted from './pages/GettingStarted';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminLogin = location.pathname === '/admin/login';

  return (
    <div className="min-h-screen bg-gray-950">
      {!isAdminLogin && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/boards" element={<BoardsPage />} />
        <Route path="/workspace" element={<Workspace />} />
        <Route path="/getting-started" element={<GettingStarted />} />

        {/* Admin Routes - Protected */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Error Routes */}
        <Route path="/403" element={<Forbidden />} />
        <Route path="*" element={<Forbidden />} />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
