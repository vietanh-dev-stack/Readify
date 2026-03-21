import React from 'react';
import { Box, Typography, Button, Container, Grid } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BookCard from '../common/BookCard';
import { useNavigate } from 'react-router-dom';

const BookSection = ({ title, subtitle, books, exploreLink, exploreText = "Xem tất cả" }) => {
  const navigate = useNavigate();

  if (!books || books.length === 0) return null;

  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4, borderBottom: '2px solid', borderColor: 'grey.100', pb: 2 }}>
          <Box>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 800, color: '#111827' }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body1" sx={{ mt: 1, color: '#6B7280' }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          {exploreLink && (
            <Button 
              endIcon={<ArrowForwardIcon />} 
              sx={{ display: { xs: 'none', sm: 'flex' }, fontWeight: 600, color: '#3b82f6', '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.08)' } }}
              onClick={() => navigate(exploreLink)}
            >
              {exploreText}
            </Button>
          )}
        </Box>

        <Grid container spacing={3} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)', xl: 'repeat(5, 1fr)' }, gap: 3 }}>
          {books.map((b) => (
            <Box key={b._id}>
              <BookCard book={b} />
            </Box>
          ))}
        </Grid>

        {exploreLink && (
          <Box sx={{ mt: 4, textAlign: 'center', display: { xs: 'block', sm: 'none' } }}>
            <Button 
              endIcon={<ArrowForwardIcon />} 
              fullWidth 
              variant="outlined"
              onClick={() => navigate(exploreLink)}
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
