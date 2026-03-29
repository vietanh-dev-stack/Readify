import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Rating,
  Stack,
  Typography,
} from '@mui/material';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import StarRoundedIcon from '@mui/icons-material/StarRounded';

const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);

const getDiscountPercent = (price, discountPrice) => {
  if (!discountPrice || discountPrice >= price) {
    return null;
  }

  return Math.round(((price - discountPrice) / price) * 100);
};

const BookCard = ({ book }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const currentPrice = book.discountPrice || book.price;
  const discountPercent = useMemo(
    () => getDiscountPercent(book.price, book.discountPrice),
    [book.discountPrice, book.price]
  );

  return (
    <Card
      elevation={0}
      sx={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        overflow: 'hidden',
        bgcolor: '#fff',
        border: '1px solid',
        borderColor: 'rgba(30, 58, 138, 0.08)',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 18px 40px rgba(30, 58, 138, 0.16)',
        },
      }}
    >
      {discountPercent ? (
        <Chip
          label={`-${discountPercent}%`}
          size="small"
          sx={{
            position: 'absolute',
            top: 14,
            left: 14,
            zIndex: 2,
            fontWeight: 700,
            bgcolor: '#f59e0b',
            color: '#fff',
            borderRadius: 2,
          }}
        />
      ) : null}

      <IconButton
        aria-label="Yêu thích"
        onClick={() => setIsFavorite((prev) => !prev)}
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 2,
          bgcolor: 'rgba(255,255,255,0.92)',
          color: isFavorite ? '#e11d48' : '#1e3a8a',
          boxShadow: '0 8px 20px rgba(15, 23, 42, 0.12)',
          '&:hover': {
            bgcolor: '#fff',
          },
        }}
      >
        {isFavorite ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
      </IconButton>

      <Box
        sx={{
          px: 2,
          pt: 2,
          pb: 1,
          background: 'linear-gradient(180deg, rgba(219,234,254,0.85) 0%, rgba(255,255,255,1) 100%)',
        }}
      >
        <CardMedia
          component="img"
          image={book.image}
          alt={book.title}
          sx={{
            height: 240,
            width: '100%',
            objectFit: 'cover',
            borderRadius: 3,
            border: '1px solid rgba(30, 58, 138, 0.08)',
            boxShadow: '0 12px 28px rgba(30, 58, 138, 0.12)',
          }}
        />
      </Box>

      <CardContent
        sx={{
          p: 2.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.25,
          flexGrow: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: '1rem',
            lineHeight: 1.45,
            fontWeight: 700,
            color: '#0f172a',
            minHeight: 46,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {book.title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            minHeight: 20,
          }}
        >
          {book.author}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
          <Typography
            variant="h6"
            sx={{
              color: '#1e3a8a',
              fontWeight: 800,
              fontSize: '1.05rem',
            }}
          >
            {formatCurrency(currentPrice)}
          </Typography>

          {book.discountPrice && book.discountPrice < book.price ? (
            <Typography
              variant="body2"
              sx={{
                color: 'text.disabled',
                textDecoration: 'line-through',
              }}
            >
              {formatCurrency(book.price)}
            </Typography>
          ) : null}
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <Rating
              value={book.rating || 0}
              precision={0.5}
              size="small"
              readOnly
              icon={<StarRoundedIcon fontSize="inherit" />}
              emptyIcon={<StarRoundedIcon fontSize="inherit" />}
              sx={{
                color: '#eab308',
              }}
            />
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              {Number(book.rating || 0).toFixed(1)}
            </Typography>
          </Stack>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Đã bán {book.sold}
          </Typography>
        </Stack>

        <Box sx={{ flexGrow: 1 }} />

        <Button
          fullWidth
          variant="contained"
          startIcon={<LocalMallOutlinedIcon />}
          sx={{
            mt: 1,
            py: 1.2,
            borderRadius: 999,
            textTransform: 'none',
            fontWeight: 700,
            bgcolor: '#1e3a8a',
            boxShadow: '0 10px 24px rgba(30, 58, 138, 0.24)',
            '&:hover': {
              bgcolor: '#1d4ed8',
            },
          }}
        >
          Thêm vào giỏ
        </Button>
      </CardContent>
    </Card>
  );
};

export default BookCard;