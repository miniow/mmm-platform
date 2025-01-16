// src/components/Profile.tsx

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Grid,
} from '@mui/material';
import api from '../api'; // Upewnij się, że ścieżka jest poprawna
import { UserProfile } from '../types';


const Profile: React.FC = () => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchUserProfile = async () => {
        try {
          const response = await api.get<UserProfile>('/users/me');
          setUser(response.data);
        } catch (err: any) {
          console.error('Failed to fetch user profile:', err);
          setError(
            err.response?.data?.detail || 'Wystąpił błąd podczas pobierania profilu użytkownika.'
          );
        } finally {
          setLoading(false);
        }
      };
  
      fetchUserProfile();
    }, []);
  
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      );
    }
  
    if (error) {
      return (
        <Box display="flex" justifyContent="center" mt={5}>
          <Alert severity="error">{error}</Alert>
        </Box>
      );
    }
  
    if (!user) {
      return (
        <Box display="flex" justifyContent="center" mt={5}>
          <Typography>Nie udało się załadować danych użytkownika.</Typography>
        </Box>
      );
    }
  
    return (
      <Box sx={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <Typography variant="h4" gutterBottom>
          Profil Użytkownika
        </Typography>
        <Paper elevation={3} sx={{ padding: '20px', marginTop: '20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Nazwa Użytkownika:</Typography>
              <Typography>{user.userName}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Email:</Typography>
              <Typography>{user.email}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Potwierdzony Email:</Typography>
              <Typography>{user.emailConfirmed ? 'Tak' : 'Nie'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Numer Telefonu:</Typography>
              <Typography>{user.phoneNumber || 'Brak'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Potwierdzony Numer Telefonu:</Typography>
              <Typography>{user.phoneNumberConfirmed ? 'Tak' : 'Nie'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Dwuskładnikowe Uwierzytelnianie:</Typography>
              <Typography>{user.twoFactorEnabled ? 'Włączone' : 'Wyłączone'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Lockout Enabled:</Typography>
              <Typography>{user.lockoutEnabled ? 'Tak' : 'Nie'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Lockout End:</Typography>
              <Typography>
                {user.lockoutEnd ? new Date(user.lockoutEnd).toLocaleString() : 'Nie' }
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Access Failed Count:</Typography>
              <Typography>{user.accessFailedCount}</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    );
  };
  
  export default Profile;
  