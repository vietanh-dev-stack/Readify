import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Container, Chip, Stack } from '@mui/material';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import { useNavigate } from 'react-router-dom';

const TimeBlock = ({ value, label }) => (
  <Box sx={{ textAlign: 'center' }}>
    <Box
      sx={{
        minWidth: { xs: 68, md: 78 },
        px: 1.5,
        py: 1.6,
        borderRadius: 3,
        background: 'rgba(255,255,255,0.12)',
        border: '1px solid rgba(255,255,255,0.18)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 12px 28px rgba(15, 23, 42, 0.16)'
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: '1.5rem', md: '1.85rem' },
          fontWeight: 900,
          color: '#fff',
          lineHeight: 1
        }}
      >
        {String(value).padStart(2, '0')}
      </Typography>
    </Box>
    <Typography
      variant="caption"
      sx={{
        mt: 1,
        display: 'block',
        color: 'rgba(255,255,255,0.82)',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase'
      }}
    >
      {label}
    </Typography>
  </Box>
);

const PromoBanner = () => {
  const [timeLeft, setTimeLeft] = useState({ h: 23, m: 59, s: 59 });
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { h, m, s } = prev;

        if (s > 0) {
          s -= 1;
        } else {
          s = 59;
          if (m > 0) {
            m -= 1;
          } else {
            m = 59;
            if (h > 0) {
              h -= 1;
            }
          }
        }

        return { h, m, s };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: { xs: 4, md: 5 },
            p: { xs: 3, md: 5, lg: 6 },
            color: '#fff',
            background: 'linear-gradient(135deg, #172554 0%, #1e3a8a 48%, #f59e0b 140%)',
            boxShadow: '0 24px 50px rgba(30, 58, 138, 0.24)'
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '-25%',
              right: '-6%',
              width: { xs: 200, md: 300 },
              height: { xs: 200, md: 300 },
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)',
              filter: 'blur(12px)'
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: '-22%',
              left: '-8%',
              width: { xs: 220, md: 320 },
              height: { xs: 220, md: 320 },
              borderRadius: '50%',
              background: 'rgba(245, 158, 11, 0.22)',
              filter: 'blur(10px)'
            }}
          />

          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '1.2fr 0.8fr' },
              gap: { xs: 4, md: 5 },
              alignItems: 'center'
            }}
          >
            <Box>
              <Chip
                icon={<LocalOfferRoundedIcon sx={{ color: '#fbbf24 !important' }} />}
                label="Chiến dịch ưu đãi trong ngày"
                sx={{
                  mb: 2,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontWeight: 800,
                  borderRadius: 99,
                  border: '1px solid rgba(255,255,255,0.16)'
                }}
              />

              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                  mb: 2,
                  fontSize: { xs: '2rem', md: '2.75rem', lg: '3.2rem' }
                }}
              >
                Nhập mã <Box component="span" sx={{ color: '#fcd34d' }}>READIFY25</Box> để giảm thêm 25%
              </Typography>

              <Typography
                sx={{
                  maxWidth: 660,
                  color: 'rgba(226, 232, 240, 0.94)',
                  lineHeight: 1.8,
                  fontSize: { xs: '1rem', md: '1.05rem' },
                  mb: 3
                }}
              >
                Áp dụng cho hàng ngàn đầu sách được yêu thích nhất tuần này. Kết hợp cùng các ưu đãi vận
                chuyển và quà tặng thành viên để tối ưu giá trị đơn hàng.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardRoundedIcon />}
                  onClick={() => navigate('/categories')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 99,
                    textTransform: 'none',
                    fontWeight: 800,
                    bgcolor: '#fff',
                    color: '#172554',
                    '&:hover': {
                      bgcolor: '#f8fafc',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  Săn deal ngay
                </Button>

                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 1.8,
                    py: 1.1,
                    borderRadius: 99,
                    bgcolor: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)'
                  }}
                >
                  <AccessTimeRoundedIcon sx={{ fontSize: 18, color: '#fcd34d' }} />
                  <Typography sx={{ fontWeight: 700, color: '#e2e8f0' }}>
                    Hiệu lực đến hết hôm nay
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Box
              sx={{
                justifySelf: { xs: 'stretch', lg: 'end' },
                width: '100%',
                maxWidth: 390,
                p: { xs: 2.5, md: 3 },
                borderRadius: 4,
                bgcolor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.16)',
                backdropFilter: 'blur(16px)'
              }}
            >
              <Typography sx={{ fontWeight: 800, mb: 2, color: '#f8fafc' }}>
                Đồng hồ ưu đãi
              </Typography>

              <Stack direction="row" spacing={1.5} justifyContent="space-between">
                <TimeBlock value={timeLeft.h} label="Giờ" />
                <TimeBlock value={timeLeft.m} label="Phút" />
                <TimeBlock value={timeLeft.s} label="Giây" />
              </Stack>

              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  borderRadius: 3,
                  bgcolor: 'rgba(15, 23, 42, 0.18)',
                  border: '1px dashed rgba(255,255,255,0.2)'
                }}
              >
                <Typography sx={{ fontSize: '0.85rem', color: '#cbd5e1', mb: 0.8 }}>
                  Mã ưu đãi độc quyền
                </Typography>
                <Typography sx={{ fontSize: '1.35rem', fontWeight: 900, letterSpacing: '0.08em' }}>
                  READIFY25
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default PromoBanner;