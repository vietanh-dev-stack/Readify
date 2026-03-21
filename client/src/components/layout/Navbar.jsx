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
  Container,
  Link as MuiLink
} from '@mui/material';

import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import useWishlistStore from '../../store/useWishlistStore';
import useCartStore from '../../store/useCartStore';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { wishlist, fetchWishlist } = useWishlistStore();
  const { cartItems, fetchCart } = useCartStore();
  
  const wishlistCount = wishlist.length;
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
      fetchCart();
    }
  }, [isAuthenticated, fetchWishlist, fetchCart]);

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
              variant="h4"
              sx={{
                fontWeight: 900,
                letterSpacing: '-0.05rem',
                color: '#1e3a8a'
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
              mx: { xs: 0, md: 4 },
              minWidth: { xs: '100%', md: 400 },
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 50,
              overflow: 'hidden',
              order: { xs: 3, md: 2 },
              width: { xs: '100%', md: 'auto' },
              '&:focus-within': {
                borderColor: '#1e3a8a',
                boxShadow: '0 0 0 2px rgba(30,58,138,0.1)'
              }
            }}
          >
            <InputBase
              sx={{
                ml: 2,
                flex: 1,
                fontSize: '0.9rem',
                py: 0.5
              }}
              placeholder="Tìm kiếm tên sách, tác giả..."
            />

            <Button
              variant="contained"
              disableElevation
              sx={{
                bgcolor: '#1e3a8a',
                color: 'white',
                borderRadius: 0,
                px: 3,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: '#172554'
                }
              }}
            >
              Tìm kiếm
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
              label="Yêu thích" 
              badgeContent={wishlistCount}
            />

            <ActionButton
              component={Link}
              to="/cart"
              icon={<ShoppingCartOutlinedIcon />}
              label="Giỏ hàng" 
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
                  {user?.name ? user.name.split(' ')[0] : 'Tài khoản'}
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
                    Hồ sơ
                  </MenuItem>

                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 1 }} color="error" />
                    <Typography color="error">Đăng xuất</Typography>
                  </MenuItem>
                </Menu>
              )}
            </Box>

          </Box>

        </Toolbar>
        
        {/* Navigation Categories Toolbar */}
        <Box sx={{ borderTop: '1px solid', borderColor: 'grey.200', bgcolor: '#f8fafc', mx: -3, px: 3 }}>
          <Toolbar disableGutters sx={{ minHeight: '44px !important', justifyContent: 'center', gap: { xs: 2, sm: 4, md: 6 }, display: { xs: 'none', md: 'flex' } }}>
            <MuiLink component={Link} to="/categories" underline="none" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.9rem', '&:hover': { color: '#1e3a8a' } }}>Danh mục</MuiLink>
            <MuiLink component={Link} to="/new-arrivals" underline="none" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.9rem', '&:hover': { color: '#1e3a8a' } }}>Sách mới</MuiLink>
            <MuiLink component={Link} to="/best-sellers" underline="none" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.9rem', '&:hover': { color: '#1e3a8a' } }}>Bán chạy</MuiLink>
            <MuiLink component={Link} to="/blog" underline="none" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.9rem', '&:hover': { color: '#1e3a8a' } }}>Blog</MuiLink>
            <MuiLink component={Link} to="/contact" underline="none" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.9rem', '&:hover': { color: '#1e3a8a' } }}>Liên hệ</MuiLink>
          </Toolbar>
        </Box>
      </Container>
    </AppBar>
  );
};

export default Navbar;