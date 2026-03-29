import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Typography, Button, Paper, Stack, Container } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const MomoMock = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  // URL backend
  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

  const handleAction = (resultCode) => {
    // Redirect to backend mock webhook endpoint
    window.location.href = `${backendUrl}/payment/momo-mock-return?orderId=${orderId}&resultCode=${resultCode}`;
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 4, border: '2px dashed #A50064' }}>
        <Box sx={{ mb: 4 }}>
          <Box 
            component="img" 
            src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" 
            alt="MoMo Mock" 
            sx={{ width: 80, height: 80, mb: 2 }} 
          />
          <Typography variant="h5" fontWeight={800} color="#A50064" gutterBottom>
            MoMo Sandbox (MOCK)
          </Typography>
          <Typography color="text.secondary">
            Môi trường giả lập dùng để test luồng thanh toán
          </Typography>
        </Box>

        <Stack spacing={2} sx={{ mb: 4, bgcolor: 'grey.50', p: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography color="text.secondary">Mã đơn hàng:</Typography>
            <Typography fontWeight={700}>{orderId}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography color="text.secondary">Số tiền thanh toán:</Typography>
            <Typography fontWeight={800} color="error.main">
              {Number(amount).toLocaleString('vi-VN')} đ
            </Typography>
          </Box>
        </Stack>

        <Stack spacing={2}>
          <Button 
            variant="contained" 
            color="success" 
            size="large"
            startIcon={<CheckCircleOutlineIcon />}
            onClick={() => handleAction(0)} // resultCode 0 = success
            sx={{ py: 1.5, fontWeight: 700 }}
          >
            Giả lập Thanh Toán Thành Công
          </Button>
          <Button 
            variant="outlined" 
            color="error" 
            size="large"
            startIcon={<HighlightOffIcon />}
            onClick={() => handleAction(1006)} // resultCode !0 = failed
            sx={{ py: 1.5, fontWeight: 700 }}
          >
            Giả lập Giao Dịch Thất Bại
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default MomoMock;
