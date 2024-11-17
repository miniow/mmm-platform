// src/context/AuthContext.tsx
import React, { createContext, useState, ReactNode, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { setAuthToken, refreshToken as refreshTokenApi } from '../api';

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'));
  const [loading, setLoading] = useState<boolean>(true);

  const login = (newAccessToken: string, newRefreshToken: string) => {
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    localStorage.setItem('accessToken', newAccessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    setAuthToken(newAccessToken); // Ustaw token w axios
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAuthToken(null); // Usuń token z axios
    navigate('/');
  };

  useEffect(() => {
    setAuthToken(accessToken); // Ustawienie tokena na początkowym ładowaniu

    const initializeAuth = async () => {
      setLoading(false); // Ponieważ nie mamy endpointu validate, od razu kończymy ładowanie
    };
    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  useEffect(() => {
    // Konfiguracja interceptorów
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const currentRefreshToken = refreshToken;
          if (currentRefreshToken) {
            try {
              const data = await refreshTokenApi(currentRefreshToken);
              const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data;
              login(newAccessToken, newRefreshToken);
              originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
              return api(originalRequest);
            } catch (refreshError) {
              console.error('Refresh token failed:', refreshError);
              logout();
              return Promise.reject(refreshError);
            }
          } else {
            logout();
          }
        }
        return Promise.reject(error);
      }
    );

    // Czyszczenie interceptorów przy odmontowaniu komponentu
    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [login, logout, refreshToken]);

  const isAuthenticated = !!accessToken;

  if (loading) {
    return <div>Loading...</div>; // Możesz zastąpić spinnerem lub innym komponentem ładowania
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, accessToken, refreshToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext, AuthProvider, useAuth };
