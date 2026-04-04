import React, { useState, useEffect } from 'react';
import { 
  Typography, Box, Paper, Avatar, Button, Grid, Tab, Tabs, Divider, List, 
  ListItem, ListItemText, ListItemAvatar, Dialog, DialogTitle, DialogContent, 
  DialogActions, Stepper, Step, StepLabel, CircularProgress, TextField, 
  IconButton, Stack 
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { getOrders } from '../../services/order.service';
import { getShipmentByOrderId } from '../../services/shipment.service';
import AddressManager from '../../components/profile/AddressManager';
import { updateProfile } from '../../services/user.service';
import useAuthStore from '../../store/useAuthStore';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, logout } = useAuth();
  const updateUser = useAuthStore(state => state.updateUser);
  const [tabValue, setTabValue] = useState(0);
  const [orders, setOrders] = useState([]);

  // Edit profile state
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user?.username || user?.name || '',
    phone: user?.phone || '',
    avatar: user?.avatar || ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const [trackingOpen, setTrackingOpen] = useState(false);
  const [shipmentInfo, setShipmentInfo] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  const handleOpenTracking = async (orderId) => {
    setTrackingOpen(true);
    setTrackingLoading(true);
    setShipmentInfo(null);
    try {
      const res = await getShipmentByOrderId(orderId);
      setShipmentInfo(res.data.data);
    } catch (error) {
      console.log('No shipment information found', error);
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleCloseTracking = () => {
    setTrackingOpen(false);
    setShipmentInfo(null);
  };

  const handleOpenEditProfile = () => {
    setProfileData({
      username: user?.username || user?.name || '',
      phone: user?.phone || '',
      avatar: user?.avatar || ''
    });
    setAvatarPreview(user?.avatar || '');
    setAvatarFile(null);
    setEditProfileOpen(true);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      const formData = new FormData();
      formData.append('username', profileData.username);
      formData.append('phone', profileData.phone);
      if (avatarFile) {
        formData.append('image', avatarFile);
      }

      const res = await updateProfile(formData);
      const updatedUser = res.data;
      updateUser(updatedUser);
      toast.success('Cập nhật thông tin thành công!');
      setEditProfileOpen(false);
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || 'Cập nhật thông tin thất bại!';
      toast.error(message);
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orderResponse = await getOrders()
        setOrders(orderResponse?.data?.data || [])
      } catch (error) {
        console.log(error);
      }
    }
    fetchData()
  }, [])


  if (!user) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant="h5" color="text.secondary">Vui lòng đăng nhập để xem thông tin cá nhân.</Typography>
      </Box>
    );
  }


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
                {!user?.avatar && (user?.username?.[0] || user?.name?.[0] || 'U').toUpperCase()}
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
              <Tab icon={<LocationOnIcon sx={{ mr: 2 }} />} iconPosition="start" label="Địa chỉ" />
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
                    <Button size="small" sx={{ mt: 2, textTransform: 'none' }} onClick={handleOpenEditProfile}>Chỉnh sửa</Button>
                  </Box>
                  <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>Địa chỉ giao hàng</Typography>
                    <Typography variant="body1">Quản lý các địa chỉ nhận hàng của bạn</Typography>
                    <Button size="small" sx={{ mt: 2, textTransform: 'none' }} onClick={() => setTabValue(2)}>Quản lý địa chỉ</Button>
                  </Box>
                </Box>
              </Box>
            )}

            {/* Tab 1: Order History */}
            {tabValue === 1 && (
              <Box>
                <Typography variant="h5" fontWeight={700} gutterBottom mb={3}>Lịch sử đơn hàng</Typography>
                <List sx={{ width: '100%' }}>
                  {orders && orders.length > 0 ? (
                    orders.map((order, index) => (
                      <React.Fragment key={order?._id || index}>
                        <ListItem alignItems="flex-start" sx={{ px: 0, py: 2 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'grey.100', color: 'primary.main' }}>
                              <StorefrontIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="subtitle1" fontWeight={700}>{order?._id}</Typography>
                                <Typography variant="subtitle1" fontWeight={700}>{(order?.finalPrice || 0).toLocaleString('vi-VN') + ' đ'}</Typography>
                              </Box>
                            }
                            secondary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                  Đặt ngày {order?.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                  <Typography variant="body2" color="success.main" fontWeight={600}>{order?.status}</Typography>
                                  <Button size="small" variant="outlined" startIcon={<LocalShippingIcon />} onClick={() => handleOpenTracking(order._id)}>
                                    Theo dõi
                                  </Button>
                                </Box>
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < orders.length - 1 && <Divider component="li" />}
                      </React.Fragment>
                    ))
                  ) : (
                    <Typography color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>Chưa có đơn hàng nào.</Typography>
                  )}
                </List>
              </Box>
            )}

            {/* Tab 2: Address Management */}
            {tabValue === 2 && (
              <AddressManager />
            )}

            {/* Tab 3: Settings */}
            {tabValue === 3 && (
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

      {/* Tracking Dialog */}
      <Dialog open={trackingOpen} onClose={handleCloseTracking} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>Thông tin vận chuyển</DialogTitle>
        <DialogContent dividers>
          {trackingLoading ? (
            <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>
          ) : shipmentInfo ? (
            <Box>
              <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Mã vận đơn (Tracking No):</Typography>
                <Typography variant="body1" fontWeight={700} gutterBottom>{shipmentInfo.trackingNumber}</Typography>
                
                <Typography variant="subtitle2" color="text.secondary" mt={1}>Đơn vị vận chuyển:</Typography>
                <Typography variant="body1" fontWeight={700} sx={{ textTransform: 'uppercase' }}>{shipmentInfo.provider}</Typography>
              </Box>
              
              <Typography variant="h6" fontWeight={700} mb={2}>Tiến trình giao hàng</Typography>
              <Stepper activeStep={shipmentInfo.events.length} orientation="vertical">
                {shipmentInfo.events.map((event, index) => (
                  <Step key={index} active={true} completed={true}>
                    <StepLabel
                      optional={
                        <Box>
                          <Typography variant="caption" color="text.secondary">{new Date(event.timestamp).toLocaleString('vi-VN')}</Typography>
                          {event.location && <Typography variant="caption" display="block" color="text.secondary">Vị trí: {event.location}</Typography>}
                        </Box>
                      }
                    >
                      <Typography fontWeight={600} mb={0.5} sx={{ textTransform: 'capitalize' }}>{event.status.replace(/_/g, ' ')}</Typography>
                      <Typography variant="body2">{event.message}</Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          ) : (
            <Box sx={{ p: 2, textAlign: 'center' }}>
               <Typography color="text.secondary">Đơn hàng này chưa được đóng gói hoặc chưa có thông tin vận chuyển.</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTracking}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={editProfileOpen} onClose={() => setEditProfileOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 700 }}>Chỉnh sửa thông tin cá nhân</DialogTitle>
        <form onSubmit={handleProfileSubmit}>
          <DialogContent dividers>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar 
                  src={avatarPreview} 
                  sx={{ width: 100, height: 100, border: '4px solid white', boxShadow: 1 }}
                />
                <IconButton 
                  component="label" 
                  sx={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    right: 0, 
                    bgcolor: 'primary.main', 
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' }
                  }}
                  size="small"
                >
                  <PhotoCameraIcon fontSize="small" />
                  <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
                </IconButton>
              </Box>
              <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary' }}>
                Dung lượng tối đa 1MB, định dạng: .JPG, .PNG
              </Typography>
            </Box>

            <Stack spacing={3}>
              <TextField 
                label="Tên đăng nhập" 
                fullWidth 
                required 
                value={profileData.username}
                onChange={(e) => setProfileData(p => ({ ...p, username: e.target.value }))}
              />
              <TextField 
                label="Số điện thoại" 
                fullWidth 
                value={profileData.phone}
                onChange={(e) => setProfileData(p => ({ ...p, phone: e.target.value }))}
              />
              <TextField 
                label="Email" 
                fullWidth 
                disabled 
                value={user?.email}
                helperText="Không thể thay đổi địa chỉ email."
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2, px: 3 }}>
            <Button onClick={() => setEditProfileOpen(false)} color="inherit">Hủy</Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={updatingProfile}
              sx={{ px: 4 }}
            >
              {updatingProfile ? <CircularProgress size={24} color="inherit" /> : 'Lưu thay đổi'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Profile;