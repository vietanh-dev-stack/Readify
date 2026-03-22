import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button, Chip, TextField, InputAdornment } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import axiosCustomize from '../../api/axiosCustomize';

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axiosCustomize.get('/book');
        setBooks(response.data?.books || []);
      } catch (error) {
        console.error('Failed to fetch books:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const filteredBooks = books.filter(book => 
    book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.authorIds?.some(author => author.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Quản lý sách</Typography>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ borderRadius: 2 }}>
          Thêm sách mới
        </Button>
      </Box>

      <Paper sx={{ p: 2, borderRadius: 4, mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm sách theo tiêu đề hoặc tác giả..."
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
        <Table sx={{ minWidth: 650 }} aria-label="book table">
          <TableHead sx={{ bgcolor: 'grey.50' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Sách</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Tác giả</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Giá</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Kho</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Danh mục</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Đang tải dữ liệu sách...</TableCell>
              </TableRow>
            ) : filteredBooks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Không tìm thấy sách nào</TableCell>
              </TableRow>
            ) : filteredBooks.map((book) => (
              <TableRow key={book._id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box 
                      component="img" 
                      src={book.coverImage || book.cover} 
                      sx={{ width: 40, height: 60, objectFit: 'cover', borderRadius: 1 }}
                    />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{book.title}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{book.authorIds?.map(a => a.name).join(', ') || 'Không rõ'}</TableCell>
                <TableCell>{book.price?.toLocaleString('vi-VN')} đ</TableCell>
                <TableCell>
                  <Chip 
                    label={book.stock} 
                    size="small" 
                    color={book.stock < 10 ? 'error' : 'success'} 
                    sx={{ fontWeight: 700 }}
                  />
                </TableCell>
                <TableCell>{book.categoryId?.name || 'Chưa phân loại'}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" size="small"><EditIcon /></IconButton>
                  <IconButton color="error" size="small"><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BookManagement;
