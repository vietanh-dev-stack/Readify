import React from 'react';
import {
  Grid, Paper, Typography, Box, Card, CardContent,
  Avatar, Chip, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, LinearProgress, useTheme, IconButton, Button
} from '@mui/material';
import {
  People as PeopleIcon,
  AutoStories as BookIcon,
  ShoppingCart as OrderIcon,
  TrendingUp as SalesIcon,
  TrendingDown as TrendingDownIcon,
  MoreVert as MoreVertIcon,
  FiberManualRecord as FiberManualRecordIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';

// Mock Data
const stats = [
  { title: 'Người dùng mới', value: '1,284', icon: <PeopleIcon />, color: '#6366F1', trend: '+12.5%', isUp: true },
  { title: 'Sách trong kho', value: '452', icon: <BookIcon />, color: '#10B981', trend: '+5.2%', isUp: true },
  { title: 'Đơn hàng tháng', value: '86', icon: <OrderIcon />, color: '#F59E0B', trend: '+18.2%', isUp: true },
  { title: 'Doanh thu (VNĐ)', value: '12.45M', icon: <SalesIcon />, color: '#8B5CF6', trend: '+24.1%', isUp: true },
];

const revenueData = [
  { name: 'T1', revenue: 4000 },
  { name: 'T2', revenue: 3000 },
  { name: 'T3', revenue: 5000 },
  { name: 'T4', revenue: 4500 },
  { name: 'T5', revenue: 6000 },
  { name: 'T6', revenue: 5500 },
  { name: 'T7', revenue: 7500 },
];

const recentOrders = [
  { id: '#ORD-7234', customer: 'Nguyễn Văn A', amount: '1,250,000 ₫', status: 'Hoàn thành', date: '2 giờ trước' },
  { id: '#ORD-7235', customer: 'Trần Thị B', amount: '450,000 ₫', status: 'Chờ xử lý', date: '5 giờ trước' },
  { id: '#ORD-7236', customer: 'Lê Văn C', amount: '890,000 ₫', status: 'Đang giao', date: '1 ngày trước' },
  { id: '#ORD-7237', customer: 'Phạm Minh D', amount: '2,100,000 ₫', status: 'Đã hủy', date: '1 ngày trước' },
  { id: '#ORD-7238', customer: 'Hoàng Anh E', amount: '670,000 ₫', status: 'Hoàn thành', date: '2 ngày trước' },
];

const topBooks = [
  { title: 'Đắc Nhân Tâm', author: 'Dale Carnegie', sales: 124, stock: 45, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=100' },
  { title: 'Nhà Giả Kim', author: 'Paulo Coelho', sales: 98, stock: 12, image: 'https://images.unsplash.com/photo-1543003923-380af366432b?auto=format&fit=crop&q=80&w=100' },
  { title: 'Sapiens', author: 'Yuval Noah Harari', sales: 86, stock: 28, image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=100' },
  { title: 'Lược Sử Thời Gian', author: 'Stephen Hawking', sales: 72, stock: 15, image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=100' },
];

const StatCard = ({ title, value, icon, color, trend, isUp }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: 4,
      bgcolor: 'white',
      border: '1px solid',
      borderColor: 'divider',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 24px -10px rgba(0,0,0,0.1)',
        borderColor: color
      }
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
      <Avatar
        sx={{
          bgcolor: `${color}15`,
          color: color,
          borderRadius: 2.5,
          width: 44,
          height: 44,
          fontSize: '1.25rem'
        }}
      >
        {icon}
      </Avatar>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        px: 1,
        py: 0.5,
        borderRadius: 1.5,
        bgcolor: isUp ? 'success.light' : 'error.light',
        color: isUp ? 'success.dark' : 'error.dark',
        opacity: 0.8
      }}>
        <Typography variant="caption" sx={{ fontWeight: 700 }}>{trend}</Typography>
      </Box>
    </Box>
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
        {value}
      </Typography>
    </Box>
  </Paper>
);

const Dashboard = () => {
  const theme = useTheme();

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.5, letterSpacing: '-0.03em' }}>
            Tổng quan hệ thống
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Theo dõi hiệu suất kinh doanh và quản lý dữ liệu hôm nay.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<SalesIcon />}
          sx={{ borderRadius: 2, px: 3, py: 1, fontWeight: 700 }}
        >
          Xuất báo cáo
        </Button>
      </Box>

      {/* Row 1: Stat Cards */}
      
      {/* Row 2: Charts and Top Lists */}

      {/* Row 3: Full-width Recent Orders Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>Đơn hàng gần đây</Typography>
          <Button variant="outlined" size="small" sx={{ borderRadius: 2 }}>Toàn bộ đơn hàng</Button>
        </Box>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: '#f9fafb' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', borderBottom: 'none' }}>ID ĐƠN HÀNG</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', borderBottom: 'none' }}>KHÁCH HÀNG</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', borderBottom: 'none' }}>SỐ TIỀN</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', borderBottom: 'none' }}>THỜI GIAN</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', borderBottom: 'none' }}>TRẠNG THÁI</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                  <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>{order.id}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{order.customer}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{order.amount}</TableCell>
                  <TableCell color="text.secondary">{order.date}</TableCell>
                  <TableCell>
                    <StatusChip status={order.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

// Sub-components for cleaner code
const SelectDate = () => (
  <Box sx={{ display: 'flex', gap: 1 }}>
    <Chip label="Theo tuần" size="small" clickable variant="outlined" sx={{ borderRadius: 1.5, fontWeight: 600 }} />
    <Chip label="Theo tháng" size="small" clickable color="primary" sx={{ borderRadius: 1.5, fontWeight: 600 }} />
  </Box>
);

const StatusChip = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'Hoàn thành': return { color: '#059669', bg: '#ecfdf5', label: 'Hoàn thành' };
      case 'Chờ xử lý': return { color: '#d97706', bg: '#fffbeb', label: 'Chờ xử lý' };
      case 'Đang giao': return { color: '#2563eb', bg: '#eff6ff', label: 'Đang giao' };
      case 'Đã hủy': return { color: '#dc2626', bg: '#fef2f2', label: 'Đã hủy' };
      default: return { color: '#64748b', bg: '#f8fafc', label: status };
    }
  };
  const style = getStyles();
  return (
    <Chip
      label={style.label}
      size="small"
      sx={{
        bgcolor: style.bg,
        color: style.color,
        fontWeight: 800,
        borderRadius: 1.5,
        fontSize: '0.75rem'
      }}
    />
  );
};

export default Dashboard;
