import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BookCard from '../common/BookCard';
import { useNavigate } from 'react-router-dom';

const BookSection = ({
  title,
  subtitle,
  books,
  exploreLink,
  exploreText = 'Xem tất cả'
}) => {
  const navigate = useNavigate();

  if (!books || books.length === 0) return null;

  return (
    <Box sx={{ py: { xs: 5, md: 7 } }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            mb: { xs: 3, md: 4 },
            px: { xs: 0.5, sm: 0 },
            display: 'flex',
            alignItems: { xs: 'flex-start', md: 'flex-end' },
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            pb: 2.5,
            borderBottom: '1px solid',
            borderColor: 'rgba(99, 102, 241, 0.12)'
          }}
        >
          <Box sx={{ maxWidth: 760 }}>
            <Typography
              variant="overline"
              sx={{
                display: 'inline-block',
                mb: 0.75,
                color: '#f59e0b',
                fontWeight: 800,
                letterSpacing: 1.2
              }}
            >
              Bộ sưu tập nổi bật
            </Typography>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 900,
                color: '#0f172a',
                letterSpacing: '-0.02em',
                fontSize: { xs: '1.8rem', md: '2.25rem' }
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant="body1"
                sx={{
                  mt: 1.25,
                  color: '#64748b',
                  maxWidth: 640,
                  lineHeight: 1.75
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>

          {exploreLink && (
            <Button
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate(exploreLink)}
              sx={{
                display: { xs: 'none', sm: 'inline-flex' },
                alignSelf: { sm: 'center', md: 'flex-end' },
                px: 2.5,
                py: 1.1,
                borderRadius: 999,
                bgcolor: 'rgba(79, 70, 229, 0.08)',
                color: 'primary.main',
                fontWeight: 700,
                textTransform: 'none',
                '&:hover': {
                  bgcolor: 'rgba(79, 70, 229, 0.14)'
                }
              }}
            >
              {exploreText}
            </Button>
          )}
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, minmax(0, 1fr))',
              sm: 'repeat(2, minmax(0, 1fr))',
              md: 'repeat(3, minmax(0, 1fr))',
              lg: 'repeat(4, minmax(0, 1fr))',
              xl: 'repeat(5, minmax(0, 1fr))'
            },
            gap: { xs: 2, md: 3 },
            overflowX: { xs: 'auto', sm: 'visible' },
            pb: { xs: 1, sm: 0 },
            pr: { xs: 0.5, sm: 0 },
            scrollSnapType: { xs: 'x proximity', sm: 'none' },
            '&::-webkit-scrollbar': {
              height: 8
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(148, 163, 184, 0.4)',
              borderRadius: 999
            }
          }}
        >
          {books.map((b, index) => (
            <Box
              key={b?._id || b?.id || `${title}-${index}`}
              sx={{
                minWidth: { xs: '168px', sm: 'auto' },
                scrollSnapAlign: { xs: 'start', sm: 'unset' }
              }}
            >
              <BookCard book={b} />
            </Box>
          ))}
        </Box>

        {exploreLink && (
          <Box sx={{ mt: 3.5, display: { xs: 'block', sm: 'none' } }}>
            <Button
              endIcon={<ArrowForwardIcon />}
              fullWidth
              variant="outlined"
              onClick={() => navigate(exploreLink)}
              sx={{
                py: 1.15,
                borderRadius: 999,
                textTransform: 'none',
                fontWeight: 700,
                borderColor: 'rgba(79, 70, 229, 0.22)',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'rgba(79, 70, 229, 0.04)'
                }
              }}
            >
              {exploreText}
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default BookSection;