import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Button, Grid, Rating, Divider, Chip, Breadcrumbs, Link, IconButton, Paper } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';

const mockBook = {
  id: 1,
  title: 'The Great Gatsby',
  author: 'F. Scott Fitzgerald',
  price: 10.99,
  oldPrice: 14.99,
  rating: 4.8,
  reviews: 1245,
  description: 'A true classic of twentieth-century literature, this edition has been updated to include a fascinating introduction and additional background material. Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway\'s interactions with mysterious millionaire Jay Gatsby and Gatsby\'s obsession to reunite with his former lover, Daisy Buchanan.',
  cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
  category: 'Classic Fiction',
  isbn: '978-0743273565',
  pages: 180,
  publisher: 'Scribner',
  stock: 12
};

const Detail = () => {
  const { id } = useParams();
  // eslint-disable-next-line no-unused-vars
  const [book, setBook] = useState(mockBook);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // TODO: fetch book by id
  }, [id]);

  const handleIncrement = () => {
    if (quantity < book.stock) setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const addToCart = () => {
    alert(`Added ${quantity} copies of "${book.title}" to cart`);
  };

  if (!book) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 4 }}
      >
        <Link component={RouterLink} underline="hover" color="inherit" to="/">
          Home
        </Link>
        <Link component={RouterLink} underline="hover" color="inherit" to="/books">
          Books
        </Link>
        <Typography color="text.primary">{book.title}</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' }, gap: 6, alignItems: 'start' }}>
        {/* Left Column: Image */}
        <Box>
          <Box 
            sx={{ 
              position: 'relative', 
              borderRadius: 4, 
              overflow: 'hidden',
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
              bgcolor: 'grey.100'
            }}
          >
            <Box 
              component="img" 
              src={book.cover} 
              alt={book.title} 
              sx={{ width: '100%', display: 'block' }} 
            />
            {book.stock > 0 && (
              <Chip 
                label="In Stock" 
                color="success" 
                size="small"
                sx={{ position: 'absolute', top: 16, left: 16, fontWeight: 'bold' }} 
              />
            )}
          </Box>
        </Box>

        {/* Right Column: Details */}
        <Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: 1 }}>
              {book.category}
            </Typography>
            
            <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mt: 1, mb: 1, lineHeight: 1.1 }}>
              {book.title}
            </Typography>
            
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              by <Link href="#" underline="hover" color="inherit">{book.author}</Link>
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Rating value={book.rating} precision={0.5} readOnly />
              <Typography variant="body2" sx={{ ml: 1, mr: 2, color: 'text.secondary' }}>
                {book.rating} ({book.reviews} reviews)
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 3, gap: 2 }}>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 800 }}>
                ${book.price}
              </Typography>
              {book.oldPrice && (
                <Typography variant="h6" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                  ${book.oldPrice}
                </Typography>
              )}
            </Box>

            <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 4 }}>
              {book.description}
            </Typography>

            <Divider sx={{ mb: 4 }} />

            {/* Action Area */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4, flexWrap: 'wrap' }}>
              <Paper 
                elevation={0} 
                sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
              >
                <IconButton onClick={handleDecrement} disabled={quantity <= 1}>
                  <RemoveIcon />
                </IconButton>
                <Typography sx={{ px: 2, fontWeight: 600, minWidth: '40px', textAlign: 'center' }}>
                  {quantity}
                </Typography>
                <IconButton onClick={handleIncrement} disabled={quantity >= book.stock}>
                  <AddIcon />
                </IconButton>
              </Paper>
              
              <Button 
                variant="contained" 
                size="large" 
                startIcon={<ShoppingCartIcon />}
                onClick={addToCart}
                sx={{ flexGrow: 1, py: 1.5, borderRadius: 2, fontWeight: 700 }}
              >
                Add to Cart
              </Button>
            </Box>

            {/* Additional Info Cards */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <LocalShippingOutlinedIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Free Shipping</Typography>
                    <Typography variant="body2" color="text.secondary">On orders over $50</Typography>
                  </Box>
                </Box>
              </Box>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <VerifiedUserOutlinedIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Secure Payment</Typography>
                    <Typography variant="body2" color="text.secondary">100% secure checkout</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
                <strong>ISBN:</strong> {book.isbn}
              </Typography>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
                <strong>Pages:</strong> {book.pages}
              </Typography>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                <strong>Publisher:</strong> {book.publisher}
              </Typography>
            </Box>

          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Detail;