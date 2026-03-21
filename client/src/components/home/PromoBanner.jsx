import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

const TimeBlock = ({ value, label }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Box sx={{ 
      bgcolor: 'rgba(255,255,255,0.2)', 
      backdropFilter: 'blur(10px)',
      borderRadius: 1.5, 
      width: { xs: 50, md: 60 }, 
      height: { xs: 50, md: 60 }, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      border: '1px solid rgba(255,255,255,0.3)',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
    }}>
      <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff' }}>
        {String(value).padStart(2, '0')}
      </Typography>
    </Box>
    <Typography variant="caption" sx={{ mt: 0.5, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
      {label}
    </Typography>
  </Box>
);

const PromoBanner = () => {
  const [timeLeft, setTimeLeft] = useState({ h: 23, m: 59, s: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        if (s > 0) s--;
        else {
          s = 59;
          if (m > 0) m--;
          else {
            m = 59;
            if (h > 0) h--;
          }
        }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="xl">
        <Box 
          sx={{
            background: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)',
            borderRadius: 4,
            overflow: 'hidden',
            position: 'relative',
            p: { xs: 4, md: 6 },
            color: '#fff',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 20px 40px -10px rgba(225, 29, 72, 0.4)'
          }}
        >
          {/* Accent Graphic */}
          <Box sx={{
            position: 'absolute', left: '-5%', top: '-50%', width: '300px', height: '300px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)', 
            borderRadius: '50%', pointerEvents: 'none'
          }} />
          <Box sx={{
            position: 'absolute', right: '10%', bottom: '-20%', width: '250px', height: '250px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)', 
            borderRadius: '50%', pointerEvents: 'none'
          }} />

          {/* Text Content */}
          <Box sx={{ position: 'relative', zIndex: 1, textAlign: { xs: 'center', md: 'left' }, mb: { xs: 4, md: 0 } }}>
            <Typography variant="overline" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'center', md: 'flex-start' }, mb: 1, color: '#fde047', letterSpacing: 2 }}>
              <LocalFireDepartmentIcon /> FLASH SALE CUỐI TUẦN
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
              Giảm giá đến 50%
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: '500px', color: 'rgba(255,255,255,0.9)', mb: 3 }}>
              Hàng ngàn tựa sách bán chạy đang được giảm giá cực sốc. Nhanh tay săn deal trước khi thời gian kết thúc!
            </Typography>
            
            {/* Countdown Timer */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <TimeBlock value={timeLeft.h} label="Giờ" />
              <Typography variant="h4" sx={{ fontWeight: 800, pt: 1, color: 'rgba(255,255,255,0.5)' }}>:</Typography>
              <TimeBlock value={timeLeft.m} label="Phút" />
              <Typography variant="h4" sx={{ fontWeight: 800, pt: 1, color: 'rgba(255,255,255,0.5)' }}>:</Typography>
              <TimeBlock value={timeLeft.s} label="Giây" />
            </Box>
          </Box>

          {/* CTA Button */}
          <Box sx={{ position: 'relative', zIndex: 1, mt: { xs: 2, md: 0 } }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: '#fff',
                color: '#e11d48',
                fontWeight: 800,
                px: 5,
                py: 2.5,
                borderRadius: '50px',
                fontSize: '1.15rem',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                '&:hover': {
                  bgcolor: '#f8fafc',
                  transform: 'translateY(-5px) scale(1.05)',
                  boxShadow: '0 20px 30px rgba(0,0,0,0.3)'
                },
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              Săn Deal Ngay
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default PromoBanner;
