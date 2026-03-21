import React from 'react';
import { Box, Typography, Button, Container, keyframes } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useNavigate } from 'react-router-dom';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulseGlow = keyframes`
  0% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 0.5; }
`;

const HeroSlider = () => {
  const navigate = useNavigate();

  return (
    <Box 
      sx={{ 
        background: 'linear-gradient(135deg, #020617 0%, #1e3a8a 100%)',
        color: 'primary.contrastText', 
        borderRadius: { xs: 0, md: 5 }, 
        p: { xs: 4, md: 8, lg: 10 }, 
        mb: 8,
        mt: { xs: 0, md: 4 },
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: { xs: 'center', md: 'flex-start' },
        textAlign: { xs: 'center', md: 'left' },
        boxShadow: '0 25px 50px -12px rgba(30, 58, 138, 0.5)',
        minHeight: { xs: '450px', md: '550px' },
        justifyContent: 'center'
      }}
    >
      {/* Decorative Glowing Orbs */}
      <Box sx={{ 
        position: 'absolute', right: '-10%', top: '-20%', 
        width: '600px', height: '600px', 
        background: 'radial-gradient(circle, rgba(56, 189, 248, 0.4) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(60px)',
        animation: `${pulseGlow} 6s infinite ease-in-out`,
        pointerEvents: 'none'
      }} />
      <Box sx={{ 
        position: 'absolute', left: '-10%', bottom: '-20%', 
        width: '500px', height: '500px', 
        background: 'radial-gradient(circle, rgba(252, 211, 77, 0.25) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(50px)',
        animation: `${pulseGlow} 8s infinite ease-in-out reverse`,
        pointerEvents: 'none'
      }} />
      
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, px: { xs: 0, md: 2 } }}>
        <Box sx={{ maxWidth: '700px' }}>
          
          <Typography 
            variant="overline" 
            sx={{ 
              fontWeight: 800, 
              letterSpacing: 4, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: { xs: 'center', md: 'flex-start' }, 
              gap: 1.5, 
              mb: 3, 
              color: '#fcd34d',
              animation: `${fadeInUp} 0.6s ease-out forwards` 
            }}
          >
            <AutoAwesomeIcon fontSize="small" sx={{ color: '#fde68a' }} /> 
            Tuyển tập mới nhất 2026
          </Typography>

          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              fontWeight: 900, 
              mb: 3, 
              letterSpacing: '-0.03em', 
              lineHeight: 1.15, 
              textShadow: '0 10px 30px rgba(0,0,0,0.5)',
              fontSize: { xs: '2.5rem', md: '4rem', lg: '4.5rem' },
              opacity: 0,
              animation: `${fadeInUp} 0.8s ease-out 0.2s forwards`
            }}
          >
            Mở rộng<br/>Chân trời tri thức
          </Typography>

          <Typography 
            variant="h6" 
            sx={{ 
              mb: 5, 
              color: '#cbd5e1', 
              fontWeight: 400, 
              lineHeight: 1.7,
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              maxWidth: '600px',
              opacity: 0,
              animation: `${fadeInUp} 0.8s ease-out 0.4s forwards`
            }}
          >
            Khám phá hàng ngàn tựa sách từ văn học kinh điển, kỹ năng sống đến công nghệ hiện đại. Đặt mua ngay hôm nay để nhận ưu đãi đến 30%.
          </Typography>

          <Box 
            sx={{ 
              display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' },
              opacity: 0,
              animation: `${fadeInUp} 0.8s ease-out 0.6s forwards`
            }}
          >
            <Button 
              variant="contained" 
              size="large" 
              endIcon={<ArrowForwardIcon />}
              sx={{ 
                px: 5, 
                py: 2, 
                borderRadius: '50px', 
                fontWeight: 800, 
                bgcolor: '#fcd34d', 
                color: '#0f172a', 
                fontSize: '1.1rem',
                textTransform: 'none',
                boxShadow: '0 10px 25px -5px rgba(252, 211, 77, 0.5)',
                '&:hover': { bgcolor: '#fde68a', transform: 'translateY(-3px) scale(1.02)', boxShadow: '0 20px 30px -5px rgba(252, 211, 77, 0.6)' },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onClick={() => navigate('/categories')}
            >
              Mua ngay
            </Button>
            
            <Button 
              variant="outlined" 
              size="large" 
              sx={{ 
                px: 5, 
                py: 2, 
                borderRadius: '50px', 
                fontWeight: 700, 
                borderColor: 'rgba(255,255,255,0.4)', 
                color: '#fff', 
                fontSize: '1.1rem',
                textTransform: 'none',
                backdropFilter: 'blur(10px)',
                bgcolor: 'rgba(255,255,255,0.05)',
                '&:hover': { 
                  borderColor: '#fff', 
                  bgcolor: 'rgba(255,255,255,0.15)',
                  transform: 'translateY(-3px)'
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onClick={() => window.scrollTo({ top: document.getElementById('featured-books')?.offsetTop - 100, behavior: 'smooth' })}
            >
              Khám phá sách
            </Button>
          </Box>

        </Box>
      </Container>
    </Box>
  );
};

export default HeroSlider;
