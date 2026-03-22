import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button, TextField, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Snackbar } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../../services/category.service';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialog state
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetchCategories()
      setCategories(response.data?.categories || [])
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, []);

  const handleOpen = (category = null) => {
    if (category) {
      setEditingId(category._id);
      setNewCategory({ name: category.name, description: category.description || '' });
    } else {
      setEditingId(null);
      setNewCategory({ name: '', description: '' });
    }
    setOpen(true);
    setError('');
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!newCategory.name.trim()) {
      setError('Tên danh mục không được để trống');
      return;
    }

    try {
      if (editingId) {
        await updateCategory(editingId, newCategory);
        setSuccess('Cập nhật danh mục thành công!');
      } else {
        await createCategory(newCategory);
        setSuccess('Thêm danh mục thành công!');
      }
      handleClose();
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      try {
        await deleteCategory(id);
        setSuccess('Xóa danh mục thành công!');
        fetchData();
      } catch (err) {
        console.log(err);
        setSuccess(''); // Clear any previous success message
        alert(err.response?.data?.message || 'Có lỗi xảy ra khi xóa danh mục');
      }
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Quản lý danh mục</Typography>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ borderRadius: 2 }} onClick={handleOpen}>
          Thêm danh mục mới
        </Button>
      </Box>

      <Paper sx={{ p: 2, borderRadius: 4, mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm danh mục..."
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
              <TableCell sx={{ fontWeight: 700 }}>Tên danh mục</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Mô tả</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={3} align="center">Đang tải dữ liệu...</TableCell></TableRow>
            ) : filteredCategories.map((cat) => (
              <TableRow key={cat._id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{cat.name}</TableCell>
                <TableCell>{cat.description || 'Không có mô tả'}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" size="small" onClick={() => handleOpen(cat)}><EditIcon /></IconButton>
                  <IconButton color="error" size="small" onClick={() => handleDelete(cat._id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Category Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 800, pt: 3 }}>
          {editingId ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
        </DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <TextField
              label="Tên danh mục"
              name="name"
              fullWidth
              variant="outlined"
              value={newCategory.name}
              onChange={handleChange}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              autoFocus
            />
            <TextField
              label="Mô tả"
              name="description"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={newCategory.description}
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

export default CategoryManagement;
