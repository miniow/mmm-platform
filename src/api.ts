// src/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: 'https://localhost:7104', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to set the Authorization token for authenticated requests
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// API functions

// Register
export const register = async (email: string, password: string) => {
  const response = await api.post('/register', { email, password });
  return response.data;
};

// Login
export const login = async (
  email: string,
  password: string,
  twoFactorCode?: string,
  twoFactorRecoveryCode?: string
) => {
  const response = await api.post('/login', {
    email,
    password,
    twoFactorCode,
    twoFactorRecoveryCode,
  });
  return response.data;
};

// Refresh Token
export const refreshToken = async (refreshToken: string) => {
  const response = await api.post('/refresh', { refreshToken });
  return response.data;
};

export default api;
