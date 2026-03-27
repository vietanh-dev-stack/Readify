import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Refresh as RefreshIcon, Search as SearchIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { getAdminOrderById, getAdminOrders, updateAdminOrderStatus } from '../../services/order.service';

const STATUS_OPTIONS = ['pending', 'paid', 'shipping', 'completed', 'cancelled'];
const PAYMENT_STATUS_OPTIONS = ['pending', 'paid', 'failed'];
const PAYMENT_METHOD_OPTIONS = ['cod', 'momo', 'vnpay'];

const statusColorMap = {
  pending: 'warning',
  paid: 'info',
  shipping: 'secondary',
  completed: 'success',
  cancelled: 'error',
};

const paymentStatusColorMap = {
  pending: 'warning',
  paid: 'success',
  failed: 'error',
};

const formatCurrency = (value) => `${Number(value || 0).toLocaleString('vi-VN')} đ`;

const formatDateTime = (value) => {
  if (!value) return '--';
  return new Date(value).toLocaleString('vi-VN');
};

const getCustomerName = (order) =>
  order?.userId?.fullName || order?.userId?.username || order?.shippingAddress?.name || '--';

const getCustomerEmail = (order) => order?.userId?.email || '--';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, total: 0 });
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: '',
    paymentStatus: '',
    paymentMethod: '',
  });
  const [loading, setLoading] = useState(true);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [statusDraft, setStatusDraft] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchOrders = async (page = pagination.page) => {
    try {
      setLoading(true);
      const response = await getAdminOrders({
        page,
        limit: pagination.limit,
        status: filters.status || undefined,
        paymentStatus: filters.paymentStatus || undefined,
        paymentMethod: filters.paymentMethod || undefined,
      });

      setOrders(response?.data?.data || []);
      setPagination((prev) => ({
        ...prev,
        page: response?.data?.pagination?.page || page,
        limit: response?.data?.pagination?.limit || prev.limit,
        totalPages: response?.data?.pagination?.totalPages || 1,
        total: response?.data?.pagination?.total || 0,
      }));
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, [filters.status, filters.paymentStatus, filters.paymentMethod]);

  const filteredOrders = useMemo(() => {
    const keyword = filters.searchTerm.trim().toLowerCase();

    if (!keyword) return orders;

    return orders.filter((order) => {
      const customerName = getCustomerName(order).toLowerCase();
      const customerEmail = getCustomerEmail(order).toLowerCase();
      const orderId = order?._id?.toLowerCase() || '';

      return (
        customerName.includes(keyword) ||
        customerEmail.includes(keyword) ||
        orderId.includes(keyword)
      );
    });
  }, [orders, filters.searchTerm]);

  const handleOpenDetail = async (orderId) => {
    try {
      setDetailOpen(true);
      setDetailLoading(true);
      const response = await getAdminOrderById(orderId);
      const detail = response?.data?.data;
      setSelectedOrder(detail?.order || null);
      setSelectedItems(detail?.items || []);
      setStatusDraft(detail?.order?.status || '');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Không thể tải chi tiết đơn hàng');
      setDetailOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedOrder(null);
    setSelectedItems([]);
    setStatusDraft('');
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder?._id || !statusDraft || statusDraft === selectedOrder.status) {
      return;
    }

    try {
      setUpdatingStatus(true);
      const response = await updateAdminOrderStatus(selectedOrder._id, { status: statusDraft });
      const updatedOrder = response?.data?.data;

      setSelectedOrder(updatedOrder);
      setOrders((prev) => prev.map((order) => (order._id === updatedOrder._id ? { ...order, ...updatedOrder } : order)));
      toast.success(response?.data?.message || 'Cập nhật trạng thái đơn hàng thành công');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Không thể cập nhật trạng thái đơn hàng');
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Quản lý đơn hàng
        </Typography>
        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => fetchOrders()}>
          Tải lại
        </Button>
      </Box>

      <Paper sx={{ p: 3, borderRadius: 4, mb: 4 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr 1fr' }, gap: 2 }}>
          <TextField
            fullWidth
            placeholder="Tìm theo mã đơn, tên khách hàng, email..."
            value={filters.searchTerm}
            onChange={(event) => setFilters((prev) => ({ ...prev, searchTerm: event.target.value }))}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <FormControl fullWidth>
            <InputLabel id="order-status-filter-label">Trạng thái đơn</InputLabel>
            <Select
              labelId="order-status-filter-label"
              value={filters.status}
              label="Trạng thái đơn"
              onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {STATUS_OPTIONS.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="payment-status-filter-label">Thanh toán</InputLabel>
            <Select
              labelId="payment-status-filter-label"
              value={filters.paymentStatus}
              label="Thanh toán"
              onChange={(event) => setFilters((prev) => ({ ...prev, paymentStatus: event.target.value }))}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {PAYMENT_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="payment-method-filter-label">Phương thức</InputLabel>
            <Select
              labelId="payment-method-filter-label"
              value={filters.paymentMethod}
              label="Phương thức"
              onChange={(event) => setFilters((prev) => ({ ...prev, paymentMethod: event.target.value }))}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {PAYMENT_METHOD_OPTIONS.map((method) => (
                <MenuItem key={method} value={method}>
                  {method.toUpperCase()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
        <Table sx={{ minWidth: 900 }}>
          <TableHead sx={{ bgcolor: 'grey.50' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Mã đơn</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Khách hàng</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Tổng tiền</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Thanh toán</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Ngày tạo</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={28} />
                </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Không có đơn hàng nào
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order._id} hover>
                  <TableCell>{order._id}</TableCell>
                  <TableCell>
                    <Stack spacing={0.5}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {getCustomerName(order)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {getCustomerEmail(order)}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{formatCurrency(order.finalPrice)}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      <Chip label={order.paymentMethod?.toUpperCase() || '--'} size="small" variant="outlined" />
                      <Chip
                        label={order.paymentStatus || '--'}
                        size="small"
                        color={paymentStatusColorMap[order.paymentStatus] || 'default'}
                      />
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip label={order.status} size="small" color={statusColorMap[order.status] || 'default'} />
                  </TableCell>
                  <TableCell>{formatDateTime(order.createdAt)}</TableCell>
                  <TableCell align="right">
                    <Button variant="contained" size="small" onClick={() => handleOpenDetail(order._id)}>
                      Chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Tổng đơn hàng: {pagination.total}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            disabled={pagination.page <= 1 || loading}
            onClick={() => fetchOrders(pagination.page - 1)}
          >
            Trang trước
          </Button>
          <Button variant="text" disabled>
            Trang {pagination.page}/{pagination.totalPages || 1}
          </Button>
          <Button
            variant="outlined"
            disabled={pagination.page >= pagination.totalPages || loading}
            onClick={() => fetchOrders(pagination.page + 1)}
          >
            Trang sau
          </Button>
        </Stack>
      </Box>

      <Dialog open={detailOpen} onClose={handleCloseDetail} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: 700 }}>Chi tiết đơn hàng</DialogTitle>
        <DialogContent dividers>
          {detailLoading ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <CircularProgress />
            </Box>
          ) : selectedOrder ? (
            <Stack spacing={3}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
                    Thông tin đơn hàng
                  </Typography>
                  <Stack spacing={1}>
                    <Typography><strong>Mã đơn:</strong> {selectedOrder._id}</Typography>
                    <Typography><strong>Khách hàng:</strong> {getCustomerName(selectedOrder)}</Typography>
                    <Typography><strong>Email:</strong> {getCustomerEmail(selectedOrder)}</Typography>
                    <Typography><strong>Ngày tạo:</strong> {formatDateTime(selectedOrder.createdAt)}</Typography>
                    <Typography><strong>Tổng tiền:</strong> {formatCurrency(selectedOrder.finalPrice)}</Typography>
                  </Stack>
                </Paper>

                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
                    Giao hàng & thanh toán
                  </Typography>
                  <Stack spacing={1}>
                    <Typography><strong>Người nhận:</strong> {selectedOrder.shippingAddress?.name || '--'}</Typography>
                    <Typography><strong>Số điện thoại:</strong> {selectedOrder.shippingAddress?.phone || '--'}</Typography>
                    <Typography>
                      <strong>Địa chỉ:</strong>{' '}
                      {[
                        selectedOrder.shippingAddress?.fullAddress,
                        selectedOrder.shippingAddress?.ward,
                        selectedOrder.shippingAddress?.district,
                        selectedOrder.shippingAddress?.province,
                        selectedOrder.shippingAddress?.city,
                      ]
                        .filter(Boolean)
                        .join(', ') || '--'}
                    </Typography>
                    <Typography><strong>Phương thức:</strong> {selectedOrder.paymentMethod?.toUpperCase() || '--'}</Typography>
                    <Typography><strong>Mã giao dịch:</strong> {selectedOrder.paymentRef || '--'}</Typography>
                  </Stack>
                </Paper>
              </Box>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }}>
                <Chip label={`Trạng thái đơn: ${selectedOrder.status}`} color={statusColorMap[selectedOrder.status] || 'default'} />
                <Chip
                  label={`Thanh toán: ${selectedOrder.paymentStatus}`}
                  color={paymentStatusColorMap[selectedOrder.paymentStatus] || 'default'}
                  variant="outlined"
                />
                <FormControl sx={{ minWidth: 220 }}>
                  <InputLabel id="update-order-status-label">Cập nhật trạng thái</InputLabel>
                  <Select
                    labelId="update-order-status-label"
                    value={statusDraft}
                    label="Cập nhật trạng thái"
                    onChange={(event) => setStatusDraft(event.target.value)}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  onClick={handleUpdateStatus}
                  disabled={updatingStatus || !statusDraft || statusDraft === selectedOrder.status}
                >
                  {updatingStatus ? 'Đang cập nhật...' : 'Lưu trạng thái'}
                </Button>
              </Stack>

              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
                  Sản phẩm trong đơn
                </Typography>
                <Stack spacing={1.5}>
                  {selectedItems.length === 0 ? (
                    <Alert severity="info">Không có sản phẩm nào trong đơn hàng.</Alert>
                  ) : (
                    selectedItems.map((item) => (
                      <Paper key={item._id} variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                          <Box>
                            <Typography sx={{ fontWeight: 700 }}>{item.title}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Số lượng: {item.quantity}
                            </Typography>
                          </Box>
                          <Typography sx={{ fontWeight: 700 }}>{formatCurrency(item.price * item.quantity)}</Typography>
                        </Box>
                      </Paper>
                    ))
                  )}
                </Stack>
              </Box>
            </Stack>
          ) : (
            <Alert severity="error">Không tìm thấy chi tiết đơn hàng.</Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDetail}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderManagement;
