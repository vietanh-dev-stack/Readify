import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Button, Rating, Chip } from '@mui/material';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
  return (
    <Card 
      sx={{ 
        maxWidth: '100%', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-10px)',
          borderColor: 'primary.light',
          boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15), 0 10px 15px -3px rgb(0 0 0 / 0.1)',
          '& .MuiCardMedia-root': {
            transform: 'scale(1.08)'
          }
        }
      }}
    >
      <Box sx={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', bgcolor: 'grey.100' }}>
        <CardMedia 
          component="img" 
          image={book.cover || 'https://via.placeholder.com/300x450?text=No+Cover'} 
          alt={book.title}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
        <Chip 
          label={`$${book.price}`} 
          color="primary" 
          size="small"
          sx={{ 
            position: 'absolute', 
            top: 12, 
            right: 12, 
            fontWeight: 800,
            fontSize: '0.85rem',
            px: 0.5,
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.2)'
          }} 
        />
        {/* Gradient Overlay for better contrast */}
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%)', pointerEvents: 'none' }} />
      </Box>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
        <Typography variant="overline" color="primary.main" sx={{ fontWeight: 800, letterSpacing: 1.2, lineHeight: 1 }}>
          {book.category || 'Fiction'}
        </Typography>
        <Typography 
          gutterBottom 
          variant="h6" 
          component="h2" 
          sx={{ 
            fontWeight: 800, 
            mt: 1, 
            mb: 0.5, 
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minHeight: '2.6em' // Ensures consistent height even if title is 1 line
          }}
        >
          {book.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
          By {book.author}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, mt: 'auto' }}>
          <Rating value={book.rating || 4.5} precision={0.5} size="small" readOnly sx={{ color: '#F59E0B' }} />
          <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary', fontWeight: 600 }}>
            ({book.reviews || 120})
          </Typography>
        </Box>

        <Button 
          variant="contained" 
          fullWidth 
          component={Link} 
          to={`/product/${book.id}`}
          disableElevation
          sx={{ py: 1, fontWeight: 700, borderRadius: 2 }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default BookCard;