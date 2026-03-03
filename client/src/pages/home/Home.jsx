import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import BookCard from '../../components/common/BookCard';

// sample data
const mockBooks = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 10.99, cover: '' },
  { id: 2, title: '1984', author: 'George Orwell', price: 12.49, cover: '' },
  { id: 3, title: 'Clean Code', author: 'Robert C. Martin', price: 29.99, cover: '' },
];

const Home = () => {
  // eslint-disable-next-line no-unused-vars
const [books, setBooks] = useState(mockBooks);

  useEffect(() => {
    // TODO: fetch from service
    // already populated with mock data
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Home
      </Typography>
      <Grid container spacing={2}>
        {books.map((b) => (
          <Grid item key={b.id} xs={12} sm={6} md={4}>
            <BookCard book={b} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Home;