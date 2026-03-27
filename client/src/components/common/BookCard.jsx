import React, { useMemo, useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  Rating,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import useWishlistStore from '../../store/useWishlistStore';
import useCartStore from '../../store/useCartStore';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(Number(value) || 0);

const getAuthors = (book) => {
  if (Array.isArray(book?.authorIds) && book.authorIds.length > 0) {
    return book.authorIds
      .map((author) => author?.name || author?.fullName || author)
      .filter(Boolean)
      .join(', ');
  }

  if (Array.isArray(book?.authors) && book.authors.length > 0) {
    return book.authors
      .map((author) => author?.name || author?.fullName || author)
      .filter(Boolean)
      .join(', ');
  }

  return book?.author || book?.authorName || 'Tác giả đang cập nhật';
};

const getRatingValue = (book) => {
  const rawRating = Number(
    book?.rating ??
      book?.averageRating ??
      book?.avgRating ??
      book?.ratingsAverage ??
      0
  );

  if (Number.isNaN(rawRating) || rawRating < 0) return 0;
  if (rawRating > 5) return 5;
  return rawRating;
};

const getReviewCount = (book) =>
  Number(
    book?.reviewsCount ??
      book?.reviewCount ??
      book?.numReviews ??
      (Array.isArray(book?.reviews) ? book.reviews.length : book?.reviews) ??
      0
  ) || 0;

const getSoldCount = (book) =>
  Number(
    book?.sold ??
      book?.soldCount ??
      book?.salesCount ??
      book?.totalSold ??
      book?.ordersCount ??
      0
  ) || 0;

const getImageSrc = (book) =>
  book?.coverImage ||
  book?.cover ||
  book?.image ||
  book?.thumbnail ||
  'https://via.placeholder.com/400x560/f3f4f6/94a3b8?text=Readify';

const BookCard = ({ book }) => {
  const { wishlist, toggleWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuth();
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const getId = (obj) => String(obj?._id || obj?.id);

  const isFavorite = wishlist.some((item) => getId(item) === getId(book));

  const oldPrice = Number(book?.price) || 0;
  const currentPrice =
    Number(book?.discountPrice) > 0 ? Number(book.discountPrice) : oldPrice;

  const discountRate =
    Number(book?.discountPrice) > 0 && oldPrice > 0
      ? Math.round(((oldPrice - Number(book.discountPrice)) / oldPrice) * 100)
      : 0;

  const title = book?.title || book?.name || 'Sách đang cập nhật';
  const authorText = useMemo(() => getAuthors(book), [book]);
  const ratingValue = useMemo(() => getRatingValue(book), [book]);
  const reviewCount = useMemo(() => getReviewCount(book), [book]);
  const soldCount = useMemo(() => getSoldCount(book), [book]);
  const imageSrc = useMemo(() => getImageSrc(book), [book]);

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
      await addToCart(book._id || book.id, 1, book);
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
        minHeight: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderRadius: 4,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'rgba(99, 102, 241, 0.08)',
        background:
          'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,0.92) 100%)',
        boxShadow: '0 12px 32px rgba(15, 23, 42, 0.06)',
        transition: 'transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease',
        '&:hover': {
          transform: 'translateY(-10px)',
          borderColor: 'rgba(79, 70, 229, 0.24)',
          boxShadow: '0 24px 48px rgba(15, 23, 42, 0.14)',
          '& .book-cover': {
            transform: 'scale(1.08)'
          },
          '& .cart-overlay': {
            transform: 'translateY(0)',
            opacity: 1
          },
          '& .book-title': {
            color: 'primary.main'
          }
        }
      }}
    >
      <Box
        sx={{
          position: 'relative',
          aspectRatio: '3 / 4',
          overflow: 'hidden',
          bgcolor: 'grey.100'
        }}
      >
        <CardMedia
          className="book-cover"
          component="img"
          image={imageSrc}
          alt={title}
          loading="lazy"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s ease'
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(15,23,42,0.04) 0%, rgba(15,23,42,0.02) 35%, rgba(15,23,42,0.24) 100%)',
            pointerEvents: 'none'
          }}
        />

        {discountRate > 0 && (
          <Chip
            icon={<LocalOfferOutlinedIcon sx={{ fontSize: '1rem !important' }} />}
            label={`-${discountRate}%`}
            size="small"
            sx={{
              position: 'absolute',
              top: 14,
              right: 14,
              height: 30,
              borderRadius: '999px',
              bgcolor: '#f59e0b',
              color: '#fff',
              fontWeight: 800,
              boxShadow: '0 10px 24px rgba(245, 158, 11, 0.32)',
              '& .MuiChip-icon': {
                color: '#fff'
              }
            }}
          />
        )}

        <Tooltip title={isFavorite ? 'Bỏ yêu thích' : 'Thêm yêu thích'} placement="left">
          <IconButton
            onClick={handleToggleWishlist}
            disabled={isTogglingWishlist}
            sx={{
              position: 'absolute',
              top: 14,
              left: 14,
              bgcolor: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 20px rgba(15, 23, 42, 0.12)',
              color: isFavorite ? '#ef4444' : '#64748b',
              '&:hover': {
                bgcolor: '#fff',
                transform: 'scale(1.08)',
                color: '#ef4444'
              },
              transition: 'all 0.25s ease',
              zIndex: 2,
              width: 38,
              height: 38
            }}
          >
            {isFavorite ? (
              <FavoriteIcon sx={{ fontSize: '1.2rem' }} />
            ) : (
              <FavoriteBorderIcon sx={{ fontSize: '1.2rem' }} />
            )}
          </IconButton>
        </Tooltip>

        <Box
          sx={{
            position: 'absolute',
            left: 14,
            bottom: 14,
            display: 'flex',
            gap: 1,
            flexWrap: 'wrap',
            zIndex: 2
          }}
        >
          <Chip
            label={`${soldCount}+ đã bán`}
            size="small"
            sx={{
              height: 28,
              borderRadius: '999px',
              bgcolor: 'rgba(15, 23, 42, 0.72)',
              color: '#fff',
              backdropFilter: 'blur(8px)',
              fontWeight: 700
            }}
          />
        </Box>

        <Box
          className="cart-overlay"
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            transform: { xs: 'translateY(0)', md: 'translateY(100%)' },
            opacity: { xs: 1, md: 0 },
            transition: 'all 0.35s ease',
            background:
              'linear-gradient(to top, rgba(15,23,42,0.9) 5%, rgba(15,23,42,0.08) 100%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            zIndex: 2,
            minHeight: '42%'
          }}
        >
          <Button
            variant="contained"
            fullWidth
            startIcon={<ShoppingCartOutlinedIcon />}
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            sx={{
              bgcolor: 'primary.main',
              color: '#fff',
              fontWeight: 700,
              borderRadius: 3,
              textTransform: 'none',
              py: 1.1,
              boxShadow: '0 12px 28px rgba(79, 70, 229, 0.35)',
              '&:hover': {
                bgcolor: 'primary.dark'
              }
            }}
          >
            {isAddingToCart ? 'Đang thêm...' : 'Thêm vào giỏ'}
          </Button>
        </Box>
      </Box>

      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          p: 2.25,
          gap: 1
        }}
      >
        <Typography
          variant="overline"
          sx={{
            color: '#f59e0b',
            fontWeight: 800,
            letterSpacing: 0.8,
            lineHeight: 1
          }}
        >
          Sách tuyển chọn
        </Typography>

        <Typography
          className="book-title"
          variant="h6"
          component="h3"
          sx={{
            fontSize: '1rem',
            fontWeight: 800,
            lineHeight: 1.45,
            color: '#0f172a',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.9em',
            transition: 'color 0.25s ease'
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: '#64748b',
            fontSize: '0.9rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {authorText}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            flexWrap: 'wrap'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
            <Rating
              value={ratingValue}
              precision={0.5}
              size="small"
              readOnly
              sx={{ color: '#f59e0b', fontSize: '1rem' }}
            />
            <Typography
              variant="caption"
              sx={{ ml: 0.75, color: '#64748b', fontWeight: 700 }}
            >
              {ratingValue > 0 ? ratingValue.toFixed(1) : 'Mới'}
            </Typography>
          </Box>

          <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
            {reviewCount}+ đánh giá
          </Typography>
        </Box>

        <Box
          sx={{
            mt: 'auto',
            pt: 1,
            display: 'flex',
            alignItems: 'flex-end',
            gap: 1,
            flexWrap: 'wrap'
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 900,
              color: 'primary.main',
              lineHeight: 1
            }}
          >
            {formatCurrency(currentPrice)}
          </Typography>

          {discountRate > 0 && (
            <Typography
              variant="body2"
              sx={{
                textDecoration: 'line-through',
                color: '#94a3b8',
                fontWeight: 600,
                lineHeight: 1.2
              }}
            >
              {formatCurrency(oldPrice)}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default BookCard;