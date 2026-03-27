import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const getStatusConfig = (status) => {
  if (status === 'success') {
    return {
      title: 'Payment successful',
      description: 'Your order has been placed successfully. We will process it shortly.',
      color: 'success',
      icon: <CheckCircleOutlineIcon color="success" sx={{ fontSize: 72 }} />,
    };
  }

  if (status === 'pending') {
    return {
      title: 'Payment pending',
      description: 'Your payment is being processed. Please check again in a few minutes.',
      color: 'warning',
      icon: <PendingOutlinedIcon color="warning" sx={{ fontSize: 72 }} />,
    };
  }

  return {
    title: 'Payment not completed',
    description: 'We could not confirm your payment. Please review your order status or try again.',
    color: 'error',
    icon: <ErrorOutlineIcon color="error" sx={{ fontSize: 72 }} />,
  };
};

function PaymentResult() {
  const [searchParams] = useSearchParams();
  const status = (searchParams.get('status') || '').toLowerCase();
  const orderId = searchParams.get('orderId');
  const message = searchParams.get('message');

  const statusConfig = getStatusConfig(status);

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 8 } }}>
      <Card elevation={3}>
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Box>{statusConfig.icon}</Box>

            <Stack spacing={1} alignItems="center">
              <Chip
                label={status ? status.toUpperCase() : 'UNKNOWN'}
                color={statusConfig.color}
                variant="outlined"
              />
              <Typography variant="h4" fontWeight={700}>
                {statusConfig.title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {statusConfig.description}
              </Typography>
            </Stack>

            {(orderId || message) && (
              <Stack spacing={2} sx={{ width: '100%' }}>
                {orderId && (
                  <Alert severity="info" sx={{ textAlign: 'left' }}>
                    <strong>Order ID:</strong> {orderId}
                  </Alert>
                )}

                {message && (
                  <Alert severity={status === 'success' ? 'success' : 'warning'} sx={{ textAlign: 'left' }}>
                    {message}
                  </Alert>
                )}
              </Stack>
            )}

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ width: '100%' }}
              justifyContent="center"
            >
              <Button
                component={Link}
                to="/"
                variant="contained"
                startIcon={<HomeOutlinedIcon />}
                fullWidth
              >
                Back to home
              </Button>
              <Button
                component={Link}
                to="/cart"
                variant="outlined"
                startIcon={<ShoppingCartOutlinedIcon />}
                fullWidth
              >
                Go to cart
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}

export default PaymentResult;