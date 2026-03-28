import React, { useEffect, useMemo, useState } from 'react';
import { Box, Container, Grid, Skeleton, Stack } from '@mui/material';
import { fetchBooks } from '../../services/book.service';

import HeroSlider from '../../components/home/HeroSlider';
import CategoryHighlights from '../../components/home/CategoryHighlights';
import BookSection from '../../components/home/BookSection';
import PromoBanner from '../../components/home/PromoBanner';
import Testimonials from '../../components/home/Testimonials';
import BlogSection from '../../components/home/BlogSection';
import FadeInSection from '../../components/common/FadeInSection';

const getBookNumericValue = (book, keys = []) => {
  for (const key of keys) {
    const value = book?.[key];

    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === 'string') {
      const parsed = Number(String(value).replace(/[^\d.-]/g, ''));
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return 0;
};

const getBookDateValue = (book) => {
  const candidates = [book?.createdAt, book?.publishedAt, book?.updatedAt, book?.releaseDate];

  for (const item of candidates) {
    if (!item) continue;
    const time = new Date(item).getTime();
    if (Number.isFinite(time)) {
      return time;
    }
  }

  return 0;
};

const dedupeBooks = (items = []) => {
  const seen = new Set();

  return items.filter((book) => {
    const id = book?._id || book?.id || `${book?.title || ''}-${book?.author || ''}`;
    if (!id || seen.has(id)) {
      return false;
    }
    seen.add(id);
    return true;
  });
};

const sectionGradients = [
  'linear-gradient(180deg, rgba(248,250,255,0.9) 0%, rgba(255,255,255,1) 100%)',
  'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(245,247,255,0.95) 100%)',
  'linear-gradient(180deg, rgba(244,247,255,0.9) 0%, rgba(255,255,255,1) 100%)',
];

const HomeSkeleton = () => (
  <Box sx={{ width: '100%', bgcolor: '#f8fafc', pb: { xs: 8, md: 12 } }}>
    <Box sx={{ px: { xs: 0, md: 3 }, pt: { xs: 0, md: 3 }, mb: { xs: 5, md: 8 } }}>
      <Skeleton
        variant="rectangular"
        width="100%"
        height={560}
        sx={{
          borderRadius: { xs: 0, md: 6 },
          bgcolor: 'rgba(99, 102, 241, 0.12)',
        }}
      />
    </Box>

    <Container maxWidth="xl">
      <Stack spacing={{ xs: 6, md: 8 }}>
        <Box>
          <Stack spacing={1.5} sx={{ mb: 4, alignItems: 'center' }}>
            <Skeleton variant="text" width="28%" height={28} sx={{ maxWidth: 180 }} />
            <Skeleton variant="text" width="42%" height={56} sx={{ maxWidth: 420 }} />
          </Stack>
          <Grid container spacing={3}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Grid item xs={6} sm={4} md={4} lg={2} key={index}>
                <Skeleton
                  variant="rectangular"
                  height={150}
                  sx={{
                    borderRadius: 4,
                    bgcolor: 'rgba(148, 163, 184, 0.14)',
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 3 }}>
            <Box sx={{ width: '100%', maxWidth: 440 }}>
              <Skeleton variant="text" width="34%" height={26} />
              <Skeleton variant="text" width="72%" height={50} />
              <Skeleton variant="text" width="86%" height={28} />
            </Box>
            <Skeleton variant="rounded" width={132} height={40} sx={{ display: { xs: 'none', sm: 'block' } }} />
          </Stack>
          <Grid container spacing={3}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                <Skeleton
                  variant="rectangular"
                  height={390}
                  sx={{
                    borderRadius: 4,
                    bgcolor: 'rgba(99, 102, 241, 0.1)',
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Skeleton
          variant="rectangular"
          width="100%"
          height={280}
          sx={{
            borderRadius: 5,
            bgcolor: 'rgba(245, 158, 11, 0.12)',
          }}
        />

        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 3 }}>
            <Box sx={{ width: '100%', maxWidth: 440 }}>
              <Skeleton variant="text" width="30%" height={26} />
              <Skeleton variant="text" width="64%" height={50} />
              <Skeleton variant="text" width="82%" height={28} />
            </Box>
            <Skeleton variant="rounded" width={132} height={40} sx={{ display: { xs: 'none', sm: 'block' } }} />
          </Stack>
          <Grid container spacing={3}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                <Skeleton
                  variant="rectangular"
                  height={390}
                  sx={{
                    borderRadius: 4,
                    bgcolor: 'rgba(148, 163, 184, 0.14)',
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Grid container spacing={3}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Skeleton
                variant="rectangular"
                height={240}
                sx={{
                  borderRadius: 4,
                  bgcolor: 'rgba(99, 102, 241, 0.08)',
                }}
              />
            </Grid>
          ))}
        </Grid>

        <Skeleton
          variant="rectangular"
          width="100%"
          height={260}
          sx={{
            borderRadius: 5,
            bgcolor: 'rgba(148, 163, 184, 0.14)',
          }}
        />
      </Stack>
    </Container>
  </Box>
);

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        const response = await fetchBooks();
        const incomingBooks = Array.isArray(response?.data) ? response.data : [];
        if (active) {
          setBooks(incomingBooks);
        }
      } catch (error) {
        console.error('Failed to fetch books:', error);
        if (active) {
          setBooks([]);
        }
      } finally {
        if (active) {
          setTimeout(() => {
            if (active) {
              setLoading(false);
            }
          }, 700);
        }
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, []);

  const { trendingBooks, newArrivals } = useMemo(() => {
    const normalizedBooks = dedupeBooks(Array.isArray(books) ? books.filter(Boolean) : []);

    const featured = [...normalizedBooks]
      .sort((a, b) => {
        const featuredScoreA =
          getBookNumericValue(a, ['featuredScore', 'rating', 'averageRating']) * 4 +
          getBookNumericValue(a, ['sold', 'soldCount', 'salesCount', 'totalSales', 'stockSold']) +
          getBookNumericValue(a, ['discountPercentage', 'discount']);
        const featuredScoreB =
          getBookNumericValue(b, ['featuredScore', 'rating', 'averageRating']) * 4 +
          getBookNumericValue(b, ['sold', 'soldCount', 'salesCount', 'totalSales', 'stockSold']) +
          getBookNumericValue(b, ['discountPercentage', 'discount']);

        return featuredScoreB - featuredScoreA || getBookDateValue(b) - getBookDateValue(a);
      })
      .slice(0, 10);

    const trending = [...normalizedBooks]
      .sort((a, b) => {
        const trendingScoreA =
          getBookNumericValue(a, ['sold', 'soldCount', 'salesCount', 'totalSales', 'stockSold']) * 1.4 +
          getBookNumericValue(a, ['rating', 'averageRating', 'reviewsAverage']) * 12 +
          getBookNumericValue(a, ['reviewsCount', 'reviewCount']) * 0.8;
        const trendingScoreB =
          getBookNumericValue(b, ['sold', 'soldCount', 'salesCount', 'totalSales', 'stockSold']) * 1.4 +
          getBookNumericValue(b, ['rating', 'averageRating', 'reviewsAverage']) * 12 +
          getBookNumericValue(b, ['reviewsCount', 'reviewCount']) * 0.8;

        return trendingScoreB - trendingScoreA || getBookDateValue(b) - getBookDateValue(a);
      })
      .slice(0, 10);

    const arrivals = [...normalizedBooks]
      .sort((a, b) => getBookDateValue(b) - getBookDateValue(a))
      .slice(0, 10);

    return {
      featuredBooks: featured.length ? featured : normalizedBooks.slice(0, 10),
      trendingBooks: trending.length ? trending : [...normalizedBooks].reverse().slice(0, 10),
      newArrivals: arrivals.length ? arrivals : normalizedBooks.slice(0, 10),
    };
  }, [books]);

  if (loading) {
    return <HomeSkeleton />;
  }

  return (
    <Box sx={{ bgcolor: '#f8fafc', pb: { xs: 6, md: 10 } }}>
      <FadeInSection>
        <HeroSlider />
      </FadeInSection>

      <Box sx={{ background: sectionGradients[0] }}>
        <FadeInSection delay={0.08}>
          <CategoryHighlights />
        </FadeInSection>
      </Box>

      <Box sx={{ background: sectionGradients[2] }}>
        <FadeInSection delay={0.16}>
          <BookSection
            title="Xu hướng & bán chạy"
            subtitle="Các tựa sách đang được độc giả yêu thích nhất, nổi bật bởi đánh giá tốt và sức mua cao."
            books={trendingBooks}
            exploreLink="/best-sellers"
            exploreText="Xem best sellers"
          />
        </FadeInSection>
      </Box>

      <FadeInSection delay={0.2}>
        <div id="flash-sale">
          <PromoBanner />
        </div>
      </FadeInSection>

      <Box sx={{ background: sectionGradients[0] }}>
        <FadeInSection delay={0.24}>
          <BookSection
            title="Sách mới cập nhật"
            subtitle="Cập nhật nhanh những đầu sách mới phát hành để bạn luôn bắt kịp cảm hứng đọc tiếp theo."
            books={newArrivals}
            exploreLink="/new-arrivals"
            exploreText="Xem sách mới"
          />
        </FadeInSection>
      </Box>

      <FadeInSection delay={0.28}>
        <BlogSection />
      </FadeInSection>
    </Box>
  );
};

export default Home;