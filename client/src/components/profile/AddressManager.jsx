import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Alert,
  Divider,
  Autocomplete,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import toast from 'react-hot-toast';
import { getAddresses, createAddress, updateAddress, deleteAddress } from '../../services/address.service';
import { getProvinces, getDistricts, getWards } from '../../services/province.service';

const initialAddressForm = {
  name: '',
  phone: '',
  province: '',
  district: '',
  ward: '',
  street: '',
  isDefault: false,
};

const AddressManager = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState(initialAddressForm);
  const [submitting, setSubmitting] = useState(false);

  // Address lookup data
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [lookupLoading, setLookupLoading] = useState({
    p: false,
    d: false,
    w: false
  });

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await getAddresses();
      const addressList = response?.data?.data || response?.data || [];
      setAddresses(Array.isArray(addressList) ? addressList : []);
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải danh sách địa chỉ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
    loadProvinces();
  }, []);

  const loadProvinces = async () => {
    setLookupLoading(prev => ({ ...prev, p: true }));
    try {
      const res = await getProvinces();
      setProvinces(res.data);
    } catch (error) {
      console.error('Failed to load provinces', error);
    } finally {
      setLookupLoading(prev => ({ ...prev, p: false }));
    }
  };

  const loadDistricts = async (provinceCode) => {
    if (!provinceCode) {
      setDistricts([]);
      return;
    }
    setLookupLoading(prev => ({ ...prev, d: true }));
    try {
      const res = await getDistricts(provinceCode);
      setDistricts(res.data.districts);
    } catch (error) {
      console.error('Failed to load districts', error);
    } finally {
      setLookupLoading(prev => ({ ...prev, d: false }));
    }
  };

  const loadWards = async (districtCode) => {
    if (!districtCode) {
      setWards([]);
      return;
    }
    setLookupLoading(prev => ({ ...prev, w: true }));
    try {
      const res = await getWards(districtCode);
      setWards(res.data.wards);
    } catch (error) {
      console.error('Failed to load wards', error);
    } finally {
      setLookupLoading(prev => ({ ...prev, w: false }));
    }
  };

  const handleOpenDialog = async (address = null) => {
    if (address) {
      setEditingAddress(address);
      setAddressForm({
        name: address.name || '',
        phone: address.phone || '',
        province: address.province || '',
        district: address.district || '',
        ward: address.ward || '',
        street: address.street || '',
        isDefault: address.isDefault || false,
      });

      // Try to preload districts and wards if we can find the codes
      const province = provinces.find(p => p.name === address.province);
      if (province) {
        setLookupLoading(prev => ({ ...prev, d: true }));
        try {
          const dRes = await getDistricts(province.code);
          const dList = dRes.data.districts;
          setDistricts(dList);
          
          const district = dList.find(d => d.name === address.district);
          if (district) {
            setLookupLoading(prev => ({ ...prev, w: true }));
            const wRes = await getWards(district.code);
            setWards(wRes.data.wards);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLookupLoading(prev => ({ ...prev, d: false, w: false }));
        }
      }
    } else {
      setEditingAddress(null);
      setAddressForm(initialAddressForm);
      setDistricts([]);
      setWards([]);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAddress(null);
    setAddressForm(initialAddressForm);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleProvinceChange = (event, newValue) => {
    const provinceName = newValue ? newValue.name : '';
    setAddressForm(prev => ({
      ...prev,
      province: provinceName,
      district: '',
      ward: ''
    }));
    setDistricts([]);
    setWards([]);
    if (newValue) {
      loadDistricts(newValue.code);
    }
  };

  const handleDistrictChange = (event, newValue) => {
    const districtName = newValue ? newValue.name : '';
    setAddressForm(prev => ({
      ...prev,
      district: districtName,
      ward: ''
    }));
    setWards([]);
    if (newValue) {
      loadWards(newValue.code);
    }
  };

  const handleWardChange = (event, newValue) => {
    const wardName = newValue ? newValue.name : '';
    setAddressForm(prev => ({
      ...prev,
      ward: wardName
    }));
  };

  const handleSubmit = async () => {
    const requiredFields = ['name', 'phone', 'province', 'district', 'ward', 'street'];
    const hasEmptyField = requiredFields.some((field) => !addressForm[field]?.trim());

    if (hasEmptyField) {
      toast.error('Vui lòng điền đầy đủ thông tin địa chỉ.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingAddress) {
        await updateAddress(editingAddress._id, addressForm);
        toast.success('Cập nhật địa chỉ thành công.');
      } else {
        await createAddress(addressForm);
        toast.success('Thêm địa chỉ mới thành công.');
      }
      handleCloseDialog();
      fetchAddresses();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      try {
        await deleteAddress(id);
        toast.success('Xóa địa chỉ thành công.');
        fetchAddresses();
      } catch (error) {
        console.error(error);
        toast.error('Không thể xóa địa chỉ.');
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={700}>Địa chỉ của tôi</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Thêm địa chỉ mới
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : addresses.length === 0 ? (
        <Alert severity="info">Bạn chưa có địa chỉ nào.</Alert>
      ) : (
        <Stack spacing={2}>
          {addresses.map((address) => (
            <Paper
              key={address._id}
              elevation={0}
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: address.isDefault ? 'primary.main' : 'divider',
                borderRadius: 2,
                position: 'relative',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography fontWeight={700}>{address.name}</Typography>
                    <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                    <Typography color="text.secondary">{address.phone}</Typography>
                    {address.isDefault && (
                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'primary.main', ml: 1 }}>
                        <CheckCircleIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        <Typography variant="caption" fontWeight={700}>Mặc định</Typography>
                      </Box>
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {address.street}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {`${address.ward}, ${address.district}, ${address.province}`}
                  </Typography>
                </Box>
                <Box>
                  <IconButton size="small" color="primary" onClick={() => handleOpenDialog(address)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  {!address.isDefault && (
                    <IconButton size="small" color="error" onClick={() => handleDelete(address._id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </Box>
            </Paper>
          ))}
        </Stack>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, pt: 1 }}>
            <TextField
              label="Họ và tên"
              name="name"
              value={addressForm.name}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Số điện thoại"
              name="phone"
              value={addressForm.phone}
              onChange={handleInputChange}
              fullWidth
              required
            />
            
            <Autocomplete
              options={provinces}
              getOptionLabel={(option) => option.name || ''}
              value={provinces.find(p => p.name === addressForm.province) || null}
              onChange={handleProvinceChange}
              loading={lookupLoading.p}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Tỉnh / Thành phố" 
                  required
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {lookupLoading.p ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />

            <Autocomplete
              options={districts}
              getOptionLabel={(option) => option.name || ''}
              value={districts.find(d => d.name === addressForm.district) || null}
              onChange={handleDistrictChange}
              loading={lookupLoading.d}
              disabled={!addressForm.province}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Quận / Huyện" 
                  required
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {lookupLoading.d ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />

            <Autocomplete
              options={wards}
              getOptionLabel={(option) => option.name || ''}
              value={wards.find(w => w.name === addressForm.ward) || null}
              onChange={handleWardChange}
              loading={lookupLoading.w}
              disabled={!addressForm.district}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Phường / Xã" 
                  required
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {lookupLoading.w ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />

            <TextField
              label="Số nhà, tên đường"
              name="street"
              value={addressForm.street}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Box>
          <FormControlLabel
            sx={{ mt: 2 }}
            control={
              <Checkbox
                name="isDefault"
                checked={addressForm.isDefault}
                onChange={handleInputChange}
                disabled={editingAddress?.isDefault}
              />
            }
            label="Đặt làm địa chỉ mặc định"
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} color="inherit">Hủy</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
          >
            {submitting ? 'Đang lưu...' : 'Lưu địa chỉ'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddressManager;
