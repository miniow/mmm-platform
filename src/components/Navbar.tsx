// src/components/Navbar.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal';
import Login from './Login';
import Register from './Register';
import LanguageSwitcher from './LanguageSwitcher';
import '../styles/Navbar.scss'; // Dodaj własne style dla navbar
import { FaHome, FaInfoCircle, FaThLarge, FaUser, FaDatabase, FaCubes, FaSignInAlt, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';

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
      <Link to="/" className="navbar-link">
        <FaHome className="navbar-icon" />
        Home
      </Link>
      <Link to="/about" className="navbar-link">
        <FaInfoCircle className="navbar-icon" />
        About
      </Link>
      {isAuthenticated && (
        <>
          <Link to="/workspace" className="navbar-link">
            <FaThLarge className="navbar-icon" />
            Workspaces
          </Link>
          <Link to="/profile" className="navbar-link">
            <FaUser className="navbar-icon" />
            Profile
          </Link>
          <Link to="/datapipelines" className="navbar-link">
            <FaDatabase className="navbar-icon" />
            Data
          </Link>
          <Link to="/models" className="navbar-link">
            <FaCubes className="navbar-icon" />
            Models
          </Link>
        </>
      )}
    </div>
    <div className="navbar-right">
      {isAuthenticated ? (
        <button onClick={handleLogout} className="navbar-button">
          <FaSignOutAlt className="navbar-icon" />
          Logout
        </button>
      ) : (
        <>
          <button onClick={openLogin} className="navbar-button">
            <FaSignInAlt className="navbar-icon" />
            Login
          </button>
          <button onClick={openRegister} className="navbar-button">
            <FaUserPlus className="navbar-icon" />
            Register
          </button>
        </>
      )}
    </div>

    <Modal isOpen={isLoginOpen} onClose={closeModals}>
      <Login onClose={closeModals} />
      <p>
        Don't have an account?{' '}
        <button onClick={openRegister} className="link-button">
          Register
        </button>
      </p>
    </Modal>
    <Modal isOpen={isRegisterOpen} onClose={closeModals}>
      <Register onClose={closeModals} />
      <p>
        Already have an account?{' '}
        <button onClick={openLogin} className="link-button">
          Login
        </button>
      </p>
    </Modal>
    <LanguageSwitcher />
  </nav>

  );
};

export default Navbar;
