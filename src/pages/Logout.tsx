import React, { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { removeToken } from '../utils/auth';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    removeToken();
    const timer = setTimeout(() => {
      navigate('/login');
    }, 500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, bgcolor: 'background.default' }}>
      <CircularProgress />
      <Typography variant="body1" color="text.secondary">Logging out securely...</Typography>
    </Box>
  );
}
