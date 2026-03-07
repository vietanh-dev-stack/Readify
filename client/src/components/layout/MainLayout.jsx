import React from 'react';
import { Box, Container } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      <Container component="main" maxWidth="xl" sx={{ flexGrow: 1, py: { xs: 3, md: 5 } }}>
        <Outlet />
      </Container>
      <Footer />
    </Box>
  );
};

export default MainLayout;