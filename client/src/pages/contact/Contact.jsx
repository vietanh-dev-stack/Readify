import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  Grid,
  IconButton,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email không hợp lệ');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call - Replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        subject: '',
        message: '',
      });

      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError('Gửi tin nhắn thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const socialLinks = [
    { icon: FacebookIcon, url: '#', label: 'Facebook' },
    { icon: TwitterIcon, url: '#', label: 'Twitter' },
    { icon: InstagramIcon, url: '#', label: 'Instagram' },
    { icon: LinkedInIcon, url: '#', label: 'LinkedIn' },
  ];

  return (
    <Box sx={{ py: { xs: 6, md: 10 } }}>
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="overline"
            sx={{
              color: 'primary.main',
              fontWeight: 700,
              fontSize: '0.875rem',
              letterSpacing: 2,
              mb: 1,
              display: 'block',
            }}
          >
            LIÊN HỆ VỚI CHÚNG TÔI
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              mb: 2,
              background: 'linear-gradient(135deg, #4F46E5 0%, #10B981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Chúng tôi luôn sẵn lòng lắng nghe
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              fontWeight: 400,
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Có câu hỏi hay đề xuất? Hãy liên hệ với chúng tôi. Đội ngũ hỗ trợ của chúng tôi sẽ trả lời bạn trong vòng 24 giờ.
          </Typography>
        </Box>

        {/* GRID CONTAINER*/}
        <Grid container justifyContent="center" sx={{ mt: 4 }}>
          <Grid item xs={12} md={12}> 

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                p: { xs: 2, md: 4 },
              }}
            >
              {/* Thông báo Alert */}
              {success && (
                <Alert severity="success" icon={<CheckCircleIcon />} sx={{ borderRadius: 2 }}>
                  Cảm ơn! Chúng tôi đã nhận được tin nhắn của bạn.
                </Alert>
              )}
              {error && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <TextField
                fullWidth
                label="Họ và tên"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nhập họ và tên của bạn"
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ mr: 1 }}>
                      <Box sx={{ width: 20, height: 20, display: 'flex', alignItems: 'center' }}>👤</Box>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                type="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ mr: 1 }}>
                      <EmailIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Chủ đề"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Chủ đề của tin nhắn"
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ mr: 1 }}>
                      <Box sx={{ width: 20, height: 20, display: 'flex', alignItems: 'center' }}>📝</Box>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Tin nhắn"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Viết tin nhắn của bạn tại đây..."
                multiline
                rows={5}
                disabled={loading}
              />

              <Button
                type="submit"
                disabled={loading}
                variant="contained"
                size="large"
                endIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)',
                  py: 1.8,
                  fontWeight: 600,
                  fontSize: '1rem',
                  borderRadius: 2,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4338CA 0%, #2F27A5 100%)',
                  },
                }}
              >
                {loading ? 'Đang gửi...' : 'Gửi tin nhắn ngay'}
              </Button>
            </Box>

          </Grid>
        </Grid>
      </Container>

      {/* Map Section */}
      <Box
        sx={{
          bgcolor: '#F0F4F8',
          py: 8,
          mb: 8,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 4,
              textAlign: 'center',
            }}
          >
            Tìm chúng tôi trên bản đồ
          </Typography>
          <Box
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              height: { xs: 300, md: 400 },
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            }}
          >
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              title="Readify Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.7832221521055!2d106.6724176!3d10.7769437!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3f0f0f0f0f%3A0xf0f0f0f0f0f0f0f0!2sDistrict%201%2C%20Ho%20Chi%20Minh%20City!5e0!3m2!1sen!2svn!4v1234567890"
              style={{
                border: 'none',
              }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Box>
        </Container>
      </Box>

      {/* Social Media & Newsletter */}
      <Container maxWidth="lg">
        <Card
          sx={{
            background: 'linear-gradient(135deg, #4F46E5 0%, #10B981 100%)',
            p: { xs: 4, md: 6 },
            borderRadius: 3,
            color: 'white',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(79, 70, 229, 0.2)',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Kết nối với chúng tôi
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 4,
              maxWidth: '500px',
              mx: 'auto',
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            Theo dõi chúng tôi trên các nền tảng mạng xã hội để nhận những tin tức và ưu đãi mới nhất.
          </Typography>

          {/* Social Links */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
            {socialLinks.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <IconButton
                  key={index}
                  component="a"
                  href={link.url}
                  aria-label={link.label}
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.3)',
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <IconComponent />
                </IconButton>
              );
            })}
          </Box>

          {/* Newsletter */}
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              maxWidth: '400px',
              mx: 'auto',
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <TextField
              placeholder="Nhập email của bạn"
              variant="outlined"
              fullWidth
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 1,
                  '& fieldset': {
                    border: 'none',
                  },
                },
              }}
            />
            <Button
              variant="contained"
              sx={{
                width: '35%',
                bgcolor: 'white',
                color: 'primary.main',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                }
              }}
            >
              Đăng ký
            </Button>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default Contact;