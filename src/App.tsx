// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';
import DataPipelines from './pages/DataPipeline';
import DataFlow from './components/DataFlow';
import Workspaces from './pages/Workspaces';
import './i18n';
import { DataProvider } from './context/DataContext';
import ModelDetails from './components/ModelDetails';
import WorkspaceDetails from './components/WorkspaceDetails';
import AdminPanel from './components/admin/AdminPanel';

const App: React.FC = () => {
  return (
    <Router>
      <DataProvider>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />

            {/* Chronione trasy */}
            <Route
              path="/workspace"
              element={
                <ProtectedRoute>
                  <Workspaces />
                </ProtectedRoute>
              }
            />
           <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
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
              path="/datapipelines/:id"
              element={
                <ProtectedRoute>
                  <DataFlow />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workspace/:id"
              element={
                <ProtectedRoute>
                  <WorkspaceDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/models/:modelId"
              element={
                <ProtectedRoute>
                  <ModelDetails />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </DataProvider>
    </Router>
  );
};

export default App;
