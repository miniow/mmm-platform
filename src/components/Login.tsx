// src/components/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../api';
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook

interface LoginProps {
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose }) => {
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
      const data = await loginApi(email, password);
      const { accessToken, refreshToken } = data;
      // Wywołaj metodę login z AuthContext, aby zapisać tokeny w stanie i localStorage
      login(accessToken, refreshToken);
      onClose();
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError(t('loginError'));
      }
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2 className="auth-header">{t('loginTitle')}</h2>
      <p className="footer-info">
        {t('PBSystemInfo')}
      </p>
      {error && <div className="auth-error">{error}</div>}
      <div className="form-group">
        <label htmlFor="email" className="form-label">
          {t('loginEmailLabel')}
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
          {t('loginPasswordLabel')}
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
        {t('loginButton')}
      </button>
    </form>
  );
};

export default Login;
