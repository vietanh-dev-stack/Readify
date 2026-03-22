import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Button, 
  Chip, TextField, InputAdornment, Avatar, Dialog,
  DialogTitle, DialogContent, DialogActions, FormControl,
  InputLabel, Select, MenuItem
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import { fetchUsers, updateRole, updateStatus, createUser } from '../../services/user.service';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // States for Edit Role Dialog
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [updating, setUpdating] = useState(false);

  // States for Add User Dialog
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newUserData, setNewUserData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'client'
  });
  const [adding, setAdding] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetchUsers()
      setUsers(response.data || [])
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setNewRole(user.role || 'client');
    setOpenEditDialog(true);
  };

  const handleCloseEdit = () => {
    setOpenEditDialog(false);
    setSelectedUser(null);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;
    
    try {
      setUpdating(true);
      await updateRole(selectedUser._id, { role: newRole });
      toast.success('Cập nhật vai trò thành công');
      handleCloseEdit();
      fetchData();
    } catch (error) {
      const message = error.response?.data?.message || 'Cập nhật vai trò thất bại';
      toast.error(message);
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleStatus = async (user) => {
    const action = user.isActive ? 'khóa' : 'mở khóa';
    if (!window.confirm(`Bạn có chắc chắn muốn ${action} người dùng ${user.fullName || user.username}?`)) {
      return;
    }

    try {
      await updateStatus(user._id);
      toast.success(`${user.isActive ? 'Khóa' : 'Mở khóa'} người dùng thành công`);
      fetchData();
    } catch (error) {
      const message = error.response?.data?.message || 'Cập nhật trạng thái thất bại';
      toast.error(message);
    }
  };

  const handleOpenAdd = () => {
    setNewUserData({
      username: '',
      email: '',
      password: '',
      role: 'client'
    });
    setOpenAddDialog(true);
  };

  const handleCloseAdd = () => {
    setOpenAddDialog(false);
  };

  const handleAddUser = async () => {
    if (!newUserData.username || !newUserData.email || !newUserData.password) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setAdding(true);
      await createUser(newUserData);
      toast.success('Thêm người dùng mới thành công');
      handleCloseAdd();
      fetchData();
    } catch (error) {
      const message = error.response?.data?.message || 'Thêm người dùng thất bại';
      toast.error(message);
    } finally {
      setAdding(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Quản lý người dùng</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          sx={{ borderRadius: 2 }}
          onClick={handleOpenAdd}
        >
          Thêm người dùng mới
        </Button>
      </Box>

      <Paper sx={{ p: 2, borderRadius: 4, mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm người dùng theo tên hoặc email..."
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
        <Table sx={{ minWidth: 650 }} aria-label="user table">
          <TableHead sx={{ bgcolor: 'grey.50' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Người dùng</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Vai trò</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">Đang tải dữ liệu người dùng...</TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">Không tìm thấy người dùng nào</TableCell>
              </TableRow>
            ) : filteredUsers.map((user) => (
              <TableRow key={user._id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={user.avatar} sx={{ bgcolor: 'primary.main' }}>{user.fullName?.charAt(0) || user.username?.charAt(0)}</Avatar>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{user.fullName || user.username}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.role || 'client'} 
                    size="small" 
                    color={user.role === 'admin' ? 'secondary' : 'default'} 
                    sx={{ fontWeight: 700 }}
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={user.isActive ? 'Hoạt động' : 'Không hoạt động'}
                    size="small" 
                    color={user.isActive ? 'success' : 'error'} 
                    variant="outlined"
                    sx={{ fontWeight: 700 }}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton 
                    color="primary" 
                    size="small" 
                    onClick={() => handleOpenEdit(user)}
                    disabled={user.role === 'admin'} 
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    size="small" 
                    onClick={() => handleToggleStatus(user)}
                    disabled={user.role === 'admin'}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add User Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAdd} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 700 }}>Thêm người dùng mới</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Tên đăng nhập"
              fullWidth
              value={newUserData.username}
              onChange={(e) => setNewUserData({ ...newUserData, username: e.target.value })}
            />
            <TextField
              label="Email"
              fullWidth
              type="email"
              value={newUserData.email}
              onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
            />
            <TextField
              label="Mật khẩu"
              fullWidth
              type="password"
              value={newUserData.password}
              onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel id="add-role-label">Vai trò</InputLabel>
              <Select
                labelId="add-role-label"
                value={newUserData.role}
                label="Vai trò"
                onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
              >
                <MenuItem value="client">Client</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseAdd} color="inherit">Hủy</Button>
          <Button 
            onClick={handleAddUser} 
            variant="contained" 
            disabled={adding}
          >
            {adding ? 'Đang thêm...' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEdit} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 700 }}>Cập nhật vai trò người dùng</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Thay đổi vai trò cho người dùng: <strong>{selectedUser?.fullName || selectedUser?.username}</strong>
            </Typography>
            <FormControl fullWidth>
              <InputLabel id="role-select-label">Vai trò</InputLabel>
              <Select
                labelId="role-select-label"
                value={newRole}
                label="Vai trò"
                onChange={(e) => setNewRole(e.target.value)}
              >
                <MenuItem value="client">Client</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseEdit} color="inherit">Hủy</Button>
          <Button 
            onClick={handleUpdateRole} 
            variant="contained" 
            disabled={updating || newRole === selectedUser?.role}
          >
            {updating ? 'Đang cập nhật...' : 'Cập nhật'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
