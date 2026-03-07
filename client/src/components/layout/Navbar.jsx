import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge, Box, Avatar, Menu, MenuItem, Tooltip, Container } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const cartCount = 0; // Replace with actual state later

  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    navigate('/');
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: { xs: 64, md: 80 } }}>
          {/* Logo Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'primary.main' }} component={Link} to="/">
            <MenuBookIcon sx={{ mr: 1, fontSize: 32 }} />
            <Typography
              variant="h5"
              noWrap
              sx={{
                fontWeight: 800,
                letterSpacing: '-0.05rem',
                color: 'inherit',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Readify
            </Typography>
          </Box>

          {/* Navigation & Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              component={Link} 
              to="/cart" 
              color="inherit" 
              sx={{ 
                color: 'text.primary',
                '&:hover': { backgroundColor: 'action.hover' }
              }}
            >
              <Badge badgeContent={cartCount} color="secondary">
                <ShoppingCartOutlinedIcon />
              </Badge>
            </IconButton>

            {user ? (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 1 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: 'primary.main', 
                        width: 40, height: 40,
                        fontWeight: 600
                      }}
                    >
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  PaperProps={{
                    sx: {
                      borderRadius: 2,
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                      minWidth: '200px'
                    }
                  }}
                >
                  <MenuItem component={Link} to="/profile" onClick={handleCloseUserMenu}>
                    <Typography textAlign="center" fontWeight={500}>Profile</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Typography textAlign="center" fontWeight={500} color="error.main">Logout</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  component={Link} 
                  to="/login"
                  sx={{ color: 'text.primary', display: { xs: 'none', sm: 'flex' } }}
                >
                  Log in
                </Button>
                <Button 
                  variant="contained" 
                  component={Link} 
                  to="/register"
                  disableElevation
                >
                  Sign up
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;