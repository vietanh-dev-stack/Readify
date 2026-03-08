import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Button, Grid, Rating, Divider, Chip, Breadcrumbs, Link, IconButton, Paper } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import { fetchBookById } from '../../services/book.service';

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
  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchBookById(id)
        setBook(response.data)
        if (response.data) {
          setSelectedImage(response.data.coverImage || response.data.cover)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
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

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 2fr', lg: '3fr 7fr' }, gap: 6, alignItems: 'start' }}>
        {/* Left Column: Image */}
        <Box sx={{ maxWidth: { xs: '100%', sm: 400, md: '100%' }, mx: 'auto', width: '100%' }}>
          <Box
            sx={{
              position: 'relative',
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
              bgcolor: 'grey.100',
              mb: 2,
              aspectRatio: '3/4'
            }}
          >
            <Box
              component="img"
              src={selectedImage || book.coverImage || book.cover}
              alt={book.title}
              sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
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

          {/* Thumbnails */}
          {((book.images && book.images.length > 0) || book.coverImage) && (
            <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { height: 6 }, '&::-webkit-scrollbar-thumb': { bgcolor: 'grey.300', borderRadius: 10 } }}>
              {[book.coverImage || book.cover, ...(book.images || [])].filter(Boolean).map((img, index) => (
                <Box
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  sx={{
                    width: 80,
                    height: 106,
                    flexShrink: 0,
                    borderRadius: 2,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: '2px solid',
                    borderColor: selectedImage === img ? 'primary.main' : 'transparent',
                    opacity: selectedImage === img ? 1 : 0.7,
                    transition: 'all 0.2s',
                    '&:hover': {
                      opacity: 1
                    }
                  }}
                >
                  <Box component="img" src={img} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Right Column: Details */}
        <Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

            <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: 1 }}>
              {book.categoryId?.name || book.category}
            </Typography>

            <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mt: 1, mb: 1, lineHeight: 1.1 }}>
              {book.title}
            </Typography>

            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              by <Link href="#" underline="hover" color="inherit">{book.authorIds?.map(a => a.name).join(', ') || book.author}</Link>
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Rating value={book.ratingAvg || book.rating || 0} precision={0.5} readOnly />
              <Typography variant="body2" sx={{ ml: 1, mr: 2, color: 'text.secondary' }}>
                {book.ratingAvg || book.rating || 0} ({book.ratingCount || book.reviews || 0} reviews)
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 3, gap: 2 }}>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 800 }}>
                ${book.discountPrice > 0 ? book.discountPrice : book.price}
              </Typography>
              {(book.oldPrice || (book.discountPrice > 0 && book.price > book.discountPrice)) && (
                <Typography variant="h6" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                  ${book.oldPrice || book.price}
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
                <strong>Publisher:</strong> {book.publisherId?.name || book.publisher}
              </Typography>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
                <strong>Language:</strong> {book.bookLanguage}
              </Typography>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
                <strong>Pages:</strong> {book.pages}
              </Typography>
              {book.releaseDate && (
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  <strong>Release Date:</strong> {new Date(book.releaseDate).toLocaleDateString()}
                </Typography>
              )}
            </Box>

          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Detail;