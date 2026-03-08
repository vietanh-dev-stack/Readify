import { useState } from 'react';
import { Box, Button, TextField, Typography, Divider, Paper, InputAdornment, IconButton, Grid } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import authService from '../../services/auth.service';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Email and password are required');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login(email, password);
      const { userInfo, accessToken } = response.data;
      
      login(userInfo, accessToken);
      toast.success('Login successful!');
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        height: '100vh',
        width: '100vw'
      }}
    >

      {/* Left Image */}
      <Box
        sx={{
          display: { xs: 'none', md: 'block' },
          backgroundImage: 'url(/assets/login.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      {/* Right Form */}
      <Box
        component={Paper}
        elevation={0}
        square
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 4, sm: 8 }
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 420 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'primary.main' }}>
            <AutoStoriesIcon sx={{ fontSize: 40, mr: 1 }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 900, letterSpacing: '-0.05rem' }}>
              Readify
            </Typography>
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Welcome back! Please enter your details.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>

            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Email</Typography>
            <TextField
              fullWidth
              placeholder="Enter your email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Password</Typography>
            <TextField
              fullWidth
              placeholder="••••••••"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 1 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
              <RouterLink to="#" style={{ color: '#4F46E5', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>
                Forgot password?
              </RouterLink>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ py: 1.5, borderRadius: 2, fontWeight: 700, mb: 3 }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>

            <Divider sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">Or continue with</Typography>
            </Divider>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<GoogleIcon />}
              sx={{ py: 1.5, borderRadius: 2, fontWeight: 600, color: 'text.primary', borderColor: 'divider', '&:hover': { bgcolor: 'grey.50' } }}
            >
              Google
            </Button>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <RouterLink to="/register" style={{ color: '#4F46E5', fontWeight: 700, textDecoration: 'none' }}>
                  Sign up for free
                </RouterLink>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;