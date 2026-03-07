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
          <Grid item xs={12} md={5}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
              Readify
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: '#9CA3AF', mb: 2 }}
            >
              Your ultimate destination for discovering, reading, and
              loving books of all genres.
            </Typography>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton sx={{ color: '#9CA3AF', '&:hover': { color: '#fff' } }}>
                <FacebookIcon />
              </IconButton>

              <IconButton sx={{ color: '#9CA3AF', '&:hover': { color: '#fff' } }}>
                <TwitterIcon />
              </IconButton>

              <IconButton sx={{ color: '#9CA3AF', '&:hover': { color: '#fff' } }}>
                <InstagramIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Column 2 */}
          <Grid item xs={6} md={3}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Quick Links
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink href="/" underline="hover" sx={{ color: '#9CA3AF', '&:hover': { color: '#fff' } }}>
                Home
              </MuiLink>

              <MuiLink href="/books" underline="hover" sx={{ color: '#9CA3AF', '&:hover': { color: '#fff' } }}>
                Books
              </MuiLink>

              <MuiLink href="/about" underline="hover" sx={{ color: '#9CA3AF', '&:hover': { color: '#fff' } }}>
                About Us
              </MuiLink>
            </Box>
          </Grid>

          {/* Column 3 */}
          <Grid item xs={6} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Help & Support
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink href="/faq" underline="hover" sx={{ color: '#9CA3AF', '&:hover': { color: '#fff' } }}>
                FAQ
              </MuiLink>

              <MuiLink href="/contact" underline="hover" sx={{ color: '#9CA3AF', '&:hover': { color: '#fff' } }}>
                Contact
              </MuiLink>

              <MuiLink href="/terms" underline="hover" sx={{ color: '#9CA3AF', '&:hover': { color: '#fff' } }}>
                Terms of Service
              </MuiLink>
            </Box>
          </Grid>

        </Grid>

        {/* Bottom */}
        <Box
          sx={{
            borderTop: '1px solid #374151',
            mt: 4,
            pt: 3,
            textAlign: 'center'
          }}
        >
          <Typography variant="body2" sx={{ color: '#6B7280' }}>
            © {new Date().getFullYear()} Readify. All rights reserved.
          </Typography>
        </Box>

      </Container>
    </Box>
  );
};

export default Footer;