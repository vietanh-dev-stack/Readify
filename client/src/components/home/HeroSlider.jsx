import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Button, Container, Chip, Stack, keyframes } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import { useNavigate } from 'react-router-dom';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const floatSoft = keyframes`
  0% { transform: translate3d(0, 0, 0); }
  50% { transform: translate3d(0, -10px, 0); }
  100% { transform: translate3d(0, 0, 0); }
`;

const slides = [
  {
    id: 1,
    eyebrow: 'Bộ sưu tập tuyển chọn',
    title: 'Không gian đọc sách premium cho người yêu tri thức',
    description:
      'Khám phá những đầu sách bán chạy, ấn bản đẹp và lựa chọn được biên tập kỹ lưỡng để nâng tầm trải nghiệm đọc mỗi ngày.',
    primaryCta: 'Mua ngay',
    secondaryCta: 'Xem sách nổi bật',
    stats: [
      { label: 'Tựa sách chọn lọc', value: '10.000+' },
      { label: 'Ưu đãi hôm nay', value: '30%' },
      { label: 'Khách hàng hài lòng', value: '98%' }
    ],
    image:
      'https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=1200&q=80',
    accent: 'rgba(245, 158, 11, 0.28)'
  },
  {
    id: 2,
    eyebrow: 'Ưu đãi theo mùa',
    title: 'Săn deal sách hay với giao diện mua sắm tinh gọn',
    description:
      'Từ văn học, kinh doanh đến phát triển bản thân, mọi danh mục đều được trình bày rõ ràng để bạn chọn sách nhanh hơn và chính xác hơn.',
    primaryCta: 'Khám phá danh mục',
    secondaryCta: 'Nhận ưu đãi',
    stats: [
      { label: 'Danh mục nổi bật', value: '24+' },
      { label: 'Sách mới mỗi tuần', value: '150+' },
      { label: 'Miễn phí vận chuyển', value: '2H' }
    ],
    image:
      'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80',
    accent: 'rgba(99, 102, 241, 0.28)'
  },
  {
    id: 3,
    eyebrow: 'Tối ưu trải nghiệm đọc',
    title: 'Bắt đầu hành trình đọc với những lựa chọn phù hợp nhất',
    description:
      'Theo dõi xu hướng đọc, khám phá sách mới và tìm cảm hứng từ những gợi ý dành riêng cho cộng đồng yêu sách hiện đại.',
    primaryCta: 'Bắt đầu ngay',
    secondaryCta: 'Tìm hiểu thêm',
    stats: [
      { label: 'Đánh giá tích cực', value: '4.9/5' },
      { label: 'Bộ sưu tập mới', value: 'Mỗi ngày' },
      { label: 'Ưu đãi thành viên', value: 'VIP' }
    ],
    image:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80',
    accent: 'rgba(148, 163, 184, 0.22)'
  }
];

const featurePills = [
  { icon: <MenuBookRoundedIcon fontSize="small" />, text: 'Sách chọn lọc mỗi tuần' },
  { icon: <LocalShippingOutlinedIcon fontSize="small" />, text: 'Giao nhanh toàn quốc' },
  { icon: <WorkspacePremiumRoundedIcon fontSize="small" />, text: 'Ưu đãi thành viên premium' }
];

