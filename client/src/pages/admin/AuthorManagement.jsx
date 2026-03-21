import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button, TextField, InputAdornment, Avatar } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import axiosCustomize from '../../api/axiosCustomize';

const AuthorManagement = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await axiosCustomize.get('/v1/author');
        setAuthors(response.data?.authors || []);
      } catch (error) {
        console.error('Failed to fetch authors:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthors();
  }, []);

  const filteredAuthors = authors.filter(author => 
    author.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Author Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ borderRadius: 2 }}>
          Add New Author
        </Button>
      </Box>

      <Paper sx={{ p: 2, borderRadius: 4, mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search authors..."
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
              <TableCell sx={{ fontWeight: 700 }}>Author</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Biography</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={3} align="center">Loading...</TableCell></TableRow>
            ) : filteredAuthors.map((author) => (
              <TableRow key={author._id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={author.avatar}>{author.name?.charAt(0)}</Avatar>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{author.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{author.biography?.substring(0, 50)}...</TableCell>
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

export default AuthorManagement;
