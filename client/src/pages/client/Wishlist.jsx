import React, { useEffect } from 'react';
import { Box, Typography, Grid, Container, Button, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import BookCard from '../../components/common/BookCard';
import useWishlistStore from '../../store/useWishlistStore';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const Wishlist = () => {
  const { wishlist, fetchWishlist, loading } = useWishlistStore();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (wishlist.length === 0) {
    return (
      <Container maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center'
          }}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              bgcolor: 'grey.100',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3
            }}
          >
            <FavoriteBorderIcon sx={{ fontSize: 60, color: 'grey.400' }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
            Your Wishlist is Empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
            You haven't added any books to your wishlist yet. Explore our collection and find your next favorite read!
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/"
            size="large"
            disableElevation
            sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 700 }}
          >
            Browse Books
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, color: 'text.primary' }}>
          My Wishlist
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You have {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} in your wishlist.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {wishlist.map((book) => (
          <Grid item key={book._id} xs={6} sm={4} md={3} lg={2}>
            <BookCard book={book} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Wishlist;
