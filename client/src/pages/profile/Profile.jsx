import React from 'react';
import { Typography, Box, Paper, Avatar, Button } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <Typography>Please login to view your profile.</Typography>;
  }

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Box sx={{ textAlign: 'center' }}>
        <Avatar sx={{ width: 80, height: 80, mb: 2 }}>
          {user.name ? user.name[0].toUpperCase() : ''}
        </Avatar>
        <Typography variant="h5" gutterBottom>{user.name}</Typography>
        <Typography variant="body1" color="text.secondary">{user.email}</Typography>
      </Box>
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button variant="contained" color="primary" onClick={logout}>Logout</Button>
      </Box>
    </Paper>
  );
};

export default Profile;