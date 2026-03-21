import React, { useState } from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Button, Rating, IconButton, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import useWishlistStore from '../../store/useWishlistStore';
import useCartStore from '../../store/useCartStore';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

const BookCard = ({ book }) => {
  const { wishlist, toggleWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuth();
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const isFavorite = wishlist.some((item) => item._id === book._id || item.id === book.id);

  // Mocking discount for UI purposes if not present
  const discountRate = book.discountRate || (Math.random() > 0.5 ? Math.floor(Math.random() * 30) + 10 : 0);
  const oldPrice = book.price || 150000;
  const currentPrice = discountRate > 0 ? oldPrice * (1 - discountRate / 100) : oldPrice;

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm vào yêu thích!');
      return;
    }

    if (isTogglingWishlist) return;

    setIsTogglingWishlist(true);
    try {
      const newState = await toggleWishlist(book);
      if (newState) {
        toast.success('Đã thêm vào danh sách yêu thích');
      } else {
        toast.success('Đã bỏ khỏi danh sách yêu thích');
      }
    } catch (error) {
      toast.error('Lỗi khi cập nhật danh sách yêu thích');
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để mua hàng!');
      return;
    }
    
    if (isAddingToCart) return;

    setIsAddingToCart(true);
    try {
      await addToCart({ bookId: book._id || book.id, quantity: 1, price: currentPrice });
      toast.success('Đã thêm vào giỏ hàng');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể thêm vào giỏ hàng');
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <Card 
      component={Link}
      to={`/book/${book._id || book.id}`}
      sx={{ 
        textDecoration: 'none',
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'grey.100',
        bgcolor: '#fff',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          borderColor: 'primary.light',
          boxShadow: '0 20px 40px -10px rgba(37, 99, 235, 0.15), 0 10px 20px -5px rgba(37, 99, 235, 0.1)',
          '& .book-cover': {
            transform: 'scale(1.06)'
          },
          '& .cart-overlay': {
            transform: 'translateY(0)',
            opacity: 1
          }
        }
      }}
    >
      {/* Image Section */}
      <Box sx={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', bgcolor: 'grey.50' }}>
        <CardMedia 
          className="book-cover"
          component="img" 
          image={book.coverImage || book.cover || 'https://via.placeholder.com/300x400?text=No+Cover'} 
          alt={book.title}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
        
        {/* Discount Badge */}
        {discountRate > 0 && (
          <Box sx={{ 
            position: 'absolute', top: 12, right: 12, 
            bgcolor: '#ef4444', color: '#fff', 
            px: 1, py: 0.5, borderRadius: 1.5, 
            fontWeight: 800, fontSize: '0.75rem',
            boxShadow: '0 4px 10px rgba(239, 68, 68, 0.4)',
            zIndex: 10
          }}>
            -{discountRate}%
          </Box>
        )}

        {/* Wishlist Button */}
        <Tooltip title={isFavorite ? "Bỏ yêu thích" : "Thêm yêu thích"} placement="left">
          <IconButton
            onClick={handleToggleWishlist}
            disabled={isTogglingWishlist}
            sx={{
              position: 'absolute', top: 12, left: 12,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
              '&:hover': {
                bgcolor: '#fff',
                transform: 'scale(1.1)',
                color: '#ef4444'
              },
              transition: 'all 0.2s',
              zIndex: 10,
              width: 32, height: 32
            }}
          >
            {isFavorite ? (
              <FavoriteIcon sx={{ color: '#ef4444', fontSize: '1.2rem' }} />
            ) : (
              <FavoriteBorderIcon sx={{ color: '#94a3b8', fontSize: '1.2rem' }} />
            )}
          </IconButton>
        </Tooltip>

        {/* Add to Cart Overlay */}
        <Box 
          className="cart-overlay"
          sx={{ 
            position: 'absolute', bottom: 0, left: 0, right: 0, p: 2, 
            transform: 'translateY(100%)', opacity: 0,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
            display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
            zIndex: 5, height: '50%'
          }}
        >
          <Button 
            variant="contained" 
            fullWidth
            startIcon={<ShoppingCartOutlinedIcon />}
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            sx={{ 
              bgcolor: '#2563eb', fontWeight: 700, borderRadius: 2, 
              textTransform: 'none', py: 1,
              boxShadow: '0 4px 10px rgba(37, 99, 235, 0.4)',
              '&:hover': { bgcolor: '#1d4ed8' }
            }}
          >
            Thêm vào giỏ
          </Button>
        </Box>
      </Box>

      {/* Content Section */}
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2, pt: 2.5 }}>
        
        {/* Title */}
        <Typography 
          variant="subtitle1" 
          component="h3" 
          sx={{ 
            fontWeight: 700, 
            mb: 0.5, 
            lineHeight: 1.4,
            color: '#1e293b',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.8em',
            '&:hover': { color: '#2563eb' },
            transition: 'color 0.2s'
          }}
        >
          {book.title}
        </Typography>

        {/* Author */}
        <Typography variant="body2" sx={{ color: '#64748b', mb: 1, fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {book.authorIds?.map(author => author.name).join(', ') || book.author || 'Tác giả chưa rõ'}
        </Typography>
        
        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <Rating value={book.rating || 4.5} precision={0.5} size="small" readOnly sx={{ color: '#fbbf24', fontSize: '1rem' }} />
          <Typography variant="caption" sx={{ ml: 1, color: '#94a3b8', fontWeight: 500 }}>
            ({book.reviews || Math.floor(Math.random() * 200) + 12})
          </Typography>
        </Box>

        <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'flex-end', gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#ef4444', lineHeight: 1 }}>
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentPrice)}
          </Typography>
          
          {discountRate > 0 && (
            <Typography variant="body2" sx={{ textDecoration: 'line-through', color: '#94a3b8', fontWeight: 500, lineHeight: 1.2 }}>
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(oldPrice)}
            </Typography>
          )}
        </Box>

      </CardContent>
    </Card>
  );
};

export default BookCard;