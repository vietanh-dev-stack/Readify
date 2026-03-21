import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Grid, Paper, CircularProgress } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';
import axiosCustomize from '../../api/axiosCustomize';
import { useNavigate } from 'react-router-dom';

const CategoryCard = ({ category, onClick }) => (
  <Paper
    elevation={0}
    onClick={onClick}
    sx={{
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
      border: '1px solid',
      borderColor: 'grey.200',
      borderRadius: 4,
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      bgcolor: '#fff',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        opacity: 0,
        transition: 'opacity 0.4s ease',
        zIndex: 0
      },
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 15px 30px -5px rgba(37, 99, 235, 0.2)',
        borderColor: 'transparent',
        '&::before': { opacity: 1 },
        '& .category-icon': {
          bgcolor: 'rgba(255,255,255,0.2)',
          color: '#fff',
          transform: 'scale(1.15) rotate(5deg)'
        },
        '& .category-name': {
          color: '#fff'
        }
      }
    }}
  >
    <Box 
      className="category-icon"
      sx={{ 
        p: 2, 
        borderRadius: '50%', 
        bgcolor: 'rgba(59, 130, 246, 0.1)', 
        color: '#3b82f6',
        display: 'flex',
        position: 'relative',
        zIndex: 1,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <MenuBookIcon fontSize="large" />
    </Box>
    <Typography 
      className="category-name"
      variant="subtitle1" 
      fontWeight={700} 
      align="center" 
      sx={{ color: 'text.primary', position: 'relative', zIndex: 1, transition: 'color 0.4s ease' }}
    >
      {category.name}
    </Typography>
  </Paper>
);

const CategoryHighlights = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosCustomize.get('/cate');
        setCategories(response.data?.slice(0, 8) || []);
      } catch (error) {
        console.error('Failed to load categories', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <Box sx={{ py: 8, bgcolor: '#fafafa' }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <AutoAwesomeMosaicIcon color="primary" />
          <Typography variant="h4" component="h2" sx={{ fontWeight: 800, textAlign: 'center' }}>
            Danh Mục Nổi Bật
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {categories.map(cate => (
              <Grid item xs={6} sm={4} md={3} lg={1.5} key={cate._id}>
                <CategoryCard 
                  category={cate} 
                  onClick={() => navigate(`/categories?categoryId=${cate._id}`)} 
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default CategoryHighlights;
