import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  CardActionArea,
  CardMedia
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { fetchBlogs } from '../../services/blog.service';

const BlogSection = () => {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    const fectData = async () => {
      try {
        const response = await fetchBlogs()
        setBlogs(response.data)
      } catch (error) {
        console.log(error);
      }
    }
    fectData()
  }, [])

  const cleanText = (text) => {
    return text
      ?.replace(/<[^>]+>/g, '')  // 🔥 xoá HTML tag
      ?.replace(/\\n/g, ' ')     // xoá \n
      ?.replace(/\s+/g, ' ')     // gộp khoảng trắng
      ?.trim();
  };

  return (
    <Box sx={{ py: 10 }}>
      <Container maxWidth="lg">

        {/* HEADER */}
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

        {/* GRID 2 COLUMN */}
        <Grid container spacing={4}>
          {blogs
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 4)
            .map((post) => (
              <Grid
                item
                xs={12}
                md={6}
                key={post._id}
                sx={{
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <Card
                  sx={{
                    display: 'flex',
                    width: '100%',
                    maxWidth: 520,
                    height: 200,
                    borderRadius: 4,
                    overflow: 'hidden',
                    border: '1px solid #e5e7eb',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.08)'
                    }
                  }}
                >
                  <CardActionArea
                    onClick={() => navigate(`/blog/${post._id}`)}
                    sx={{ display: 'flex', alignItems: 'stretch' }}
                  >

                    <CardMedia
                      component="img"
                      image={post.thumbnail}
                      alt={post.title}
                      sx={{
                        width: 180,
                        objectFit: 'cover'
                      }}
                    />

                    {/* CONTENT */}
                    <CardContent
                      sx={{
                        flex: 1,
                        p: 2
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          mb: 1,
                          fontSize: 18,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden"
                        }}
                      >
                        {post.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          fontSize: 14,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden"
                        }}
                      >
                        {cleanText(post.content)}
                      </Typography>

                      <Typography
                        sx={{
                          mt: 1,
                          color: '#3b82f6',
                          fontWeight: 600,
                          fontSize: 14
                        }}
                      >
                        Đọc thêm →
                      </Typography>
                    </CardContent>

                  </CardActionArea>
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
            onClick={() => navigate('/blog')}
          >
            Xem tất cả bài viết
          </Button>
        </Box>

      </Container>
    </Box>
  );
};

export default BlogSection;