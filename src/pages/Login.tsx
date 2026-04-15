import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../utils/auth';

export default function Login() {
  const [userName, setUserName] = useState('');
  const [Password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://unmixed-taco-setup.ngrok-free.dev/api/auth/login', {
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName, Password }),
      });

      if (!response.ok) {
        throw new Error('Login failed. Please check your credentials.');
      }

      const data = await response.json();
      const token = typeof data === 'string' ? data : data.token || data.access_token;

      if (token) {
        setToken(token);
        navigate('/');
      } else {
        throw new Error('No token found in response.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, bgcolor: 'background.default' }}>
      <Paper className="glass" sx={{ p: 6, width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 3, position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'primary.main', fontFamily: '"Playfair Display", serif' }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to Smart Timetable Generator
          </Typography>
        </Box>

        {error && (
          <Box sx={{ p: 2, bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 1, fontSize: '0.875rem' }}>
            {error}
          </Box>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            required
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(139, 148, 158, 0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(139, 148, 158, 0.6)' },
              }
            }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            required
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(139, 148, 158, 0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(139, 148, 158, 0.6)' },
              }
            }}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 1, py: 1.5, fontWeight: 700, fontSize: '1rem', boxShadow: '0 4px 14px rgba(56,189,248,0.4)' }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
          </Button>
        </form>
      </Paper>

      <Box sx={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 0, opacity: 0.4, pointerEvents: 'none'
      }} className="bg-grid" />
    </Box>
  );
}
