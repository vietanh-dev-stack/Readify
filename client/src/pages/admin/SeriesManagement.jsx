import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button, TextField, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Snackbar, MenuItem, Select, FormControl, InputLabel, Chip } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import { fetchSeries, createSeries, updateSeries, deleteSeries } from '../../services/series.service';

const SeriesManagement = () => {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog state
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', totalVolumes: '', status: 'ongoing' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadSeries = async () => {
    setLoading(true);
    try {
      const response = await fetchSeries();
      setSeries(response.data || []);
    } catch (error) {
      console.error('Failed to fetch series:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSeries();
  }, []);

  const handleOpen = (item = null) => {
    if (item) {
      setEditingId(item._id);
      setFormData({ 
        title: item.title, 
        description: item.description || '', 
        totalVolumes: item.totalVolumes || '', 
        status: item.status || 'ongoing' 
      });
    } else {
      setEditingId(null);
      setFormData({ title: '', description: '', totalVolumes: '', status: 'ongoing' });
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
    if (!formData.title.trim()) {
      setError('Tiêu đề không được để trống');
      return;
    }

    const dataToSend = {
      ...formData,
      totalVolumes: formData.totalVolumes === '' ? undefined : Number(formData.totalVolumes)
    };

    try {
      if (editingId) {
        await updateSeries(editingId, dataToSend);
        setSuccess('Cập nhật chuỗi sách thành công!');
      } else {
        await createSeries(dataToSend);
        setSuccess('Thêm chuỗi sách thành công!');
      }
      handleClose();
      loadSeries();
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chuỗi sách này?')) {
      try {
        await deleteSeries(id);
        setSuccess('Xóa chuỗi sách thành công!');
        loadSeries();
      } catch (err) {
        alert(err.response?.data?.message || 'Có lỗi xảy ra khi xóa chuỗi sách');
      }
    }
  };

  const filteredSeries = series.filter(s => 
    s.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Quản lý chuỗi sách (Series)</Typography>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ borderRadius: 2 }} onClick={() => handleOpen()}>
          Thêm chuỗi sách mới
        </Button>
      </Box>

      <Paper sx={{ p: 2, borderRadius: 4, mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm chuỗi sách..."
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
              <TableCell sx={{ fontWeight: 700 }}>Tên chuỗi</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Số tập</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Mô tả</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={3} align="center">Đang tải dữ liệu...</TableCell></TableRow>
            ) : filteredSeries.map((s) => (
              <TableRow key={s._id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{s.title}</TableCell>
                <TableCell>{s.totalVolumes || 0}</TableCell>
                <TableCell>
                  <Chip 
                    label={s.status === 'ongoing' ? 'Đang phát hành' : 'Hoàn thành'} 
                    size="small" 
                    color={s.status === 'ongoing' ? 'primary' : 'success'} 
                    sx={{ borderRadius: 1.5, fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell>{s.description || 'Không có mô tả'}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" size="small" onClick={() => handleOpen(s)}><EditIcon /></IconButton>
                  <IconButton color="error" size="small" onClick={() => handleDelete(s._id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Series Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 800, pt: 3 }}>
          {editingId ? 'Cập nhật chuỗi sách' : 'Thêm chuỗi sách mới'}
        </DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <TextField
              label="Tên chuỗi sách"
              name="title"
              fullWidth
              variant="outlined"
              value={formData.title}
              onChange={handleChange}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              autoFocus
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Số tập"
                name="totalVolumes"
                type="number"
                fullWidth
                variant="outlined"
                value={formData.totalVolumes}
                onChange={handleChange}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  label="Trạng thái"
                  onChange={handleChange}
                  sx={{ borderRadius: 3 }}
                >
                  <MenuItem value="ongoing">Đang phát hành</MenuItem>
                  <MenuItem value="completed">Hoàn thành</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TextField
              label="Mô tả"
              name="description"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={formData.description}
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

export default SeriesManagement;
