import { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Divider, Paper, InputAdornment, IconButton } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    // dummy login - accept any credentials
    login({ name: email.split('@')[0] || 'User', email });
    navigate('/');
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <Container component="main" maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 4, md: 6 }, 
          width: '100%',
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          borderRadius: 4,
          boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'primary.main' }}>
          <AutoStoriesIcon sx={{ fontSize: 40, mr: 1 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 900, letterSpacing: '-0.05rem' }}>
            Readify
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
          Welcome back! Please enter your details.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          {error && (
            <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 2 }}>
              <Typography variant="body2" fontWeight={600}>
                {error}
              </Typography>
            </Paper>
          )}

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
            sx={{ py: 1.5, borderRadius: 2, fontWeight: 700, mb: 3 }}
          >
            Sign in
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
      </Paper>
    </Container>
  );
};

export default Login;