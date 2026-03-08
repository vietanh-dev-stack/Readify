import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import authService from '../../services/auth.service';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await authService.register(name, email, password, confirmPassword);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((s) => !s);
  const handleMouseDownPassword = (e) => e.preventDefault();

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
          backgroundImage: `
            url(/assets/login.jpg)
          `,
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
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'primary.main' }}>
            <AutoStoriesIcon sx={{ fontSize: 40, mr: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              Readify
            </Typography>
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Create an account and start your reading adventure today!
          </Typography>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit}>

            {/* Name */}
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Full Name
            </Typography>
            <TextField
              fullWidth
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
            />

            {/* Email */}
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Email
            </Typography>
            <TextField
              fullWidth
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />

            {/* Password */}
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Password
            </Typography>
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            {/* Confirm */}
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Confirm Password
            </Typography>
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, py: 1.5, borderRadius: 2, fontWeight: 700 }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <RouterLink
                  to="/login"
                  style={{
                    color: '#4F46E5',
                    fontWeight: 700,
                    textDecoration: 'none'
                  }}
                >
                  Log in
                </RouterLink>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;