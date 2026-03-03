import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, TextField, Grid } from '@mui/material';

const mockBook = {
  id: 1,
  title: 'The Great Gatsby',
  author: 'F. Scott Fitzgerald',
  price: 10.99,
  description: 'A novel set in the Jazz Age that tells the story of Jay Gatsby and his unrequited love for Daisy Buchanan.',
  cover: '',
};

const Detail = () => {
  const { id } = useParams();
  // eslint-disable-next-line no-unused-vars
  const [book, setBook] = useState(mockBook);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // TODO: fetch book by id
    // already initialized with mock data
  }, [id]);

  const addToCart = () => {
    // placeholder - integrate with cart service
    alert(`Added ${quantity} copies of "${book.title}" to cart`);
  };

  if (!book) return <Typography>Loading...</Typography>;

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
        <Box component="img" src={book.cover || '/assets/default-book.jpg'} alt={book.title} sx={{ width: '100%' }} />
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography variant="h4" gutterBottom>
          {book.title}
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          by {book.author}
        </Typography>
        <Typography variant="h5" color="primary" gutterBottom>
          ${book.price}
        </Typography>
        <Typography paragraph>{book.description}</Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <TextField
            type="number"
            label="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            inputProps={{ min: 1 }}
            sx={{ width: 100, mr: 2 }}
          />
          <Button variant="contained" onClick={addToCart}>Add to Cart</Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Detail;