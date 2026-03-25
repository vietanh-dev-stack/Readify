import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Button,
  TextField, InputAdornment, Chip, MenuItem, Select,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert
} from '@mui/material';

import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon
} from '@mui/icons-material';

import TiptapEditor from '../../components/admin/TiptapEditor';

import {
  createBlog,
  uploadBlog,
  deleteBlog,
  fetchBlogAdmin
} from '../../services/blog.service';

const BlogManagement = () => {

  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [open, setOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'draft',
    image: null,
    preview: null
  });

  const [success, setSuccess] = useState('');

  const loadBlogs = async () => {
    const res = await fetchBlogAdmin();
    setBlogs(res.data || []);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadBlogs();
  }, []);

  const handleOpen = (blog = null) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title,
        content: blog.content,
        status: blog.status,
        image: null,
        preview: blog.thumbnail // giữ ảnh cũ
      });
    } else {
      setEditingBlog(null);
      setFormData({
        title: '',
        content: '',
        status: 'draft',
        image: null,
        preview: null
      });
    }
    setOpen(true);
  };

  const handleSubmit = async () => {
    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    data.append('status', formData.status);

    if (formData.image) {
      data.append('image', formData.image);
    }

    console.log(formData.image)

    if (editingBlog) {
      await uploadBlog(editingBlog._id, data);
      setSuccess('Cập nhật blog thành công');
    } else {
      await createBlog(data);
      setSuccess('Tạo blog thành công');
    }

    setOpen(false);
    loadBlogs();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa blog?')) return;
    await deleteBlog(id);
    setSuccess('Xóa thành công');
    loadBlogs();
  };

  const filteredBlogs = blogs.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === 'all' || b.status === statusFilter)
  );

  return (
    <Box>

      {/* HEADER */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" fontWeight={800}>
          Quản lý Blog
        </Typography>

        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => handleOpen()}
        >
          Tạo Blog
        </Button>
      </Box>

      {/* FILTER */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            placeholder="Tìm blog..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="published">Đã xuất bản</MenuItem>
            <MenuItem value="draft">Bản nháp</MenuItem>
          </Select>
        </Box>
      </Paper>

      {/* TABLE */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ảnh</TableCell>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Tác giả</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredBlogs.map(blog => (
              <TableRow key={blog._id}>
                <TableCell>
                  {blog.thumbnail && (
                    <Box
                      component="img"
                      src={blog.thumbnail}
                      sx={{
                        width: 70,
                        height: 50,
                        objectFit: 'cover',
                        borderRadius: 1
                      }}
                    />
                  )}
                </TableCell>

                <TableCell>{blog.title}</TableCell>
                <TableCell>{blog.userId?.username}</TableCell>

                <TableCell>
                  {blog.status === 'published'
                    ? <Chip label="Đã xuất bản" color="success" />
                    : <Chip label="Bản nháp" color="warning" />}
                </TableCell>

                <TableCell>
                  {new Date(blog.createdAt).toLocaleDateString()}
                </TableCell>

                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(blog)}>
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    color="error"
                    onClick={() => handleDelete(blog._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>

      {/* DIALOG */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>
          {editingBlog ? 'Cập nhật Blog' : 'Tạo Blog'}
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>

            {/* PREVIEW IMAGE */}
            {formData.preview && (
              <Box
                component="img"
                src={formData.preview}
                sx={{
                  width: '100%',
                  height: 200,
                  objectFit: 'cover',
                  borderRadius: 2
                }}
              />
            )}

            {/* UPLOAD */}
            <Button component="label" variant="outlined">
              Upload Thumbnail
              <input
                hidden
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setFormData(prev => ({
                      ...prev,
                      image: file,
                      preview: URL.createObjectURL(file)
                    }));
                  }
                }}
              />
            </Button>

            {/* TITLE */}
            <TextField
              label="Tiêu đề"
              value={formData.title}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, title: e.target.value }))
              }
            />

            {/* CONTENT */}
            <Typography fontWeight={600}>Nội dung</Typography>

            <TiptapEditor
              content={formData.content}
              onChange={(value) =>
                setFormData(prev => ({ ...prev, content: value }))
              }
            />

            {/* STATUS */}
            <Select
              value={formData.status}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, status: e.target.value }))
              }
            >
              <MenuItem value="draft">Bản nháp</MenuItem>
              <MenuItem value="published">Xuất bản</MenuItem>
            </Select>

          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingBlog ? 'Cập nhật' : 'Tạo'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR */}
      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={() => setSuccess('')}
      >
        <Alert severity="success">{success}</Alert>
      </Snackbar>

    </Box>
  );
};

export default BlogManagement;