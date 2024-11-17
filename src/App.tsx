// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';
import DataPipelines from './pages/DataPipelines';
import DataFlow from './pages/DataFlow'
import Workspaces from './pages/Workspaces';
import './i18n';
const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/workspace"
            element={
              <ProtectedRoute>
                <Workspaces />
              </ProtectedRoute>
            }
          />
          <Route path="/datapipelines/:id" element={<DataFlow />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/datapipelines"
            element={
              <ProtectedRoute>
                <DataPipelines />
              </ProtectedRoute>
            }
          />
          <Route
            path="/models"
            element={
              <ProtectedRoute>
                <></>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
    
  );
};

export default App;
