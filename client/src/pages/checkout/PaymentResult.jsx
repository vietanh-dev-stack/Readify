import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
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

function PaymentResult() {
  const [searchParams] = useSearchParams();
  const rawStatus = (searchParams.get('status') || '').toLowerCase();
  const orderId = searchParams.get('orderId');
  const message = searchParams.get('message');

  const normalizedStatus = rawStatus === 'success' ? 'success' : rawStatus || 'failed';
  const statusConfig =
    normalizedStatus === 'success' || normalizedStatus === 'paid'
      ? {
          title: 'Thanh toán thành công',
          description: 'Đơn hàng đã được tạo và thanh toán thành công. Hệ thống sẽ xử lý đơn của bạn sớm nhất.',
          color: 'success',
          icon: <CheckCircleOutlineIcon color="success" sx={{ fontSize: 72 }} />,
        }
      : normalizedStatus === 'pending'
        ? {
            title: 'Thanh toán đang chờ xử lý',
            description: 'Giao dịch đang được xử lý. Vui lòng kiểm tra lại trạng thái đơn hàng sau ít phút.',
            color: 'warning',
            icon: <PendingOutlinedIcon color="warning" sx={{ fontSize: 72 }} />,
          }
        : {
            title: 'Thanh toán chưa hoàn tất',
            description: 'Hệ thống chưa xác nhận được giao dịch. Bạn có thể kiểm tra lại đơn hàng hoặc thực hiện thanh toán lại.',
            color: 'error',
            icon: <ErrorOutlineIcon color="error" sx={{ fontSize: 72 }} />,
          };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 8 } }}>
      <Card elevation={3}>
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Box>{statusConfig.icon}</Box>

            <Stack spacing={1} alignItems="center">
              <Chip
                label={normalizedStatus ? normalizedStatus.toUpperCase() : 'UNKNOWN'}
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
                    <strong>Mã đơn hàng:</strong> {orderId}
                  </Alert>
                )}

                {message && (
                  <Alert severity={normalizedStatus === 'success' ? 'success' : normalizedStatus === 'pending' ? 'warning' : 'error'} sx={{ textAlign: 'left' }}>
                    {message}
                  </Alert>
                )}
              </Stack>
            )}

            <Alert severity={normalizedStatus === 'success' ? 'success' : 'warning'} sx={{ width: '100%', textAlign: 'left' }}>
              Với đơn hàng online như VNPay/MoMo, trạng thái cuối cùng sẽ được cập nhật sau khi cổng thanh toán redirect về trang này.
            </Alert>

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
                Về trang chủ
              </Button>
              <Button
                component={Link}
                to="/profile"
                variant="outlined"
                startIcon={<ReceiptLongOutlinedIcon />}
                fullWidth
              >
                Xem đơn hàng
              </Button>
              <Button
                component={Link}
                to="/cart"
                variant="outlined"
                startIcon={<ShoppingCartOutlinedIcon />}
                fullWidth
              >
                Về giỏ hàng
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}

export default PaymentResult;
