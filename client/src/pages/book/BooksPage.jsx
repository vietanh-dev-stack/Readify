import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Drawer,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';

import BookCard from '../../components/book/BookCard';
import FilterSidebar from '../../components/book/FilterSidebar';
import {
  mockBooks,
  priceBounds,
  getFilterOptions,
  defaultFilterState
} from './booksMockData';

const groupLabels = {
  categories: 'Thể loại',
  authors: 'Tác giả',
  series: 'Bộ sách',
  publishers: 'Nhà xuất bản'
};

const BooksPage = () => {
  const [filters, setFilters] = useState(() => defaultFilterState(priceBounds));
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const options = useMemo(() => getFilterOptions(mockBooks), []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 450);

    return () => window.clearTimeout(timer);
  }, []);

  const handleSearchChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      search: value
    }));
  };

  const handleToggleGroupValue = (group, value) => {
    setFilters((prev) => {
      const currentValues = prev[group] || [];
      const exists = currentValues.includes(value);

      return {
        ...prev,
        [group]: exists
          ? currentValues.filter((item) => item !== value)
          : [...currentValues, value]
      };
    });
  };

  const handlePriceChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: value
    }));
  };

  const handleRatingChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      rating: value
    }));
  };

  const handleClearAll = () => {
    setFilters(defaultFilterState(priceBounds));
  };

  const filteredBooks = useMemo(() => {
    const keyword = filters.search.trim().toLowerCase();

    return mockBooks.filter((book) => {
      const matchesSearch =
        !keyword ||
        book.title.toLowerCase().includes(keyword) ||
        book.author.toLowerCase().includes(keyword);

      const effectivePrice = typeof book.discountPrice === 'number' ? book.discountPrice : book.price;
      const matchesPrice =
        effectivePrice >= filters.priceRange[0] &&
        effectivePrice <= filters.priceRange[1];

      const matchesRating = filters.rating === null || book.rating >= filters.rating;

      const matchesCategories =
        filters.categories.length === 0 || filters.categories.includes(book.category);

      const matchesAuthors =
        filters.authors.length === 0 || filters.authors.includes(book.author);

      const matchesSeries =
        filters.series.length === 0 || filters.series.includes(book.series);

      const matchesPublishers =
        filters.publishers.length === 0 || filters.publishers.includes(book.publisher);

      return (
        matchesSearch &&
        matchesPrice &&
        matchesRating &&
        matchesCategories &&
        matchesAuthors &&
        matchesSeries &&
        matchesPublishers
      );
    });
  }, [filters]);

  const activeFilterChips = useMemo(() => {
    const chips = [];

    Object.entries(groupLabels).forEach(([groupKey, label]) => {
      filters[groupKey].forEach((value) => {
        chips.push({
          key: `${groupKey}-${value}`,
          label: `${label}: ${value}`,
          onDelete: () => handleToggleGroupValue(groupKey, value)
        });
      });
    });

    if (filters.rating !== null) {
      chips.push({
        key: 'rating',
        label: `Từ ${filters.rating} sao`,
        onDelete: () => handleRatingChange(null)
      });
    }

    return chips;
  }, [filters]);

  const renderSkeletons = () => (
    <Grid container spacing={3}>
      {Array.from({ length: 8 }).map((_, index) => (
        <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'grey.200',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)'
            }}
          >
            <Skeleton variant="rounded" height={220} sx={{ borderRadius: 3, mb: 2 }} />
            <Skeleton variant="text" height={34} width="85%" />
            <Skeleton variant="text" height={26} width="60%" />
            <Skeleton variant="text" height={28} width="50%" sx={{ mt: 1 }} />
            <Skeleton variant="rounded" height={42} sx={{ borderRadius: 999, mt: 2 }} />
          </Paper>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Box
            sx={{
              background: 'linear-gradient(135deg, rgba(30,58,138,0.06) 0%, rgba(234,179,8,0.08) 100%)',
              borderRadius: 5,
              p: { xs: 3, md: 4 },
              border: '1px solid',
              borderColor: 'rgba(30,58,138,0.08)'
            }}
          >
            <Stack spacing={2}>
              <Typography
                variant="overline"
                sx={{ color: '#1e3a8a', fontWeight: 800, letterSpacing: 1.2 }}
              >
                Bộ sưu tập mới
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  color: '#0f172a',
                  fontWeight: 800,
                  fontSize: { xs: '1.8rem', md: '2.5rem' }
                }}
              >
                Sách mới về tại Readify
              </Typography>

              <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 780 }}>
                Khám phá những đầu sách nổi bật thuộc nhiều thể loại, dễ dàng lọc theo tác giả,
                bộ sách, nhà xuất bản và mức giá phù hợp với bạn.
              </Typography>
            </Stack>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 3 }} sx={{ display: { xs: 'none', lg: 'block' } }}>
              <Box sx={{ position: 'sticky', top: 104 }}>
                <FilterSidebar
                  filters={filters}
                  options={options}
                  priceBounds={priceBounds}
                  onSearchChange={handleSearchChange}
                  onToggleGroupValue={handleToggleGroupValue}
                  onPriceChange={handlePriceChange}
                  onRatingChange={handleRatingChange}
                  onClearAll={handleClearAll}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, lg: 9 }}>
              {isLoading ? (
                renderSkeletons()
              ) : filteredBooks.length > 0 ? (
                <Grid container spacing={3}>
                  {filteredBooks.map((book) => (
                    <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={book.id}>
                      <BookCard book={book} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 4, md: 6 },
                    textAlign: 'center',
                    borderRadius: 4,
                    border: '1px dashed',
                    borderColor: 'grey.300',
                    backgroundColor: '#fff'
                  }}
                >
                  <Typography variant="h6" sx={{ color: '#0f172a', fontWeight: 800, mb: 1 }}>
                    Không tìm thấy sách phù hợp
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
                    Hãy thử thay đổi từ khóa tìm kiếm hoặc nới lỏng một vài bộ lọc để xem thêm kết quả.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleClearAll}
                    sx={{
                      borderRadius: 999,
                      px: 3,
                      py: 1.25,
                      textTransform: 'none',
                      fontWeight: 700,
                      backgroundColor: '#1e3a8a',
                      '&:hover': {
                        backgroundColor: '#172554'
                      }
                    }}
                  >
                    Đặt lại bộ lọc
                  </Button>
                </Paper>
              )}
            </Grid>
          </Grid>
        </Stack>
      </Container>

      <Drawer
        anchor="right"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: 380,
            backgroundColor: '#f8fafc'
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
              Bộ lọc tìm kiếm
            </Typography>
            <IconButton onClick={() => setMobileDrawerOpen(false)}>
              <CloseRoundedIcon />
            </IconButton>
          </Stack>

          <FilterSidebar
            filters={filters}
            options={options}
            priceBounds={priceBounds}
            onSearchChange={handleSearchChange}
            onToggleGroupValue={handleToggleGroupValue}
            onPriceChange={handlePriceChange}
            onRatingChange={handleRatingChange}
            onClearAll={handleClearAll}
            mobile
          />
        </Box>
      </Drawer>
    </Box>
  );
};

export default BooksPage;