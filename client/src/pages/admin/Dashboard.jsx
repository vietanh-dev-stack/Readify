import React from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent, CardHeader, IconButton } from '@mui/material';
import { People as PeopleIcon, MenuBook as BookIcon, ShoppingCart as OrderIcon, TrendingUp as SalesIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';

const StatCard = ({ title, value, icon, color, trend }) => (
  <Card sx={{ height: '100%', borderRadius: 4, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>
            {value}
          </Typography>
          {trend && (
            <Typography variant="body2" sx={{ mt: 1, color: trend.startsWith('+') ? 'success.main' : 'error.main', fontWeight: 600 }}>
              {trend} <Box component="span" sx={{ color: 'text.secondary', fontWeight: 400 }}>from last month</Box>
            </Typography>
          )}
        </Box>
        <Box sx={{ 
          p: 1.5, 
          borderRadius: 3, 
          bgcolor: `${color}.light`, 
          color: `${color}.main`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const stats = [
    { title: 'Total Users', value: '1,284', icon: <PeopleIcon />, color: 'primary', trend: '+12.5%' },
    { title: 'Total Books', value: '452', icon: <BookIcon />, color: 'success', trend: '+5.2%' },
    { title: 'New Orders', value: '86', icon: <OrderIcon />, color: 'warning', trend: '+18.2%' },
    { title: 'Total Revenue', value: '$12,450', icon: <SalesIcon />, color: 'info', trend: '+24.1%' },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 4, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="text.secondary">Sales Analytics Chart Placeholder</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 4, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="text.secondary">Recent Orders List Placeholder</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
