import React from 'react';
import { Typography, List, ListItem, ListItemText, Divider, Button, Box } from '@mui/material';

const Cart = () => {
  // static sample cart
  const mockCart = [
    { id: 1, title: 'The Great Gatsby', price: 10.99, quantity: 2 },
    { id: 2, title: '1984', price: 12.49, quantity: 1 },
  ];
  const total = mockCart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>Shopping Cart</Typography>
      <List>
        {mockCart.map((item) => (
          <React.Fragment key={item.id}>
            <ListItem>
              <ListItemText
                primary={item.title}
                secondary={`Quantity: ${item.quantity}  -  $${item.price} each`}
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
      <Box sx={{ mt: 2, textAlign: 'right' }}>
        <Typography variant="h6">Total: ${total}</Typography>
        <Button variant="contained" sx={{ mt: 1 }}>Checkout</Button>
      </Box>
    </Box>
  );
};

export default Cart;