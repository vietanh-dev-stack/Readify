import React, { useState } from 'react';
import { Typography, Box, Paper, Avatar, Button, Grid, Tab, Tabs, Divider, List, ListItem, ListItemText, ListItemAvatar } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import StorefrontIcon from '@mui/icons-material/Storefront';

const Profile = () => {
  const { user, logout } = useAuth();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (!user) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant="h5" color="text.secondary">Vui lòng đăng nhập để xem thông tin cá nhân.</Typography>
      </Box>
    );
  }

  // Mock Orders
  const mockOrders = [
    { id: '#ORD-1029', date: '24 Tháng 10, 2026', total: '450.000 đ', status: 'Đã giao hàng' },
    { id: '#ORD-0982', date: '12 Tháng 9, 2026', total: '125.000 đ', status: 'Đã giao hàng' },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h3" component="h1" gutterBottom fontWeight={800} mb={4}>
        Tài khoản của tôi
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '3fr 9fr' }, gap: 4 }}>
        {/* Left Sidebar */}
        <Box>
          <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
            <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'grey.50' }}>
              <Avatar
                src={user?.avatar || ""}
                alt={user?.name}
                sx={{
                  width: 100,
                  height: 100,
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '2rem',
                  fontWeight: 700
                }}
              >
                {!user?.avatar && (user?.name ? user.name[0].toUpperCase() : 'U')}
              </Avatar>
              <Typography variant="h6" fontWeight={700}>{user.name}</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>{user.email}</Typography>
              <Typography variant="caption" sx={{ bgcolor: 'secondary.light', color: 'secondary.dark', px: 1.5, py: 0.5, borderRadius: 2, mt: 1, fontWeight: 700 }}>
                Thành viên Premium
              </Typography>
            </Box>

            <Divider />

            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={tabValue}
              onChange={handleTabChange}
              sx={{ borderRight: 1, borderColor: 'divider', '& .MuiTab-root': { alignItems: 'flex-start', px: 3, py: 2, textTransform: 'none', fontWeight: 600, fontSize: '0.95rem' } }}
            >
              <Tab icon={<PersonIcon sx={{ mr: 2 }} />} iconPosition="start" label="Tổng quan tài khoản" />
              <Tab icon={<ShoppingBagIcon sx={{ mr: 2 }} />} iconPosition="start" label="Lịch sử đơn hàng" />
              <Tab icon={<SettingsIcon sx={{ mr: 2 }} />} iconPosition="start" label="Cài đặt" />
            </Tabs>

            <Divider />

            <Box sx={{ p: 2 }}>
              <Button
                fullWidth
                color="error"
                startIcon={<LogoutIcon />}
                onClick={logout}
                sx={{ py: 1.5, justifyContent: 'flex-start', px: 2, fontWeight: 600 }}
              >
                Đăng xuất
              </Button>
            </Box>
          </Paper>
        </Box>

        {/* Right Content Area */}
        <Box>
          <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: { xs: 3, md: 5 }, minHeight: '500px' }}>

            {/* Tab 0: Account Overview */}
            {tabValue === 0 && (
              <Box>
                <Typography variant="h5" fontWeight={700} gutterBottom mb={3}>Tổng quan tài khoản</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mb: 4 }}>
                  <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>Thông tin cá nhân</Typography>
                    <Typography variant="body1" fontWeight={600}>{user.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                    <Button size="small" sx={{ mt: 2, textTransform: 'none' }}>Chỉnh sửa</Button>
                  </Box>
                  <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>Địa chỉ giao hàng</Typography>
                    <Typography variant="body1">123 Bookworm Lane</Typography>
                    <Typography variant="body2" color="text.secondary">Novelty City, NY 10001</Typography>
                    <Button size="small" sx={{ mt: 2, textTransform: 'none' }}>Quản lý địa chỉ</Button>
                  </Box>
                </Box>
              </Box>
            )}

            {/* Tab 1: Order History */}
            {tabValue === 1 && (
              <Box>
                <Typography variant="h5" fontWeight={700} gutterBottom mb={3}>Lịch sử đơn hàng</Typography>
                <List sx={{ width: '100%' }}>
                  {mockOrders.map((order, index) => (
                    <React.Fragment key={order.id}>
                      <ListItem alignItems="flex-start" sx={{ px: 0, py: 2 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'grey.100', color: 'primary.main' }}>
                            <StorefrontIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="subtitle1" fontWeight={700}>{order.id}</Typography>
                              <Typography variant="subtitle1" fontWeight={700}>{order.total}</Typography>
                            </Box>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Đặt ngày {order.date}</Typography>
                              <Typography variant="body2" color="success.main" fontWeight={600}>{order.status}</Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < mockOrders.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            )}

            {/* Tab 2: Settings */}
            {tabValue === 2 && (
              <Box>
                <Typography variant="h5" fontWeight={700} gutterBottom mb={3}>Cài đặt tài khoản</Typography>
                <Typography variant="body1" color="text.secondary" mb={2}>
                  Quản lý email, mật khẩu và các thiết lập bảo mật tại đây.
                </Typography>
                <Button variant="outlined" sx={{ mr: 2, mb: 2 }}>Đổi mật khẩu</Button>
                <Button variant="outlined" color="error" sx={{ mb: 2 }}>Xóa tài khoản</Button>
              </Box>
            )}

          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;