const HeroSlider = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  const activeSlide = useMemo(() => slides[activeIndex], [activeIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const handleScrollToFeatured = () => {
    const featuredSection = document.getElementById('featured-books');

    if (featuredSection) {
      window.scrollTo({
        top: featuredSection.offsetTop - 110,
        behavior: 'smooth'
      });
      return;
    }

    window.scrollTo({
      top: window.innerHeight * 0.9,
      behavior: 'smooth'
    });
  };

  const handlePrimaryAction = () => {
    if (activeIndex === 1) {
      navigate('/categories');
      return;
    }

    handleScrollToFeatured();
  };

  return (
    <Box
      sx={{
        pt: { xs: 2, md: 3 },
        pb: { xs: 7, md: 9 }
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            minHeight: { xs: 560, md: 620, lg: 660 },
            borderRadius: { xs: 4, md: 5 },
            color: '#fff',
            background:
              'linear-gradient(135deg, #0b1120 0%, #162454 45%, #223d8f 100%)',
            boxShadow: '0 28px 60px rgba(15, 23, 42, 0.28)'
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `linear-gradient(90deg, rgba(2, 6, 23, 0.86) 0%, rgba(15, 23, 42, 0.78) 38%, rgba(15, 23, 42, 0.18) 100%), url(${activeSlide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transition: 'background-image 0.6s ease'
            }}
          />

          <Box
            sx={{
              position: 'absolute',
              top: '-10%',
              right: '-5%',
              width: { xs: 220, md: 360 },
              height: { xs: 220, md: 360 },
              borderRadius: '50%',
              background: activeSlide.accent,
              filter: 'blur(40px)',
              animation: `${floatSoft} 8s ease-in-out infinite`
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: '-14%',
              left: '-6%',
              width: { xs: 200, md: 300 },
              height: { xs: 200, md: 300 },
              borderRadius: '50%',
              background: 'rgba(251, 191, 36, 0.18)',
              filter: 'blur(44px)',
              animation: `${floatSoft} 9s ease-in-out infinite reverse`
            }}
          />

          <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, height: '100%' }}>
            <Box
              sx={{
                minHeight: { xs: 560, md: 620, lg: 660 },
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '1.2fr 0.8fr' },
                gap: { xs: 4, md: 5 },
                alignItems: 'center',
                px: { xs: 1, sm: 2, md: 4, lg: 5 },
                py: { xs: 5, md: 6 }
              }}
            >
              <Box sx={{ maxWidth: 720 }}>
                <Chip
                  icon={<AutoAwesomeIcon sx={{ color: '#fbbf24 !important' }} />}
                  label={activeSlide.eyebrow}
                  sx={{
                    mb: 2.5,
                    color: '#fff',
                    bgcolor: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.14)',
                    backdropFilter: 'blur(10px)',
                    fontWeight: 700,
                    px: 1,
                    animation: `${fadeInUp} 0.5s ease-out`
                  }}
                />

                <Typography
                  variant="h1"
                  component="h1"
                  sx={{
                    fontSize: { xs: '2.4rem', md: '4rem', lg: '4.6rem' },
                    lineHeight: 1.04,
                    letterSpacing: '-0.04em',
                    fontWeight: 900,
                    mb: 2.5,
                    maxWidth: 760,
                    animation: `${fadeInUp} 0.7s ease-out`
                  }}
                >
                  {activeSlide.title}
                </Typography>

                <Typography
                  sx={{
                    maxWidth: 620,
                    color: 'rgba(226, 232, 240, 0.92)',
                    fontSize: { xs: '1rem', md: '1.1rem', lg: '1.15rem' },
                    lineHeight: 1.8,
                    mb: 4,
                    animation: `${fadeInUp} 0.85s ease-out`
                  }}
                >
                  {activeSlide.description}
                </Typography>

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  sx={{
                    mb: 4,
                    alignItems: { xs: 'stretch', sm: 'center' },
                    animation: `${fadeInUp} 1s ease-out`
                  }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    onClick={handlePrimaryAction}
                    sx={{
                      px: 4,
                      py: 1.6,
                      borderRadius: 99,
                      textTransform: 'none',
                      fontWeight: 800,
                      fontSize: '1rem',
                      bgcolor: '#f5b942',
                      color: '#111827',
                      boxShadow: '0 14px 30px rgba(245, 185, 66, 0.34)',
                      '&:hover': {
                        bgcolor: '#f7c866',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    {activeSlide.primaryCta}
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<PlayArrowRoundedIcon />}
                    onClick={handleScrollToFeatured}
                    sx={{
                      px: 4,
                      py: 1.6,
                      borderRadius: 99,
                      textTransform: 'none',
                      fontWeight: 700,
                      color: '#fff',
                      borderColor: 'rgba(255,255,255,0.28)',
                      bgcolor: 'rgba(255,255,255,0.04)',
                      '&:hover': {
                        borderColor: 'rgba(255,255,255,0.5)',
                        bgcolor: 'rgba(255,255,255,0.08)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    {activeSlide.secondaryCta}
                  </Button>
                </Stack>

                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={1.5}
                  useFlexGap
                  flexWrap="wrap"
                  sx={{ mb: { xs: 4, lg: 0 } }}
                >
                  {featurePills.map((item) => (
                    <Box
                      key={item.text}
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 1,
                        px: 1.8,
                        py: 1,
                        borderRadius: 99,
                        bgcolor: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: 'rgba(241, 245, 249, 0.96)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      {item.icon}
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {item.text}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: { xs: 'flex-start', lg: 'flex-end' },
                  alignItems: 'stretch'
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: 420,
                    p: { xs: 2.5, md: 3 },
                    borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.14)',
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 18px 40px rgba(15, 23, 42, 0.22)',
                    animation: `${fadeInUp} 1.05s ease-out`
                  }}
                >
                  <Typography sx={{ color: '#cbd5e1', mb: 2, fontWeight: 600 }}>
                    Điểm nhấn hôm nay
                  </Typography>

                  <Box
                    component="img"
                    src={activeSlide.image}
                    alt={activeSlide.title}
                    loading="lazy"
                    sx={{
                      width: '100%',
                      height: { xs: 220, md: 250 },
                      objectFit: 'cover',
                      borderRadius: 3,
                      mb: 2.5,
                      boxShadow: '0 16px 32px rgba(2, 6, 23, 0.25)'
                    }}
                  />

                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                    {activeSlide.eyebrow}
                  </Typography>

                  <Typography sx={{ color: 'rgba(226, 232, 240, 0.84)', lineHeight: 1.7, mb: 2.5 }}>
                    Giao diện được tối ưu để tìm sách nhanh, theo dõi xu hướng đọc và nhận ưu đãi hấp dẫn theo mùa.
                  </Typography>

                  <Stack direction="row" spacing={1.5}>
                    {activeSlide.stats.map((stat) => (
                      <Box
                        key={stat.label}
                        sx={{
                          flex: 1,
                          minWidth: 0,
                          p: 1.6,
                          borderRadius: 3,
                          bgcolor: 'rgba(15, 23, 42, 0.28)',
                          border: '1px solid rgba(255,255,255,0.08)'
                        }}
                      >
                        <Typography sx={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
                          {stat.value}
                        </Typography>
                        <Typography sx={{ fontSize: '0.78rem', color: '#cbd5e1', mt: 0.5 }}>
                          {stat.label}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Box>
            </Box>
          </Container>

          <Box
            sx={{
              position: 'absolute',
              right: { xs: 18, md: 24 },
              bottom: { xs: 18, md: 24 },
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              zIndex: 2
            }}
          >
            <Button
              onClick={() => setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length)}
              sx={{
                minWidth: 0,
                width: 42,
                height: 42,
                borderRadius: '50%',
                color: '#fff',
                bgcolor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.16)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.18)'
                }
              }}
            >
              <ChevronLeftRoundedIcon />
            </Button>

            {slides.map((slide, index) => (
              <Box
                key={slide.id}
                onClick={() => setActiveIndex(index)}
                sx={{
                  width: index === activeIndex ? 28 : 10,
                  height: 10,
                  borderRadius: 99,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  bgcolor: index === activeIndex ? '#f5b942' : 'rgba(255,255,255,0.45)'
                }}
              />
            ))}

            <Button
              onClick={() => setActiveIndex((prev) => (prev + 1) % slides.length)}
              sx={{
                minWidth: 0,
                width: 42,
                height: 42,
                borderRadius: '50%',
                color: '#fff',
                bgcolor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.16)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.18)'
                }
              }}
            >
              <ChevronRightRoundedIcon />
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSlider;