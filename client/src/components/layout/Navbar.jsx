import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Badge,
  InputBase,
  Button,
  Menu,
  MenuItem,
  Container
} from '@mui/material';

import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import useWishlistStore from '../../store/useWishlistStore';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const cartCount = 0;
  const { wishlist, fetchWishlist } = useWishlistStore();
  const wishlistCount = wishlist.length;

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated, fetchWishlist]);

  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    if (!user) {
      navigate('/login');
    } else {
      setAnchorElUser(event.currentTarget);
    }
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    navigate('/');
  };

  // Action Button Component
  const ActionButton = ({ icon, label, onClick, component, to, badgeContent }) => (
    <Box
      onClick={onClick}
      component={component || 'div'}
      to={to}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: '#eab308',
        textDecoration: 'none',
        minWidth: 60,
        '&:hover': {
          opacity: 0.8
        }
      }}
    >
      <Badge
        badgeContent={badgeContent}
        sx={{
          '& .MuiBadge-badge': {
            backgroundColor: '#eab308',
            color: '#fff',
            fontWeight: 'bold',
            right: -3,
            top: 3
          }
        }}
      >
        {React.cloneElement(icon, { sx: { fontSize: 28 } })}
      </Badge>

      <Typography
        variant="caption"
        sx={{
          mt: 0.5,
          fontWeight: 500,
          color: 'text.primary',
          fontSize: '0.7rem'
        }}
      >
        {label}
      </Typography>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{
        backgroundColor: '#fff',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            justifyContent: 'space-between',
            gap: 3,
            height: { xs: 'auto', md: 80 },
            py: { xs: 1, md: 0 },
            flexWrap: 'wrap'
          }}
        >

          {/* Logo */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none'
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 900,
                letterSpacing: '-0.05rem',
                color: '#2563eb'
              }}
            >
              Readify
            </Typography>
          </Box>

          {/* Search */}
          <Box
            sx={{
              display: 'flex',
              flexGrow: 1,
              maxWidth: 600,
              border: '1px solid #ccc',
              borderRadius: 1,
              overflow: 'hidden',
              order: { xs: 3, md: 2 },
              width: { xs: '100%', md: 'auto' }
            }}
          >
            <InputBase
              sx={{
                ml: 2,
                flex: 1,
                fontSize: '0.9rem'
              }}
              placeholder="Search by title, author... ENTER for all results"
            />

            <Button
              variant="contained"
              disableElevation
              sx={{
                bgcolor: '#2563eb',
                color: 'white',
                borderRadius: 0,
                px: 3,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: '#1d4ed8'
                }
              }}
            >
              Search
            </Button>
          </Box>

          {/* Right Actions */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, sm: 3 },
              order: { xs: 2, md: 3 }
            }}
          >

            <ActionButton
              component={Link}
              to="/wishlist"
              icon={<FavoriteBorderOutlinedIcon />}
              label="Wish List"
              badgeContent={wishlistCount}
            />

            <ActionButton
              component={Link}
              to="/cart"
              icon={<ShoppingCartOutlinedIcon />}
              label="Cart"
              badgeContent={cartCount}
            />

            {/* User */}
            <Box>
              <Box
                onClick={handleOpenUserMenu}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  color: '#eab308',
                  minWidth: 60
                }}
              >
                <PersonOutlineOutlinedIcon sx={{ fontSize: 28 }} />
                <Typography
                  variant="caption"
                  sx={{
                    mt: 0.5,
                    fontWeight: 500,
                    color: 'text.primary',
                    fontSize: '0.7rem'
                  }}
                >
                  {user?.name ? user.name.split(' ')[0] : 'User'}
                </Typography>
              </Box>

              {user && (
                <Menu
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  PaperProps={{
                    sx: {
                      borderRadius: 2,
                      boxShadow:
                        '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                      minWidth: 200
                    }
                  }}
                >
                  <MenuItem
                    component={Link}
                    to="/profile"
                    onClick={handleCloseUserMenu}
                  >
                    <PersonIcon sx={{ mr: 1 }} />
                    Profile
                  </MenuItem>

                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 1 }} color="error" />
                    <Typography color="error">Logout</Typography>
                  </MenuItem>
                </Menu>
              )}
            </Box>

          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;