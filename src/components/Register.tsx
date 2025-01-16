// src/components/Register.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register as registerApi } from '../api'; // Import funkcji register z serwisu API
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook

interface RegisterProps {
  onClose: () => void;
}

const Register: React.FC<RegisterProps> = ({ onClose }) => {
  const { t } = useTranslation(); // Initialize translation
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await registerApi(email, password);
      const { accessToken, refreshToken } = data;
      login(accessToken, refreshToken); // Ustawienie tokenów w kontekście
      onClose();
      navigate('/');
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError(t('registrationError'));
      }
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2 className="auth-header">{t('registerTitle')}</h2>
      <p className="footer-info">
        {t('loginSystemInfo')}
      </p>
      {error && <div className="auth-error">{error}</div>}
      <div className="form-group">
        <label htmlFor="email" className="form-label">
          {t('registerEmailLabel')}
        </label>
        <input
          id="email"
          type="email"
          name="email"
          className="form-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password" className="form-label">
          {t('registerPasswordLabel')}
        </label>
        <input
          id="password"
          type="password"
          name="password"
          className="form-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="form-button">
        {t('registerButton')}
      </button>
    </form>
  );
};

export default Register;
