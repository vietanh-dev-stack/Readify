import { Box, Button, TextField, Typography, Container, Divider, Paper } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 3 }}>
        {/* Logo hoặc Tên Shop */}
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
          Readify
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Chào mừng bạn quay trở lại thế giới sách!
        </Typography>

        <Box component="form" sx={{ width: '100%' }}>
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Mật khẩu"
            type="password"
            margin="normal"
            variant="outlined"
          />
          
          <Button fullWidth variant="contained" size="large" sx={{ mt: 3, mb: 2, borderRadius: 2 }}>
            Đăng Nhập
          </Button>

          <Divider sx={{ my: 2 }}>hoặc</Divider>

          <Button 
            fullWidth 
            variant="outlined" 
            startIcon={<GoogleIcon />} 
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Đăng nhập với Google
          </Button>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2">
              Bạn chưa có tài khoản?{' '}
              <Link to="/register" style={{ color: '#2e7d32', fontWeight: 'bold', textDecoration: 'none' }}>
                Đăng ký ngay
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;