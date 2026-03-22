import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button, TextField, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Snackbar } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import { fetchPublishers, createPublisher, updatePublisher, deletePublisher } from '../../services/publisher.service';

const PublisherManagement = () => {
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog state
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', address: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadPublishers = async () => {
    setLoading(true);
    try {
      const response = await fetchPublishers();
      setPublishers(response.data || []);
    } catch (error) {
      console.error('Failed to fetch publishers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPublishers();
  }, []);

  const handleOpen = (publisher = null) => {
    if (publisher) {
      setEditingId(publisher._id);
      setFormData({ name: publisher.name, address: publisher.address || '' });
    } else {
      setEditingId(null);
      setFormData({ name: '', address: '' });
    }
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

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError('Tên nhà xuất bản không được để trống');
      return;
    }

    try {
      if (editingId) {
        await updatePublisher(editingId, formData);
        setSuccess('Cập nhật nhà xuất bản thành công!');
      } else {
        await createPublisher(formData);
        setSuccess('Thêm nhà xuất bản thành công!');
      }
      handleClose();
      loadPublishers();
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhà xuất bản này?')) {
      try {
        await deletePublisher(id);
        setSuccess('Xóa nhà xuất bản thành công!');
        loadPublishers();
      } catch (err) {
        alert(err.response?.data?.message || 'Có lỗi xảy ra khi xóa nhà xuất bản');
      }
    }
  };

  const filteredPublishers = publishers.filter(pub => 
    pub.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Quản lý nhà xuất bản</Typography>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ borderRadius: 2 }} onClick={() => handleOpen()}>
          Thêm nhà xuất bản mới
        </Button>
      </Box>

      <Paper sx={{ p: 2, borderRadius: 4, mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm nhà xuất bản..."
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
              <TableCell sx={{ fontWeight: 700 }}>Tên nhà xuất bản</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Địa chỉ</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={3} align="center">Đang tải dữ liệu...</TableCell></TableRow>
            ) : filteredPublishers.map((pub) => (
              <TableRow key={pub._id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{pub.name}</TableCell>
                <TableCell>{pub.address || 'Không có'}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" size="small" onClick={() => handleOpen(pub)}><EditIcon /></IconButton>
                  <IconButton color="error" size="small" onClick={() => handleDelete(pub._id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Publisher Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 800, pt: 3 }}>
          {editingId ? 'Cập nhật nhà xuất bản' : 'Thêm nhà xuất bản mới'}
        </DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <TextField
              label="Tên nhà xuất bản"
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
              label="Địa chỉ"
              name="address"
              fullWidth
              variant="outlined"
              value={formData.address}
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

export default PublisherManagement;
