import React, { useEffect } from 'react';
import { Typography, Box, Grid, Paper, IconButton, Button, Divider } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Link } from 'react-router-dom';
import useCartStore from '../../store/useCartStore';

const Cart = () => {
  const { cartItems, fetchCart, updateCartItem, removeFromCart, loading } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleUpdateQuantity = async (bookId, newQuantity) => {
    try {
      await updateCartItem(bookId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleRemoveItem = async (bookId) => {
    try {
      await removeFromCart(bookId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.bookId.discountPrice || item.bookId.price) * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 5.99;
  const total = subtotal + tax + shipping;

  if (loading && cartItems.length === 0) {
    return <Typography sx={{ textAlign: 'center', py: 10 }}>Loading your cart...</Typography>;
  }

  if (cartItems.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant="h4" gutterBottom fontWeight={800}>Your Cart is Empty</Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>Looks like you haven't added any books yet.</Typography>
        <Button variant="contained" component={Link} to="/" size="large">Continue Shopping</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h3" component="h1" gutterBottom fontWeight={800} mb={4}>
        Shopping Cart
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 4 }}>
        {/* Cart Items List */}
        <Box>
          <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
            {cartItems.map((item, index) => (
              <Box key={item.bookId._id}>
                <Box sx={{ p: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                  <Box 
                    component="img" 
                    src={item.bookId.coverImage || item.bookId.cover} 
                    alt={item.bookId.title} 
                    sx={{ width: { xs: '100%', sm: 100 }, height: 140, objectFit: 'cover', borderRadius: 2 }} 
                  />
                  <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="h6" fontWeight={700} component={Link} to={`/book/${item.bookId._id}`} sx={{ textDecoration: 'none', color: 'text.primary', '&:hover': { color: 'primary.main' } }}>
                          {item.bookId.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {item.bookId.authorIds?.map(a => a.name).join(', ') || item.bookId.author}
                        </Typography>
                      </Box>
                      <Typography variant="h6" fontWeight={700} color="primary">
                        ${((item.bookId.discountPrice || item.bookId.price) * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', mt: 'auto' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <IconButton size="small" onClick={() => handleUpdateQuantity(item.bookId._id, item.quantity - 1)} disabled={item.quantity <= 1}>
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography sx={{ px: 2, fontWeight: 600 }}>{item.quantity}</Typography>
                        <IconButton size="small" onClick={() => handleUpdateQuantity(item.bookId._id, item.quantity + 1)} disabled={item.quantity >= (item.bookId.stock || 0)}>
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Button 
                        color="error" 
                        startIcon={<DeleteOutlineIcon />} 
                        onClick={() => handleRemoveItem(item.bookId._id)}
                        sx={{ textTransform: 'none' }}
                      >
                        Remove
                      </Button>
                    </Box>
                  </Box>
                </Box>
                {index < cartItems.length - 1 && <Divider />}
              </Box>
            ))}
          </Paper>
        </Box>

        {/* Order Summary */}
        <Box>
          <Paper elevation={0} sx={{ p: 4, bgcolor: 'grey.50', borderRadius: 3, position: 'sticky', top: 100 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom mb={3}>
              Order Summary
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography color="text.secondary">Subtotal</Typography>
              <Typography fontWeight={600}>${subtotal.toFixed(2)}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography color="text.secondary">Shipping</Typography>
              <Typography fontWeight={600}>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography color="text.secondary">Tax (8%)</Typography>
              <Typography fontWeight={600}>${tax.toFixed(2)}</Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
              <Typography variant="h6" fontWeight={800}>Total</Typography>
              <Typography variant="h5" fontWeight={800} color="primary">${total.toFixed(2)}</Typography>
            </Box>

            <Button variant="contained" size="large" fullWidth sx={{ py: 1.5, borderRadius: 2, fontWeight: 700 }}>
              Proceed to Checkout
            </Button>
            <Button variant="outlined" component={Link} to="/" fullWidth sx={{ mt: 2, py: 1.5, borderRadius: 2 }}>
              Continue Shopping
            </Button>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Cart;