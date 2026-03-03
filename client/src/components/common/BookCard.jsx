import React from 'react';
import { Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
  return (
    <Card sx={{ maxWidth: 345, m: 1 }}>
      <CardMedia component="img" height="140" image={book.cover || '/assets/default-book.jpg'} alt={book.title} />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {book.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {book.author}
        </Typography>
        <Typography variant="subtitle1" color="primary">
          ${book.price}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" component={Link} to={`/product/${book.id}`}>Details</Button>
      </CardActions>
    </Card>
  );
};

export default BookCard;