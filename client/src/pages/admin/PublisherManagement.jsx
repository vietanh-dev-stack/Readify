import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button, TextField, InputAdornment } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import axiosCustomize from '../../api/axiosCustomize';

const PublisherManagement = () => {
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPublishers = async () => {
      try {
        const response = await axiosCustomize.get('/v1/publisher');
        setPublishers(response.data?.publishers || []);
      } catch (error) {
        console.error('Failed to fetch publishers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPublishers();
  }, []);

  const filteredPublishers = publishers.filter(pub => 
    pub.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Publisher Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ borderRadius: 2 }}>
          Add New Publisher
        </Button>
      </Box>

      <Paper sx={{ p: 2, borderRadius: 4, mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search publishers..."
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
              <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Contact</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={3} align="center">Loading...</TableCell></TableRow>
            ) : filteredPublishers.map((pub) => (
              <TableRow key={pub._id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{pub.name}</TableCell>
                <TableCell>{pub.email || 'N/A'}</TableCell>
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

export default PublisherManagement;
