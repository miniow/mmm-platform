// src/components/Navbar.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal';
import Login from './Login';
import Register from './Register';
import LanguageSwitcher from './LanguageSwitcher';
import '../styles/Navbar.scss'; // Dodaj własne style dla navbar

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const openLogin = () => {
    setIsLoginOpen(true);
    setIsRegisterOpen(false);
  };

  const openRegister = () => {
    setIsRegisterOpen(true);
    setIsLoginOpen(false);
  };

  const closeModals = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        {isAuthenticated && (
          <>
            <Link to="/workspace">Workspaces</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/datapipelines">Data</Link>
            <Link to="/models">Models</Link>
          </>
        )}
      </div>
      <div className="navbar-right">
        {isAuthenticated ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <button onClick={openLogin}>Login</button>
            <button onClick={openRegister}>Register</button>
          </>
        )}
      </div>

      <Modal isOpen={isLoginOpen} onClose={closeModals}>
        <Login onClose={closeModals} />
        <p>
          Don't have an account?{' '}
          <button
            onClick={openRegister}
            className="link-button"
          >
            Register
          </button>
        </p>
      </Modal>
      <Modal isOpen={isRegisterOpen} onClose={closeModals}>
        <Register onClose={closeModals} />
        <p>
          Already have an account?{' '}
          <button
            onClick={openLogin}
            className="link-button"
          >
            Login
          </button>
        </p>
      </Modal>
      <LanguageSwitcher></LanguageSwitcher>
    </nav>
  );
};

export default Navbar;
