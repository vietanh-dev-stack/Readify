import React from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Link as MuiLink,
  IconButton
} from '@mui/material';

import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        pt: 6,
        pb: 4,
        mt: 'auto',
        backgroundColor: '#111827',
        color: '#F9FAFB'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>

          {/* Column 1 */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 2, color: '#fcd34d' }}>
              Readify
            </Typography>

            <Typography variant="body2" sx={{ color: '#9CA3AF', mb: 3, lineHeight: 1.8 }}>
              Hệ thống nhà sách trực tuyến hàng đầu, mang đến cho bạn hàng ngàn tựa sách chất lượng với dịch vụ vượt trội.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography variant="body2" sx={{ color: '#9CA3AF' }}>📍 123 Phố Sách, Quận 1, Xa Song Ma, TP Son La</Typography>
              <Typography variant="body2" sx={{ color: '#9CA3AF' }}>📞 Hotline: 1900 1234</Typography>
              <Typography variant="body2" sx={{ color: '#9CA3AF' }}>✉️ Email: support@readify.vn</Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
              <IconButton sx={{ color: '#9CA3AF', '&:hover': { color: '#3b82f6', bgcolor: 'rgba(59, 130, 246, 0.1)' } }}>
                <FacebookIcon />
              </IconButton>
              <IconButton sx={{ color: '#9CA3AF', '&:hover': { color: '#38bdf8', bgcolor: 'rgba(56, 189, 248, 0.1)' } }}>
                <TwitterIcon />
              </IconButton>
              <IconButton sx={{ color: '#9CA3AF', '&:hover': { color: '#ec4899', bgcolor: 'rgba(236, 72, 153, 0.1)' } }}>
                <InstagramIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Column 2 */}
          <Grid item xs={6} md={3}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3, color: '#fff' }}>
              Liên kết nhanh
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <MuiLink href="/" underline="none" sx={{ color: '#9CA3AF', '&:hover': { color: '#fcd34d', transform: 'translateX(4px)' }, transition: 'all 0.2s' }}>Trang chủ</MuiLink>
              <MuiLink href="/categories" underline="none" sx={{ color: '#9CA3AF', '&:hover': { color: '#fcd34d', transform: 'translateX(4px)' }, transition: 'all 0.2s' }}>Danh mục sách</MuiLink>
              <MuiLink href="/new-arrivals" underline="none" sx={{ color: '#9CA3AF', '&:hover': { color: '#fcd34d', transform: 'translateX(4px)' }, transition: 'all 0.2s' }}>Sách mới</MuiLink>
              <MuiLink href="/blog" underline="none" sx={{ color: '#9CA3AF', '&:hover': { color: '#fcd34d', transform: 'translateX(4px)' }, transition: 'all 0.2s' }}>Blog / Tin tức</MuiLink>
            </Box>
          </Grid>

          {/* Column 3 */}
          <Grid item xs={6} md={3}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3, color: '#fff' }}>
              Chính sách
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <MuiLink href="/terms" underline="none" sx={{ color: '#9CA3AF', '&:hover': { color: '#fcd34d', transform: 'translateX(4px)' }, transition: 'all 0.2s' }}>Điều khoản sử dụng</MuiLink>
              <MuiLink href="/privacy" underline="none" sx={{ color: '#9CA3AF', '&:hover': { color: '#fcd34d', transform: 'translateX(4px)' }, transition: 'all 0.2s' }}>Chính sách bảo mật</MuiLink>
              <MuiLink href="/return" underline="none" sx={{ color: '#9CA3AF', '&:hover': { color: '#fcd34d', transform: 'translateX(4px)' }, transition: 'all 0.2s' }}>Chính sách đổi trả</MuiLink>
              <MuiLink href="/shipping" underline="none" sx={{ color: '#9CA3AF', '&:hover': { color: '#fcd34d', transform: 'translateX(4px)' }, transition: 'all 0.2s' }}>Giao hàng & Vận chuyển</MuiLink>
            </Box>
          </Grid>
          
          {/* Column 4 */}
          <Grid item xs={12} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3, color: '#fff' }}>
              Hỗ trợ
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <MuiLink href="/faq" underline="none" sx={{ color: '#9CA3AF', '&:hover': { color: '#fcd34d', transform: 'translateX(4px)' }, transition: 'all 0.2s' }}>Hỏi đáp (FAQ)</MuiLink>
              <MuiLink href="/contact" underline="none" sx={{ color: '#9CA3AF', '&:hover': { color: '#fcd34d', transform: 'translateX(4px)' }, transition: 'all 0.2s' }}>Liên hệ</MuiLink>
            </Box>
          </Grid>

        </Grid>

        {/* Bottom */}
        <Box
          sx={{
            borderTop: '1px solid #1f2937',
            mt: 6,
            pt: 4,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography variant="body2" sx={{ color: '#6B7280' }}>
            © {new Date().getFullYear()} Readify. Tất cả quyền được bảo lưu.
          </Typography>
        </Box>

      </Container>
    </Box>
  );
};

export default Footer;