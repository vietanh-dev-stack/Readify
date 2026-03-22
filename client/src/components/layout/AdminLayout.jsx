import React, { useState } from 'react';
import { Box, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, Menu, MenuItem, Tooltip, CssBaseline } from '@mui/material';
import { Menu as MenuIcon, Dashboard as DashboardIcon, People as PeopleIcon, MenuBook as BookIcon, Category as CategoryIcon, Person as AuthorIcon, Business as PublisherIcon, AutoStories as SeriesIcon, Logout as LogoutIcon, Home as HomeIcon } from '@mui/icons-material';
import { useNavigate, useLocation, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const drawerWidth = 260;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { text: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
    { text: 'Books', icon: <BookIcon />, path: '/admin/books' },
    { text: 'Categories', icon: <CategoryIcon />, path: '/admin/categories' },
    { text: 'Authors', icon: <AuthorIcon />, path: '/admin/authors' },
    { text: 'Publishers', icon: <PublisherIcon />, path: '/admin/publishers' },
    { text: 'Series', icon: <SeriesIcon />, path: '/admin/series' },
  ];

  const drawer = (
    <Box>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: 1 }}>
          READIFY <Box component="span" sx={{ color: 'text.primary', fontSize: '0.8rem', fontWeight: 600 }}>ADMIN</Box>
        </Typography>
      </Toolbar>
      <Divider sx={{ mb: 2 }} />
      <List sx={{ px: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              selected={location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path))}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                  '& .MuiListItemIcon-root': { color: 'white' }
                },
                '&:hover': {
                  bgcolor: 'primary.light',
                  color: 'primary.main',
                  '& .MuiListItemIcon-root': { color: 'primary.main' }
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: location.pathname === item.path ? 'white' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ mt: 'auto', mb: 2 }} />
      <List sx={{ px: 2 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/')} sx={{ borderRadius: 2 }}>
            <ListItemIcon sx={{ minWidth: 40 }}><HomeIcon /></ListItemIcon>
            <ListItemText primary="Back to User Site" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%', bgcolor: '#f8fafc' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 }}>
            {menuItems.find(item => location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path)))?.text || 'Admin Panel'}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title="Account settings">
              <IconButton onClick={handleMenuOpen} size="small">
                <Avatar sx={{ width: 35, height: 35, bgcolor: 'primary.main', fontWeight: 600 }}>
                  {user?.fullName?.charAt(0) || 'A'}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              onClick={handleMenuClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                  mt: 1.5,
                  '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1 },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={() => navigate('/profile')}>
                <Avatar /> Profile
              </MenuItem>
              <Divider />
              <MenuItem onClick={logout}>
                <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid', borderColor: 'divider' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flex: 1,
          p: { xs: 2, md: 3 },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          mt: '64px',
          overflowX: 'hidden'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
