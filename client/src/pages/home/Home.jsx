import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Button, Container } from '@mui/material';
import BookCard from '../../components/common/BookCard';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

// sample data
const mockBooks = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 10.99, rating: 4.5, category: 'Classic', cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600' },
  { id: 2, title: '1984', author: 'George Orwell', price: 12.49, rating: 5.0, category: 'Dystopian', cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600' },
  { id: 3, title: 'Clean Code', author: 'Robert C. Martin', price: 29.99, rating: 4.8, category: 'Programming', cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600' },
  { id: 4, title: 'Dune', author: 'Frank Herbert', price: 15.99, rating: 4.7, category: 'Sci-Fi', cover: 'https://images.unsplash.com/photo-1614729939124-032f0b561bce?auto=format&fit=crop&q=80&w=600' },
  { id: 5, title: 'The Hobbit', author: 'J.R.R. Tolkien', price: 14.99, rating: 4.9, category: 'Fantasy', cover: 'https://images.unsplash.com/photo-1629196914948-4e1b827e66df?auto=format&fit=crop&q=80&w=600' },
  { id: 6, title: 'Sapiens', author: 'Yuval Noah Harari', price: 18.50, rating: 4.6, category: 'History', cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600' }
];

const Home = () => {
  // eslint-disable-next-line no-unused-vars
  const [books, setBooks] = useState(mockBooks);

  useEffect(() => {
    // TODO: fetch from service
    // already populated with mock data
  }, []);

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.dark', 
          color: 'primary.contrastText', 
          borderRadius: 4, 
          p: { xs: 4, md: 8 }, 
          mb: 8,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: { xs: 'center', md: 'flex-start' },
          textAlign: { xs: 'center', md: 'left' }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
          <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 2, display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, gap: 1, mb: 2, color: 'secondary.light' }}>
            <AutoAwesomeIcon fontSize="small" /> Editor's Choice
          </Typography>
          <Typography variant="h2" component="h1" sx={{ fontWeight: 800, mb: 3, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Discover Your Next Great Adventure
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, color: 'grey.300', fontWeight: 400, lineHeight: 1.6 }}>
            Explore thousands of books ranging from thrilling mysteries to insightful biographies. Enjoy special discounts on bestsellers.
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large" 
            endIcon={<ArrowForwardIcon />}
            sx={{ px: 4, py: 1.5, borderRadius: '50px', fontWeight: 700 }}
          >
            Start Reading
          </Button>
        </Box>
        {/* Decorative elements behind text can go here, like blurred glowing orbs */}
      </Box>

      {/* Popular Books Section */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4 }}>
          <Box>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 800 }}>
              Trending Now
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              The most loved books by our community this week.
            </Typography>
          </Box>
          <Button endIcon={<ArrowForwardIcon />} sx={{ display: { xs: 'none', sm: 'flex' } }}>
            View All
          </Button>
        </Box>

        <Grid container spacing={4} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 4 }}>
          {books.map((b) => (
            <Box key={b.id}>
              <BookCard book={b} />
            </Box>
          ))}
        </Grid>
        <Box sx={{ mt: 4, textAlign: 'center', display: { xs: 'block', sm: 'none' } }}>
          <Button endIcon={<ArrowForwardIcon />} fullWidth variant="outlined">
            View All Trending
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;