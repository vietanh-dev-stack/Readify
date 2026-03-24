import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Grid, Card,
  CardMedia, CardContent, TextField, InputAdornment
} from '@mui/material';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { fetchBlogs } from '../../services/blog.service';

const Blog = () => {

  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchBlogs()

        const sorted = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )

        setBlogs(sorted)
      } catch (error) {
        console.log(error);
      }
    }
    fetchData()
  }, [])

  const [search, setSearch] = useState('')

  const filteredSearch = blogs.filter(b => {
    return b.title.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>

      {/* HERO */}
      <Box
        sx={{
          mb: 5,
          borderRadius: 4,
          overflow: 'hidden',
          position: 'relative',
          height: 300,
          backgroundImage: 'url(https://picsum.photos/1200/400)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            px: 5
          }}
        >
          <Box>
            <Typography variant="h3" sx={{ color: '#fff', fontWeight: 900 }}>
              Blog Sách 📚
            </Typography>
            <Typography sx={{ color: '#e2e8f0', mt: 1 }}>
              Chia sẻ kiến thức, review và cảm hứng đọc sách
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* BLOG LIST */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: '1fr 1fr 1fr'
          },
          gap: 3
        }}
      >
        {blogs.map(post => (
          <Grid
            item
            xs={4}
            key={post._id}
            sx={{ display: 'flex' }}
          >
            <Card
              component={Link}
              to={`/blog/${post._id}`}
              sx={{
                width: '100%',
                borderRadius: 3,
                overflow: 'hidden',
                textDecoration: 'none',
                boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
                transition: '0.3s',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.12)'
                }
              }}
            >
              <CardMedia
                component="img"
                image={post.thumbnail || 'https://via.placeholder.com/800x500'}
                sx={{
                  width: '100%',
                  height: 200,
                  objectFit: 'cover'
                }}
              />

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {post.title}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {post.userId?.username || 'Ẩn danh'}
                </Typography>

                <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>
                  {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Box>

      {/* SIDEBAR */}
      <Box sx={{ mt: 6 }}>

        {/* SEARCH */}
        <Box sx={{ mb: 4, maxWidth: 400 }}>
          <TextField
            fullWidth
            placeholder="Tìm bài viết..."
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>

        {/* LATEST POSTS */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
            Bài viết mới
          </Typography>

          {filteredSearch.slice(0, 5).map(p => (
            <Box key={p._id} sx={{ mb: 2 }}>
              <Typography
                component={Link}
                to={`/blog/${p._id}`}
                sx={{
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'block',
                  color: 'text.primary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                {p.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(p.createdAt).toLocaleDateString('vi-VN')}
              </Typography>
            </Box>
          ))}
        </Box>

      </Box>

    </Container>
  );
};

export default Blog;