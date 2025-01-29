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
import api from '../api';
import { UserProfile } from '../types';
import { useTranslation } from 'react-i18next';  // <-- import useTranslation

const Profile: React.FC = () => {
  const { t } = useTranslation(); // <-- korzystamy z hooka
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
          err.response?.data?.detail ||
            t('profileErrorFetching') // np. "Wystąpił błąd podczas pobierania profilu użytkownika."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [t]); 
  // Dodaj [t] w zależnościach, gdy używasz t() w fetchUserProfile (rzadko konieczne, ale dobra praktyka)

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
        <Typography>{t('profileNoData')}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        {t('profileTitle')} {/* np. "Profil Użytkownika" */}
      </Typography>
      <Paper elevation={3} sx={{ padding: '20px', marginTop: '20px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">{t('profileUserName')}</Typography>
            <Typography>{user.userName}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">{t('profileEmail')}</Typography>
            <Typography>{user.email}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">{t('profileEmailConfirmed')}</Typography>
            <Typography>{user.emailConfirmed ? t('yes') : t('no')}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">{t('profilePhoneNumber')}</Typography>
            <Typography>{user.phoneNumber || t('profileNone')}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">{t('profilePhoneNumberConfirmed')}</Typography>
            <Typography>{user.phoneNumberConfirmed ? t('yes') : t('no')}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">{t('profileTwoFactorEnabled')}</Typography>
            <Typography>{user.twoFactorEnabled ? t('enabled') : t('disabled')}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">{t('profileLockoutEnabled')}</Typography>
            <Typography>{user.lockoutEnabled ? t('yes') : t('no')}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">{t('profileLockoutEnd')}</Typography>
            <Typography>
              {user.lockoutEnd
                ? new Date(user.lockoutEnd).toLocaleString()
                : t('no')}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">{t('profileAccessFailedCount')}</Typography>
            <Typography>{user.accessFailedCount}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Profile;
