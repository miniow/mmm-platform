// src/components/Navbar.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal';
import Login from './Login';
import Register from './Register';
import LanguageSwitcher from './LanguageSwitcher';
import '../styles/Navbar.scss'; // Ensure the CSS file exists
import { 
  FaHome, 
  FaInfoCircle, 
  FaThLarge, 
  FaUser, 
  FaDatabase, 
  FaCubes, 
  FaSignInAlt, 
  FaUserPlus, 
  FaSignOutAlt, 
  FaUserShield
} from 'react-icons/fa';
import logo from '../assets/logo.svg'; // Ensure the logo exists
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook

const Navbar: React.FC = () => {
  const { t } = useTranslation(); // Initialize translation
  const { isAuthenticated, isAdmin, logout } = useAuth();
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
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Logo" className="navbar-logo-image" />
        </Link>
        
        <Link to="/" className="navbar-link">
          <FaHome className="navbar-icon" />
          {t('navbarHome')}
        </Link>
        
        {isAuthenticated && (
          <>
            <Link to="/workspace" className="navbar-link">
              <FaThLarge className="navbar-icon" />
              {t('navbarWorkspaces')}
            </Link>
            
            <Link to="/datapipelines" className="navbar-link">
              <FaDatabase className="navbar-icon" />
              {t('navbarData')}
            </Link>
            <Link to="/profile" className="navbar-link">
              <FaUser className="navbar-icon" />
              {t('navbarProfile')}
            </Link>
          </>
        )}
        
        <Link to="/about" className="navbar-link">
          <FaInfoCircle className="navbar-icon" />
          {t('navbarAbout')}
        </Link>
        {isAdmin && (
          <Link to="/admin" className="navbar-link admin">
            <FaUserShield className="navbar-icon" />
            {t('navbarAdmin')}
          </Link>
        )}
      </div>
      <div className="navbar-right">
        {isAuthenticated ? (
          <button onClick={handleLogout} className="navbar-button">
            <FaSignOutAlt className="navbar-icon" />
            {t('navbarLogout')}
          </button>
        ) : (
          <>
            <button onClick={openLogin} className="navbar-button">
              <FaSignInAlt className="navbar-icon" />
              {t('navbarLogin')}
            </button>
            <button onClick={openRegister} className="navbar-button">
              <FaUserPlus className="navbar-icon" />
              {t('navbarRegister')}
            </button>
          </>
        )}
      </div>

      {/* Modals for Login and Register */}
      <Modal isOpen={isLoginOpen} onClose={closeModals}>
        <Login onClose={closeModals} />
        <p>
          {t('navbarNoAccount')} {' '}
          <button onClick={openRegister} className="link-button">
            {t('navbarRegisterNow')}
          </button>
        </p>
      </Modal>
      <Modal isOpen={isRegisterOpen} onClose={closeModals}>
        <Register onClose={closeModals} />
        <p>
          {t('navbarHaveAccount')} {' '}
          <button onClick={openLogin} className="link-button">
            {t('navbarLoginNow')}
          </button>
        </p>
      </Modal>
      <LanguageSwitcher />
    </nav>
  );
};

export default Navbar;
