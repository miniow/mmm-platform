// src/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: 'https://localhost:7104', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Register
export const register = async (email: string, password: string) => {
  const response = await api.post('/register', { email, password });
  return response.data;
};

// Login
export const login = async (email: string, password: string) => {
  const response = await api.post("/login", { email, password });
  const { tokenType, accessToken, expiresIn, refreshToken } = response.data;
  setAuthToken(accessToken);
  return { tokenType, accessToken, expiresIn, refreshToken };
};

export const refreshToken = async (refreshToken: string) => {
  const response = await api.post("/refresh", { refreshToken });
  const { tokenType, accessToken, expiresIn, refreshToken: newRefreshToken } = response.data;
  setAuthToken(accessToken);
  return { tokenType, accessToken, expiresIn, refreshToken: newRefreshToken };
};
export const getUserRoles = async () => {
  const response = await api.get("/api/users/roles");
  return response.data; 
};
export default api;
