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
            Danh sách yêu thích trống
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
            Bạn chưa thêm cuốn sách nào vào danh sách yêu thích. Hãy khám phá bộ sưu tập của chúng tôi!
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/"
            size="large"
            disableElevation
            sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 700 }}
          >
            Khám phá sách
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, color: 'text.primary' }}>
          Danh sách yêu thích
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Bạn có {wishlist.length} sản phẩm trong danh sách yêu thích.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {wishlist.map((book) => (
          <Grid item key={book._id} xs={6} sm={4} md={3} lg={2}>
            <BookCard book={book} variant="compact" />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Wishlist;
