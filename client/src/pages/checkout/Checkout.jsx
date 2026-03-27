import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useCartStore from '../../store/useCartStore';
import { getAddresses, createAddress } from '../../services/address.service';
import { createOrder } from '../../services/order.service';
import { createPayment } from '../../services/payment.service';

const initialAddressForm = {
  name: '',
  phone: '',
  province: '',
  district: '',
  ward: '',
  street: '',
  isDefault: false,
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, fetchCart, clearCart, loading: cartLoading } = useCartStore();

  const [addresses, setAddresses] = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState(initialAddressForm);
  const [creatingAddress, setCreatingAddress] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [couponCode, setCouponCode] = useState('');
  const [submittingOrder, setSubmittingOrder] = useState(false);

  const loadAddresses = async () => {
    setAddressLoading(true);
    setAddressError('');

    try {
      const response = await getAddresses();
      const addressList = response?.data?.data || response?.data || [];
      setAddresses(Array.isArray(addressList) ? addressList : []);

      const defaultAddress = Array.isArray(addressList)
        ? addressList.find((address) => address.isDefault) || addressList[0]
        : null;

      if (defaultAddress?._id) {
        setSelectedAddressId(defaultAddress._id);
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Không thể tải danh sách địa chỉ.';
      setAddressError(message);
    } finally {
      setAddressLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    loadAddresses();
  }, [fetchCart]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const price = item.bookId?.discountPrice || item.bookId?.price || 0;
      return sum + price * item.quantity;
    }, 0);
  }, [cartItems]);

  const totalItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const handleAddressInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCreateAddress = async () => {
    const requiredFields = ['name', 'phone', 'province', 'district', 'ward', 'street'];
    const hasEmptyField = requiredFields.some((field) => !newAddress[field]?.trim());

    if (hasEmptyField) {
      toast.error('Vui lòng điền đầy đủ thông tin địa chỉ.');
      return;
    }

    setCreatingAddress(true);

    try {
      const response = await createAddress({
        ...newAddress,
        name: newAddress.name.trim(),
        phone: newAddress.phone.trim(),
        province: newAddress.province.trim(),
        district: newAddress.district.trim(),
        ward: newAddress.ward.trim(),
        street: newAddress.street.trim(),
      });

      const createdAddress = response?.data?.data || response?.data;

      if (createdAddress?._id) {
        setAddresses((prev) => {
          if (newAddress.isDefault) {
            return prev.map((address) => ({ ...address, isDefault: false })).concat(createdAddress);
          }

          return [...prev, createdAddress];
        });
        setSelectedAddressId(createdAddress._id);
        setShowNewAddressForm(false);
        setNewAddress(initialAddressForm);
        toast.success('Đã thêm địa chỉ mới.');
      } else {
        await loadAddresses();
        toast.success('Đã thêm địa chỉ mới.');
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Không thể tạo địa chỉ mới.';
      toast.error(message);
    } finally {
      setCreatingAddress(false);
    }
  };

  const handleSubmitOrder = async () => {
    if (cartItems.length === 0) {
      toast.error('Giỏ hàng của bạn đang trống.');
      return;
    }

    if (!selectedAddressId) {
      toast.error('Vui lòng chọn hoặc thêm địa chỉ nhận hàng.');
      return;
    }

    setSubmittingOrder(true);

    try {
      const payload = {
        addressId: selectedAddressId,
        paymentMethod,
      };

      if (couponCode.trim()) {
        payload.couponCode = couponCode.trim();
      }

      const orderResponse = await createOrder(payload);
      const order = orderResponse?.data?.data;

      if (!order?._id) {
        throw new Error('Không nhận được thông tin đơn hàng.');
      }

      if (paymentMethod === 'cod') {
        toast.success(orderResponse?.data?.message || 'Đặt hàng thành công.');
        clearCart();
        navigate(`/payment-result?status=success&orderId=${order._id}`);
        return;
      }

      const paymentResponse = await createPayment(order._id);
      const paymentUrl = paymentResponse?.data?.paymentUrl;
      const paymentMessage = paymentResponse?.data?.message;

      if (paymentUrl) {
        clearCart();
        window.location.href = paymentUrl;
        return;
      }

      toast.success(paymentMessage || 'Đơn hàng đã được tạo thành công.');
      clearCart();
      navigate(`/payment-result?status=success&orderId=${order._id}&message=${encodeURIComponent(paymentMessage || '')}`);
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Không thể hoàn tất thanh toán.';
      toast.error(message);
    } finally {
      setSubmittingOrder(false);
    }
  };

  if (cartLoading && cartItems.length === 0) {
    return (
      <Box sx={{ py: 10, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Đang tải thông tin thanh toán...</Typography>
      </Box>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant="h4" gutterBottom fontWeight={800}>
          Giỏ hàng của bạn đang trống
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Hãy thêm sản phẩm vào giỏ trước khi tiến hành thanh toán.
        </Typography>
        <Button variant="contained" component={Link} to="/" size="large">
          Tiếp tục mua sắm
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h3" component="h1" gutterBottom fontWeight={800} mb={4}>
        Thanh toán
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.6fr 1fr' }, gap: 4 }}>
        <Stack spacing={3}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
              <Typography variant="h6" fontWeight={700}>
                Địa chỉ nhận hàng
              </Typography>
              <Button
                variant={showNewAddressForm ? 'outlined' : 'contained'}
                onClick={() => setShowNewAddressForm((prev) => !prev)}
              >
                {showNewAddressForm ? 'Ẩn biểu mẫu' : 'Thêm địa chỉ mới'}
              </Button>
            </Box>

            {addressError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {addressError}
              </Alert>
            )}

            {addressLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CircularProgress size={24} />
                <Typography>Đang tải địa chỉ...</Typography>
              </Box>
            ) : addresses.length > 0 ? (
              <FormControl fullWidth>
                <RadioGroup value={selectedAddressId} onChange={(event) => setSelectedAddressId(event.target.value)}>
                  <Stack spacing={2}>
                    {addresses.map((address) => (
                      <Paper
                        key={address._id}
                        elevation={0}
                        sx={{
                          p: 2,
                          border: '1px solid',
                          borderColor: selectedAddressId === address._id ? 'primary.main' : 'divider',
                          borderRadius: 2,
                        }}
                      >
                        <FormControlLabel
                          value={address._id}
                          control={<Radio />}
                          sx={{ alignItems: 'flex-start', m: 0, width: '100%' }}
                          label={
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                <Typography fontWeight={700}>{address.name}</Typography>
                                <Typography color="text.secondary">{address.phone}</Typography>
                                {address.isDefault && (
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      px: 1,
                                      py: 0.25,
                                      borderRadius: 1,
                                      bgcolor: 'primary.50',
                                      color: 'primary.main',
                                      fontWeight: 700,
                                    }}
                                  >
                                    Mặc định
                                  </Typography>
                                )}
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                {[address.street, address.ward, address.district, address.province].filter(Boolean).join(', ')}
                              </Typography>
                            </Box>
                          }
                        />
                      </Paper>
                    ))}
                  </Stack>
                </RadioGroup>
              </FormControl>
            ) : (
              <Alert severity="info">Bạn chưa có địa chỉ nào. Vui lòng thêm địa chỉ mới để tiếp tục.</Alert>
            )}

            {showNewAddressForm && (
              <Box sx={{ mt: 3 }}>
                <Divider sx={{ mb: 3 }} />
                <Typography variant="subtitle1" fontWeight={700} mb={2}>
                  Tạo địa chỉ mới
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <TextField label="Họ và tên" name="name" value={newAddress.name} onChange={handleAddressInputChange} fullWidth />
                  <TextField label="Số điện thoại" name="phone" value={newAddress.phone} onChange={handleAddressInputChange} fullWidth />
                  <TextField label="Tỉnh / Thành phố" name="province" value={newAddress.province} onChange={handleAddressInputChange} fullWidth />
                  <TextField label="Quận / Huyện" name="district" value={newAddress.district} onChange={handleAddressInputChange} fullWidth />
                  <TextField label="Phường / Xã" name="ward" value={newAddress.ward} onChange={handleAddressInputChange} fullWidth />
                  <TextField label="Số nhà, tên đường" name="street" value={newAddress.street} onChange={handleAddressInputChange} fullWidth />
                </Box>

                <FormControlLabel
                  sx={{ mt: 2 }}
                  control={<Checkbox name="isDefault" checked={newAddress.isDefault} onChange={handleAddressInputChange} />}
                  label="Đặt làm địa chỉ mặc định"
                />

                <Button
                  variant="contained"
                  onClick={handleCreateAddress}
                  disabled={creatingAddress}
                  sx={{ mt: 2 }}
                >
                  {creatingAddress ? 'Đang lưu...' : 'Lưu địa chỉ'}
                </Button>
              </Box>
            )}
          </Paper>

          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Phương thức thanh toán
            </Typography>

            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1 }}>Chọn phương thức</FormLabel>
              <RadioGroup value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
                <Stack spacing={1}>
                  <FormControlLabel value="cod" control={<Radio />} label="Thanh toán khi nhận hàng (COD)" />
                  <FormControlLabel value="momo" control={<Radio />} label="Ví MoMo" />
                  <FormControlLabel value="vnpay" control={<Radio />} label="VNPay" />
                </Stack>
              </RadioGroup>
            </FormControl>

            <TextField
              label="Mã giảm giá (không bắt buộc)"
              value={couponCode}
              onChange={(event) => setCouponCode(event.target.value)}
              fullWidth
              sx={{ mt: 3 }}
            />
          </Paper>
        </Stack>

        <Box>
          <Paper elevation={0} sx={{ p: 4, bgcolor: 'grey.50', borderRadius: 3, position: 'sticky', top: 100 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom mb={3}>
              Tóm tắt đơn hàng
            </Typography>

            <Stack spacing={2.5}>
              {cartItems.map((item) => {
                const book = item.bookId || {};
                const unitPrice = book.discountPrice || book.price || 0;

                return (
                  <Box key={book._id || book.title} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Box
                      component="img"
                      src={book.coverImage || book.cover}
                      alt={book.title}
                      sx={{ width: 64, height: 88, objectFit: 'cover', borderRadius: 1.5, bgcolor: 'grey.200' }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography fontWeight={700}>{book.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        SL: {item.quantity}
                      </Typography>
                    </Box>
                    <Typography fontWeight={700}>
                      {(unitPrice * item.quantity).toLocaleString('vi-VN')} đ
                    </Typography>
                  </Box>
                );
              })}
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography color="text.secondary">Số lượng sản phẩm</Typography>
              <Typography fontWeight={600}>{totalItems}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography color="text.secondary">Tạm tính</Typography>
              <Typography fontWeight={700}>{subtotal.toLocaleString('vi-VN')} đ</Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
              <Typography variant="h6" fontWeight={800}>
                Tổng cộng
              </Typography>
              <Typography variant="h5" fontWeight={800} color="primary">
                {subtotal.toLocaleString('vi-VN')} đ
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleSubmitOrder}
              disabled={submittingOrder || creatingAddress}
              sx={{ py: 1.5, borderRadius: 2, fontWeight: 700 }}
            >
              {submittingOrder ? 'Đang xử lý...' : 'Đặt hàng'}
            </Button>

            <Button variant="outlined" component={Link} to="/cart" fullWidth sx={{ mt: 2, py: 1.5, borderRadius: 2 }}>
              Quay lại giỏ hàng
            </Button>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Checkout;