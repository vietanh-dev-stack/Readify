import { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Paper, InputAdornment, IconButton, Grid } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    // dummy register/login
    login({ name, email });
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
          Create an account and start your reading adventure today!
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          {error && (
            <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 2 }}>
              <Typography variant="body2" fontWeight={600}>
                {error}
              </Typography>
            </Paper>
          )}

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 1 }}>
            <Box sx={{ gridColumn: { xs: '1 / -1' } }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Full Name</Typography>
              <TextField 
                fullWidth 
                placeholder="e.g. Jane Doe"
                variant="outlined" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Box>
            <Box sx={{ gridColumn: { xs: '1 / -1' } }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Email Address</Typography>
              <TextField 
                fullWidth 
                placeholder="jane@example.com"
                variant="outlined" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Box>
            <Box>
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
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Confirm Password</Typography>
              <TextField 
                fullWidth 
                placeholder="••••••••"
                type={showPassword ? 'text' : 'password'}
                variant="outlined" 
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </Box>
          </Box>
          
          <Button 
            type="submit"
            fullWidth 
            variant="contained" 
            size="large" 
            sx={{ mt: 3, mb: 3, py: 1.5, borderRadius: 2, fontWeight: 700 }}
          >
            Create Account
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <RouterLink to="/login" style={{ color: '#4F46E5', fontWeight: 700, textDecoration: 'none' }}>
                Log in
              </RouterLink>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;