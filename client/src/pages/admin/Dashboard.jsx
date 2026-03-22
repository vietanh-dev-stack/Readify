import React from 'react';
import {
  Grid, Paper, Typography, Box, Card, CardContent,
  Avatar, Chip, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, LinearProgress, useTheme, IconButton, Button
} from '@mui/material';
import {
  People as PeopleIcon,
  MenuBook as BookIcon,
  ShoppingCart as OrderIcon,
  TrendingUp as SalesIcon,
  TrendingDown as TrendingDownIcon,
  MoreVert as MoreVertIcon,
  FiberManualRecord as FiberManualRecordIcon
} from '@mui/icons-material';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';

// Mock Data
const stats = [
  { title: 'Tổng người dùng', value: '1,284', icon: <PeopleIcon />, color: '#4F46E5', trend: '+12.5%', isUp: true },
  { title: 'Tổng sản phẩm', value: '452', icon: <BookIcon />, color: '#10B981', trend: '+5.2%', isUp: true },
  { title: 'Đơn hàng mới', value: '86', icon: <OrderIcon />, color: '#F59E0B', trend: '+18.2%', isUp: true },
  { title: 'Tổng doanh thu', value: '12.45M ₫', icon: <SalesIcon />, color: '#8B5CF6', trend: '+24.1%', isUp: true },
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
  { id: '#ORD-7234', customer: 'Nguyễn Văn A', amount: '1,250,000 ₫', status: 'Completed', date: '2 giờ trước' },
  { id: '#ORD-7235', customer: 'Trần Thị B', amount: '450,000 ₫', status: 'Pending', date: '5 giờ trước' },
  { id: '#ORD-7236', customer: 'Lê Văn C', amount: '890,000 ₫', status: 'Shipping', date: '1 ngày trước' },
  { id: '#ORD-7237', customer: 'Phạm Minh D', amount: '2,100,000 ₫', status: 'Cancelled', date: '1 ngày trước' },
  { id: '#ORD-7238', customer: 'Hoàng Anh E', amount: '670,000 ₫', status: 'Completed', date: '2 ngày trước' },
];

const topBooks = [
  { title: 'Đắc Nhân Tâm', author: 'Dale Carnegie', sales: 124, stock: 45, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=100' },
  { title: 'Nhà Giả Kim', author: 'Paulo Coelho', sales: 98, stock: 12, image: 'https://images.unsplash.com/photo-1543003923-380af366432b?auto=format&fit=crop&q=80&w=100' },
  { title: 'Sapiens', author: 'Yuval Noah Harari', sales: 86, stock: 28, image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=100' },
];

const StatCard = ({ title, value, icon, color, trend, isUp }) => (
  <Card sx={{
    borderRadius: 5,
    boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 30px 0 rgba(0,0,0,0.1)'
    }
  }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Avatar sx={{ bgcolor: `${color}15`, color: color, borderRadius: 3, width: 48, height: 48 }}>
          {icon}
        </Avatar>
        <Box sx={{ textAlign: 'right' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', color: isUp ? 'success.main' : 'error.main' }}>
            {isUp ? <SalesIcon fontSize="small" sx={{ mr: 0.5 }} /> : <TrendingDownIcon fontSize="small" sx={{ mr: 0.5 }} />}
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{trend}</Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">so với tháng trước</Typography>
        </Box>
      </Box>
      <Box>
        <Typography color="text.secondary" variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          {value}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const theme = useTheme();

  return (
    <Box sx={{ width: '100%', flex: 1, pb: 4, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>Dashboard</Typography>
          <Typography variant="body2" color="text.secondary">Chào mừng bạn trở lại! Đây là thống kê mới nhất của hôm nay.</Typography>
        </Box>
        <IconButton sx={{ bgcolor: 'background.paper', boxShadow: 1 }}>
          <MoreVertIcon />
        </IconButton>
      </Box>

      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} lg={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Main Chart Section */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, borderRadius: 5, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)', height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Phân tích doanh thu</Typography>
              <Chip label="2024" size="small" variant="outlined" sx={{ borderRadius: 1 }} />
            </Box>
            <Box sx={{ height: 350, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke={theme.palette.primary.main}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Top Books Section */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, borderRadius: 5, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)', height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Sách bán chạy</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {topBooks.map((book, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar src={book.image} variant="rounded" sx={{ width: 60, height: 60, borderRadius: 2 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{book.title}</Typography>
                    <Typography variant="caption" color="text.secondary">{book.author}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(book.sales / 150) * 100}
                        sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: '#F3F4F6' }}
                      />
                      <Typography variant="caption" sx={{ ml: 1, fontWeight: 700 }}>{book.sales}</Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
            <Button fullWidth variant="outlined" sx={{ mt: 4, borderRadius: 3 }}>
              Xem tất cả sản phẩm
            </Button>
          </Paper>
        </Grid>

        {/* Recent Orders Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 0, borderRadius: 5, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Đơn hàng gần đây</Typography>
              <Button size="small">Xem tất cả</Button>
            </Box>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ bgcolor: '#F9FAFB' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>ID Đơn hàng</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Khách hàng</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Số tiền</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Thời gian</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Trạng thái</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell sx={{ fontWeight: 600 }}>{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{order.amount}</TableCell>
                      <TableCell color="text.secondary">{order.date}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.status}
                          size="small"
                          icon={<FiberManualRecordIcon sx={{ fontSize: '10px !important' }} />}
                          sx={{
                            borderRadius: '6px',
                            fontWeight: 700,
                            bgcolor:
                              order.status === 'Completed' ? '#DEF7EC' :
                                order.status === 'Pending' ? '#FEF3C7' :
                                  order.status === 'Shipping' ? '#E1EFFE' : '#FDE8E8',
                            color:
                              order.status === 'Completed' ? '#03543F' :
                                order.status === 'Pending' ? '#92400E' :
                                  order.status === 'Shipping' ? '#1E429F' : '#9B1C1C',
                            '& .MuiChip-icon': { color: 'inherit' }
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
