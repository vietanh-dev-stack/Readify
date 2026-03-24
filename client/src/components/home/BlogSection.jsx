import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, Button, Chip } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PsychologyIcon from '@mui/icons-material/Psychology';

const blogPosts = [
  {
    id: 1,
    title: "10 Cuốn Sách Phát Triển Bản Thân",
    excerpt: "Những cuốn sách giúp bạn thay đổi tư duy và phát triển bản thân toàn diện.",
    icon: <PsychologyIcon />
  },
  {
    id: 2,
    title: "Review Đắc Nhân Tâm",
    excerpt: "Cuốn sách kinh điển về nghệ thuật giao tiếp và ứng xử trong cuộc sống.",
    icon: <MenuBookIcon />
  },
  {
    id: 3,
    title: "Văn học vs Trinh thám",
    excerpt: "So sánh hai thể loại sách phổ biến và khám phá phong cách đọc của bạn.",
    icon: <AutoStoriesIcon />
  },
  {
    id: 4,
    title: "Xu hướng đọc sách 2026",
    excerpt: "Những xu hướng đọc sách mới nhất trong cộng đồng yêu sách hiện đại.",
    icon: <MenuBookIcon />
  }
];

const BlogSection = () => {
  return (
    <Box sx={{ py: 10}}>
      <Container maxWidth="lg">

        {/* Header giống 100% hình */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Chip
            label="BLOG"
            sx={{
              mb: 2,
              background: '#3b82f6',
              color: '#fff',
              fontWeight: 600,
              borderRadius: '999px'
            }}
          />

          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
            Khám Phá Kiến Thức Từ Blog
          </Typography>

          <Typography sx={{ color: '#6b7280', maxWidth: 600, mx: 'auto' }}>
            Những bài viết hay về sách, kỹ năng và xu hướng giúp bạn phát triển bản thân
          </Typography>
        </Box>

        {/* Grid giống feature card */}
        <Grid container spacing={4}>
          {blogPosts.map((post) => (
            <Grid item xs={12} sm={6} md={3} key={post.id}>
              <Card
                sx={{
                  borderRadius: 4,
                  p: 3,
                  height: '100%',
                  transition: 'all 0.3s',
                  border: '1px solid #e5e7eb',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.08)'
                  }
                }}
              >
                <CardContent sx={{ p: 0 }}>

                  {/* Icon */}
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: 2,
                      background: '#3b82f6',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2
                    }}
                  >
                    {post.icon}
                  </Box>

                  {/* Title */}
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {post.title}
                  </Typography>

                  {/* Description */}
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    {post.excerpt}
                  </Typography>

                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* CTA */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            endIcon={<ArrowForwardIcon />}
            sx={{
              color: '#3b82f6',
              fontWeight: 600,
              textTransform: 'none'
            }}
          >
            Xem tất cả bài viết
          </Button>
        </Box>

      </Container>
    </Box>
  );
};

export default BlogSection;
