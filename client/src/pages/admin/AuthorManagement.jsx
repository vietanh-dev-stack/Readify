import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button, TextField, InputAdornment, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Snackbar } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, Add as AddIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { fetchAuthors, createAuthor, updateAuthor, deleteAuthor } from '../../services/author.service';

const AuthorManagement = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog state
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', bio: '' });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadAuthors = async () => {
    setLoading(true);
    try {
      const response = await fetchAuthors();
      setAuthors(response.data || []);
    } catch (error) {
      console.error('Failed to fetch authors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuthors();
  }, []);

  const handleOpen = (author = null) => {
    if (author) {
      setEditingId(author._id);
      setFormData({ name: author.name, bio: author.bio || '' });
      setPreviewUrl(author.avatar || '');
    } else {
      setEditingId(null);
      setFormData({ name: '', bio: '' });
      setPreviewUrl('');
    }
    setImageFile(null);
    setOpen(true);
    setError('');
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError('Tên tác giả không được để trống');
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('bio', formData.bio);
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      if (editingId) {
        await updateAuthor(editingId, data);
        setSuccess('Cập nhật tác giả thành công!');
      } else {
        await createAuthor(data);
        setSuccess('Thêm tác giả thành công!');
      }
      handleClose();
      loadAuthors();
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tác giả này?')) {
      try {
        await deleteAuthor(id);
        setSuccess('Xóa tác giả thành công!');
        loadAuthors();
      } catch (err) {
        alert(err.response?.data?.message || 'Có lỗi xảy ra khi xóa tác giả');
      }
    }
  };

  const filteredAuthors = authors.filter(author => 
    author.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Quản lý tác giả</Typography>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ borderRadius: 2 }} onClick={() => handleOpen()}>
          Thêm tác giả mới
        </Button>
      </Box>

      <Paper sx={{ p: 2, borderRadius: 4, mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm tác giả..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'grey.50' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Tác giả</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Tiểu sử</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={3} align="center">Đang tải dữ liệu...</TableCell></TableRow>
            ) : filteredAuthors.map((author) => (
              <TableRow key={author._id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={author.avatar}>{author.name?.charAt(0)}</Avatar>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{author.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{author.bio?.substring(0, 50)}...</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" size="small" onClick={() => handleOpen(author)}><EditIcon /></IconButton>
                  <IconButton color="error" size="small" onClick={() => handleDelete(author._id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Author Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 800, pt: 3 }}>
          {editingId ? 'Cập nhật tác giả' : 'Thêm tác giả mới'}
        </DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Avatar 
                src={previewUrl} 
                sx={{ width: 100, height: 100, border: '2px solid', borderColor: 'divider' }}
              >
                {formData.name?.charAt(0)}
              </Avatar>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                size="small"
                sx={{ borderRadius: 3 }}
              >
                Tải ảnh đại diện
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
              </Button>
            </Box>

            <TextField
              label="Tên tác giả"
              name="name"
              fullWidth
              variant="outlined"
              value={formData.name}
              onChange={handleChange}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              autoFocus
            />
            <TextField
              label="Tiểu sử"
              name="bio"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={formData.bio}
              onChange={handleChange}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleClose} sx={{ color: 'grey.500', fontWeight: 600 }}>Hủy</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            sx={{ borderRadius: 3, px: 4, fontWeight: 700 }}
          >
            {editingId ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar 
        open={!!success} 
        autoHideDuration={6000} 
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%', borderRadius: 2 }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AuthorManagement;
