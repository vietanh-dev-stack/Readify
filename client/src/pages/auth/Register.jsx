import { Box, Button, TextField, Typography, Container, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 6, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
          Create Account
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Start your reading adventure today!
        </Typography>

        <Box component="form" sx={{ width: '100%' }}>
          <TextField 
            fullWidth 
            label="Full Name" 
            margin="normal" 
            variant="outlined" 
            placeholder="e.g. John Doe"
          />
          <TextField 
            fullWidth 
            label="Email Address" 
            margin="normal" 
            variant="outlined" 
            autoComplete="email"
          />
          <TextField 
            fullWidth 
            label="Password" 
            type="password" 
            margin="normal" 
            variant="outlined" 
          />
          <TextField 
            fullWidth 
            label="Confirm Password" 
            type="password" 
            margin="normal" 
            variant="outlined" 
          />
          
          <Button 
            fullWidth 
            variant="contained" 
            size="large" 
            sx={{ mt: 3, mb: 2, borderRadius: 2, fontWeight: 'bold' }}
          >
            Sign Up
          </Button>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#2e7d32', fontWeight: 'bold', textDecoration: 'none' }}>
                Login here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;