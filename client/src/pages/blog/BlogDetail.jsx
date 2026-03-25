import React, { useEffect, useState } from 'react'
import {
  Box, Container, Typography, Avatar, Grid, Divider
} from '@mui/material'
import { useParams, Link } from 'react-router-dom'
import { fetchBlogById, fetchBlogs } from '../../services/blog.service'

const BlogDetail = () => {

  const { id } = useParams()

  const [blog, setBlog] = useState(null)
  const [related, setRelated] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchBlogById(id)
        setBlog(res.data)

        const list = await fetchBlogs()
        const relatedPosts = list.data
          .filter(b => b._id !== id)
          .slice(0, 4)

        setRelated(relatedPosts)

      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [id])

  if (!blog) return <p>Loading...</p>

  return (
    <Box>

      {/* HERO */}
      <Box
        sx={{
          height: { xs: 250, md: 400 },
          backgroundImage: `url(${blog.thumbnail || 'https://picsum.photos/1200/600'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'flex-end',
            p: 5
          }}
        >
          <Box>
            <Typography
              variant="h3"
              sx={{ color: '#fff', fontWeight: 800 }}
            >
              {blog.title}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Avatar sx={{ mr: 1 }}>
                {blog.userId?.username?.charAt(0)}
              </Avatar>
              <Typography sx={{ color: '#e2e8f0' }}>
                {blog.userId?.username || 'Ẩn danh'} • {new Date(blog.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* CONTENT */}
      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Grid container spacing={5}>

          {/* MAIN CONTENT */}
          <Grid item xs={12} md={8}>

            <Box
              sx={{
                '& img': {
                  width: '100%',
                  borderRadius: 3,
                  my: 2
                },
                '& h2': {
                  fontWeight: 800,
                  mt: 4
                },
                '& p': {
                  lineHeight: 1.8,
                  fontSize: 16,
                  color: '#374151'
                },
                '& blockquote': {
                  borderLeft: '4px solid #1976d2',
                  pl: 2,
                  color: '#555',
                  fontStyle: 'italic'
                },
                '& pre': {
                  background: '#111',
                  color: '#fff',
                  padding: 16,
                  borderRadius: 8,
                  overflowX: 'auto'
                }
              }}
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

          </Grid>

          {/* SIDEBAR */}
          <Grid item xs={12} md={4}>

            <Box sx={{ position: 'sticky', top: 100 }}>

              {/* AUTHOR */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" fontWeight={700}>
                  Tác giả
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <Avatar sx={{ mr: 2 }}>
                    {blog.userId?.username?.charAt(0)}
                  </Avatar>

                  <Box>
                    <Typography fontWeight={600}>
                      {blog.userId?.username}
                    </Typography>
                    <Typography variant="caption">
                      Content Writer
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* RELATED */}
              <Box>
                <Typography variant="h6" fontWeight={700} mb={2}>
                  Bài viết liên quan
                </Typography>

                {related.map(item => (
                  <Box key={item._id} sx={{ mb: 2 }}>
                    <Typography
                      component={Link}
                      to={`/blog/${item._id}`}
                      sx={{
                        fontWeight: 600,
                        textDecoration: 'none',
                        color: '#111',
                        marginRight: '10px',
                        '&:hover': { color: 'primary.main' }
                      }}
                    >
                      {item.title}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                ))}
              </Box>

            </Box>

          </Grid>

        </Grid>
      </Container>

    </Box>
  )
}

export default BlogDetail