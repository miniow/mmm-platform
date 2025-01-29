// src/components/Navbar.tsx
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal';
import Login from './Login';
import Register from './Register';
import LanguageSwitcher from './LanguageSwitcher';
import '../styles/Navbar.scss'; // Import stylów
import {
  FaHome,
  FaInfoCircle,
  FaThLarge,
  FaUser,
  FaDatabase,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaUserShield
} from 'react-icons/fa';
import logo from '../assets/logo.svg'; // Plik logo
import { useTranslation } from 'react-i18next'; 

const Navbar: React.FC = () => {
  const { t } = useTranslation(); 
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  
  // State do chowania / pokazywania navbaru
  const [hidden, setHidden] = useState(false);
  
  // Ref do ostatniej pozycji scrolla
  const lastScrollTop = useRef(0);
  
  // Próg scrolla, po przekroczeniu którego chowamy navbar
  const scrollThreshold = 50; 

  // Handler eventu scroll
  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const delta = Math.abs(scrollTop - lastScrollTop.current);

    if (delta < scrollThreshold) {
      return; // Zbyt mały ruch scrolla, ignorujemy
    }

    if (scrollTop > lastScrollTop.current) {
      // Przewijanie w dół
      setHidden(true);
    } else {
      // Przewijanie w górę
      setHidden(false);
    }

    lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop; 
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
    <nav className={`navbar ${hidden ? 'navbar--hidden' : ''}`}>
      <div className="navbar-left">
        <NavLink to="/" className="navbar-logo">
          <img src={logo} alt="Logo" className="navbar-logo-image" />
        </NavLink>
        
        {/* HOME */}
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
        >
          <FaHome className="navbar-icon" />
          {t('navbarHome')}
        </NavLink>
        
        {/* Linki dla zalogowanych */}
        {isAuthenticated && (
          <>
            <NavLink
              to="/workspace"
              className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
            >
              <FaThLarge className="navbar-icon" />
              {t('navbarWorkspaces')}
            </NavLink>
            
            <NavLink
              to="/datapipelines"
              className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
            >
              <FaDatabase className="navbar-icon" />
              {t('navbarData')}
            </NavLink>

            <NavLink
              to="/profile"
              className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
            >
              <FaUser className="navbar-icon" />
              {t('navbarProfile')}
            </NavLink>
          </>
        )}

        {/* ABOUT */}
        <NavLink
          to="/about"
          className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
        >
          <FaInfoCircle className="navbar-icon" />
          {t('navbarAbout')}
        </NavLink>

        {/* ADMIN */}
        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) => 
              isActive ? 'navbar-link admin active' : 'navbar-link admin'
            }
          >
            <FaUserShield className="navbar-icon" />
            {t('navbarAdmin')}
          </NavLink>
        )}
      </div>

      {/* Prawa strona: przyciski Login / Register / Logout */}
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

      {/* Modale logowania i rejestracji */}
      <Modal isOpen={isLoginOpen} onClose={closeModals}>
        <Login onClose={closeModals} />
        <p>
          {t('navbarNoAccount')}{' '}
          <button onClick={openRegister} className="link-button">
            {t('navbarRegisterNow')}
          </button>
        </p>
      </Modal>

      <Modal isOpen={isRegisterOpen} onClose={closeModals}>
        <Register onClose={closeModals} />
        <p>
          {t('navbarHaveAccount')}{' '}
          <button onClick={openLogin} className="link-button">
            {t('navbarLoginNow')}
          </button>
        </p>
      </Modal>

      {/* Przełącznik języka */}
      <LanguageSwitcher />
    </nav>
  );
};

export default Navbar;
