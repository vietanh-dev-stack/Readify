import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Skeleton } from '@mui/material';
import { fetchBooks } from '../../services/book.service';

import HeroSlider from '../../components/home/HeroSlider';
import CategoryHighlights from '../../components/home/CategoryHighlights';
import BookSection from '../../components/home/BookSection';
import PromoBanner from '../../components/home/PromoBanner';
import Testimonials from '../../components/home/Testimonials';
import BlogSection from '../../components/home/BlogSection';
import FadeInSection from '../../components/common/FadeInSection';

const HomeSkeleton = () => (
  <Box sx={{ width: '100%', pb: 10 }}>
    <Skeleton variant="rectangular" width="100%" height={500} sx={{ borderRadius: { xs: 0, md: 5 }, mb: 8, mt: { xs: 0, md: 4 } }} />
    <Container maxWidth="xl">
      <Box sx={{ mb: 8 }}>
        <Skeleton variant="text" width="30%" height={60} sx={{ mx: 'auto', mb: 4 }} />
        <Grid container spacing={3} justifyContent="center">
          {[1,2,3,4,5,6,7,8].map(i => (
            <Grid item xs={6} sm={4} md={3} lg={1.5} key={i}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 4 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 4, mb: 8 }} />
      <Box sx={{ mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Skeleton variant="text" width="20%" height={50} />
          <Skeleton variant="text" width="10%" height={40} />
        </Box>
        <Grid container spacing={3}>
          {[1,2,3,4,5].map(i => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={i}>
              <Skeleton variant="rectangular" height={350} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  </Box>
);

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchBooks();
        setBooks(response.data || []);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      } finally {
        // Small artificial delay to show off the premium skeleton smoothly if network is too fast
        setTimeout(() => setLoading(false), 800);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <HomeSkeleton />;
  }

  // Client-side distribution
  const newArrivals = [...books].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 10);
  const bestSellers = [...books].reverse().slice(0, 10); 

  return (
    <Box>
      <FadeInSection>
        <HeroSlider />
      </FadeInSection>
      
      <FadeInSection delay={0.1}>
        <CategoryHighlights />
      </FadeInSection>
      
      <FadeInSection delay={0.2}>
        <div id="flash-sale">
          <PromoBanner />
        </div>
      </FadeInSection>
      
      <FadeInSection delay={0.1}>
        <div id="featured-books">
          <BookSection 
            title="Sách bán chạy hàng đầu" 
            subtitle="Những đầu sách được độc giả săn đón nhất tuần này"
            books={bestSellers} 
            exploreLink="/best-sellers"
          />
        </div>
      </FadeInSection>

      <FadeInSection delay={0.1}>
        <BookSection 
          title="Sách mới cập nhật" 
          subtitle="Khám phá những kiệt tác vừa mới xuất bản"
          books={newArrivals} 
          exploreLink="/new-arrivals"
        />
      </FadeInSection>


      <FadeInSection delay={0.1}>
        <BlogSection />
      </FadeInSection>
      
      <FadeInSection delay={0.1}>
        <Testimonials />
      </FadeInSection>
    </Box>
  );
};

export default Home;