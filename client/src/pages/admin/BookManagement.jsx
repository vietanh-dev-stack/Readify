import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, IconButton, Button, Chip, TextField, InputAdornment, Avatar, Dialog,
  DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select,
  MenuItem, Tabs, Tab, Grid, CircularProgress, Autocomplete
} from '@mui/material';
import {
  Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon,
  Add as AddIcon, Inventory as InventoryIcon, PhotoCamera as PhotoCameraIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';

import {
  fetchBooks, createBook, updateBook, deleteBook,
  fetchInventory, createInventory, updateInventory
} from '../../services/book.service';
import { fetchCategories } from '../../services/category.service';
import { fetchAuthors } from '../../services/author.service';
import { fetchPublishers } from '../../services/publisher.service';
import { fetchSeries } from '../../services/series.service';

// ─── Constants ────────────────────────────────────────────────────────────────

const INITIAL_FORM = {
  title: '', description: '', price: '', discountPrice: '',
  pages: '', bookLanguage: '', releaseDate: '',
  categoryId: '', publisherId: '', seriesId: '',
  authorIds: [], status: 'active',
};

// ─── Status Chip ──────────────────────────────────────────────────────────────

const StatusChip = ({ status }) => {
  const map = {
    active:       { label: 'Đang bán', color: '#059669', bg: '#ecfdf5' },
    out_of_stock: { label: 'Hết hàng', color: '#d97706', bg: '#fffbeb' },
    hidden:       { label: 'Đã ẩn',    color: '#dc2626', bg: '#fef2f2' },
  };
  const s = map[status] || map.hidden;
  return <Chip label={s.label} size="small" sx={{ bgcolor: s.bg, color: s.color, fontWeight: 700, borderRadius: 1.5 }} />;
};

// ─── Tab Panel ────────────────────────────────────────────────────────────────

const TabPanel = ({ children, value, index }) => (
  <Box hidden={value !== index} sx={{ pt: 3 }}>
    {value === index && children}
  </Box>
);

// ─── Section Label ────────────────────────────────────────────────────────────

const SectionLabel = ({ children }) => (
  <Box sx={{ mb: 0.5, mt: 0.5 }}>
    <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 0.6 }}>
      {children}
    </Typography>
    <Box sx={{ height: 2, width: 28, bgcolor: 'primary.main', borderRadius: 1 }} />
  </Box>
);

// ─── Book Form Dialog ─────────────────────────────────────────────────────────

const BookFormDialog = ({ open, onClose, book, categories, authors, publishers, seriesList, onSuccess }) => {
  const isEdit = !!book;
  const [form, setForm] = useState(INITIAL_FORM);
  const [coverPreview, setCoverPreview] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [extraFiles, setExtraFiles] = useState([]);
  const [extraPreviews, setExtraPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const coverRef = useRef(null);
  const extraRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    if (isEdit) {
      setForm({
        title: book.title || '',
        description: book.description || '',
        price: book.price || '',
        discountPrice: book.discountPrice || '',
        pages: book.pages || '',
        bookLanguage: book.bookLanguage || '',
        releaseDate: book.releaseDate ? book.releaseDate.substring(0, 10) : '',
        categoryId: book.categoryId?._id || book.categoryId || '',
        publisherId: book.publisherId?._id || book.publisherId || '',
        seriesId: book.seriesId?._id || book.seriesId || '',
        authorIds: book.authorIds?.map(a => typeof a === 'object' ? a : { _id: a }) || [],
        status: book.status || 'active',
      });
      setCoverPreview(book.coverImage || null);
      setExtraPreviews(book.images || []);
    } else {
      setForm(INITIAL_FORM);
      setCoverPreview(null);
      setExtraPreviews([]);
    }
    setCoverFile(null);
    setExtraFiles([]);
  }, [open]);

  const set = field => e => setForm(p => ({ ...p, [field]: e.target.value }));

  const onCoverPick = e => {
    const f = e.target.files[0];
    if (!f) return;
    setCoverFile(f);
    setCoverPreview(URL.createObjectURL(f));
    e.target.value = '';
  };

  const onExtraPick = e => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setExtraFiles(p => [...p, ...files]);
    setExtraPreviews(p => [...p, ...files.map(f => URL.createObjectURL(f))]);
    e.target.value = '';
  };

  const removeExtra = i => {
    setExtraFiles(p => p.filter((_, j) => j !== i));
    setExtraPreviews(p => p.filter((_, j) => j !== i));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.price || !form.categoryId || !form.publisherId || form.authorIds.length === 0) {
      toast.error('Vui lòng điền: tiêu đề, giá, danh mục, NXB và ít nhất 1 tác giả');
      return;
    }
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'authorIds') {
        v.forEach(a => fd.append('authorIds', a._id || a));
      } else if (v !== '' && v !== null && v !== undefined) {
        fd.append(k, v);
      }
    });
    if (coverFile) fd.append('coverImage', coverFile);
    extraFiles.forEach(f => fd.append('images', f));

    try {
      setSubmitting(true);
      if (isEdit) {
        await updateBook(book._id, fd);
        toast.success('Cập nhật sách thành công!');
      } else {
        await createBook(fd);
        toast.success('Thêm sách mới thành công!');
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Thao tác thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const authorOpts = authors.map(a => ({ ...a, label: a.name }));
  const selectedAuthors = form.authorIds
    .map(sel => authorOpts.find(a => a._id === (sel._id || sel)) || null)
    .filter(Boolean);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" scroll="paper"
      PaperProps={{ sx: { borderRadius: 3, height: '90vh' } }}>

      <DialogTitle sx={{ py: 2, px: 3, fontWeight: 800, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {isEdit ? '✏️ Chỉnh sửa sách' : '➕ Thêm sách mới'}
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

        {/* ── Left: Media Panel ── */}
        <Box sx={{
          width: 220, flexShrink: 0,
          bgcolor: '#f8fafc', borderRight: '1px solid', borderColor: 'divider',
          p: 2.5, display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto'
        }}>
          <SectionLabel>Ảnh bìa</SectionLabel>

          {/* Cover clickable area */}
          <Box onClick={() => coverRef.current?.click()} sx={{
            width: '100%', aspectRatio: '2/3', borderRadius: 2,
            border: '2px dashed', borderColor: coverPreview ? 'primary.main' : '#c8d3de',
            bgcolor: 'white', cursor: 'pointer', overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s', '&:hover': { borderColor: 'primary.main', bgcolor: '#eef3ff' }
          }}>
            {coverPreview
              ? <Box component="img" src={coverPreview} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <Box sx={{ textAlign: 'center', color: '#aab', px: 1.5 }}>
                  <PhotoCameraIcon sx={{ fontSize: 42, opacity: 0.45 }} />
                  <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>Nhấn để chọn ảnh</Typography>
                </Box>
            }
          </Box>
          <input ref={coverRef} type="file" accept="image/*" hidden onChange={onCoverPick} />

          <Button size="small" variant={coverPreview ? 'contained' : 'outlined'}
            onClick={() => coverRef.current?.click()} sx={{ borderRadius: 2, fontSize: '0.73rem' }}>
            {coverPreview ? '🔄 Đổi ảnh bìa' : '📷 Chọn ảnh bìa'}
          </Button>

          {/* Extra images */}
          <SectionLabel>Ảnh phụ ({extraPreviews.length}/10)</SectionLabel>
          <Grid container spacing={0.7}>
            {extraPreviews.map((src, i) => (
              <Grid item xs={4} key={i}>
                <Box sx={{ position: 'relative', paddingTop: '100%', borderRadius: 1, overflow: 'hidden', bgcolor: '#e0e0e0' }}>
                  <Box component="img" src={src} sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <IconButton size="small" onClick={() => removeExtra(i)} sx={{
                    position: 'absolute', top: 1, right: 1, p: '2px',
                    bgcolor: 'rgba(0,0,0,0.55)', color: 'white', '&:hover': { bgcolor: '#dc2626' }
                  }}>
                    <CloseIcon sx={{ fontSize: 11 }} />
                  </IconButton>
                </Box>
              </Grid>
            ))}
            {extraPreviews.length < 10 && (
              <Grid item xs={4}>
                <Box onClick={() => extraRef.current?.click()} sx={{
                  paddingTop: '100%', position: 'relative', borderRadius: 1, cursor: 'pointer',
                  border: '1.5px dashed #c8d3de', bgcolor: 'white',
                  '&:hover': { borderColor: 'primary.main', bgcolor: '#eef3ff' }
                }}>
                  <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <AddIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                    <Typography sx={{ fontSize: '0.58rem', color: 'text.disabled' }}>Thêm</Typography>
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
          <input ref={extraRef} type="file" accept="image/*" multiple hidden onChange={onExtraPick} />
        </Box>

        {/* ── Right: Form Fields ── */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>

          {/* ━━ Thông tin cơ bản ━━ */}
          <Box>
            <SectionLabel>Thông tin cơ bản</SectionLabel>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="Tiêu đề sách *" fullWidth value={form.title} onChange={set('title')} />
              <TextField label="Mô tả" fullWidth multiline rows={3} value={form.description} onChange={set('description')} />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField label="Giá bán (₫) *" type="number" fullWidth value={form.price} onChange={set('price')} inputProps={{ min: 0 }} />
                <TextField label="Giá khuyến mãi (₫)" type="number" fullWidth
                  value={form.discountPrice} onChange={set('discountPrice')}
                  inputProps={{ min: 0 }} helperText="Để trống nếu không áp dụng" />
              </Box>
            </Box>
          </Box>

          {/* ━━ Phân loại ━━ */}
          <Box>
            <SectionLabel>Phân loại</SectionLabel>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Danh mục *</InputLabel>
                  <Select value={form.categoryId} label="Danh mục *" onChange={set('categoryId')}>
                    {categories.map(c => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Nhà xuất bản *</InputLabel>
                  <Select value={form.publisherId} label="Nhà xuất bản *" onChange={set('publisherId')}>
                    {publishers.map(p => <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>)}
                  </Select>
                </FormControl>
              </Box>
              <Autocomplete multiple
                options={authorOpts}
                getOptionLabel={o => o.name || ''}
                isOptionEqualToValue={(o, v) => o._id === (v._id || v)}
                value={selectedAuthors}
                onChange={(_, nv) => setForm(p => ({ ...p, authorIds: nv }))}
                renderInput={params => <TextField {...params} label="Tác giả *" placeholder="Tìm và chọn tác giả..." />}
              />
              <FormControl fullWidth>
                <InputLabel>Bộ sách (tuỳ chọn)</InputLabel>
                <Select value={form.seriesId} label="Bộ sách (tuỳ chọn)" onChange={set('seriesId')}>
                  <MenuItem value=""><em>— Không thuộc bộ nào —</em></MenuItem>
                  {seriesList.map(s => <MenuItem key={s._id} value={s._id}>{s.title}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* ━━ Chi tiết xuất bản ━━ */}
          <Box>
            <SectionLabel>Chi tiết xuất bản</SectionLabel>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField label="Số trang" type="number" fullWidth value={form.pages} onChange={set('pages')} inputProps={{ min: 1 }} />
              <FormControl fullWidth>
                <InputLabel>Ngôn ngữ</InputLabel>
                <Select value={form.bookLanguage} label="Ngôn ngữ" onChange={set('bookLanguage')}>
                  <MenuItem value="vi">🇻🇳 Tiếng Việt</MenuItem>
                  <MenuItem value="en">🇬🇧 Tiếng Anh</MenuItem>
                  <MenuItem value="other">🌐 Khác</MenuItem>
                </Select>
              </FormControl>
              <TextField label="Ngày phát hành" type="date" fullWidth
                value={form.releaseDate} onChange={set('releaseDate')} InputLabelProps={{ shrink: true }} />
            </Box>
          </Box>

          {/* ━━ Trạng thái (edit only) ━━ */}
          {isEdit && (
            <Box>
              <SectionLabel>Trạng thái</SectionLabel>
              <FormControl sx={{ width: '50%' }}>
                <InputLabel>Trạng thái hiển thị</InputLabel>
                <Select value={form.status} label="Trạng thái hiển thị" onChange={set('status')}>
                  <MenuItem value="active">✅ Đang bán</MenuItem>
                  <MenuItem value="out_of_stock">⚠️ Hết hàng</MenuItem>
                  <MenuItem value="hidden">🚫 Ẩn</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}

        </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button onClick={onClose} color="inherit" sx={{ mr: 'auto' }}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={submitting} sx={{ px: 5, borderRadius: 2 }}>
          {submitting
            ? <><CircularProgress size={16} sx={{ color: 'white', mr: 1 }} />Đang lưu...</>
            : (isEdit ? 'Lưu thay đổi' : '➕ Thêm sách')
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ─── Inventory Dialog ─────────────────────────────────────────────────────────

const InventoryDialog = ({ open, onClose, inventory, books, onSuccess }) => {
  const isEdit = !!inventory;
  const [bookId, setBookId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (isEdit) {
      setBookId(inventory.bookId?._id || inventory.bookId || '');
      setQuantity(inventory.quantity || '');
    } else {
      setBookId('');
      setQuantity('');
    }
  }, [open, inventory]);

  const handleSubmit = async () => {
    if (!quantity || (!isEdit && !bookId)) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    try {
      setSubmitting(true);
      if (isEdit) {
        await updateInventory(inventory._id, { quantity: Number(quantity) });
        toast.success('Cập nhật kho thành công!');
      } else {
        await createInventory({ bookId, quantity: Number(quantity) });
        toast.success('Nhập kho thành công!');
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Thao tác thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 800 }}>
        {isEdit ? 'Cập nhật số lượng kho' : 'Nhập kho sách'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {!isEdit && (
            <FormControl fullWidth size="small">
              <InputLabel>Chọn sách</InputLabel>
              <Select value={bookId} label="Chọn sách" onChange={e => setBookId(e.target.value)}>
                {books.map(b => <MenuItem key={b._id} value={b._id}>{b.title}</MenuItem>)}
              </Select>
            </FormControl>
          )}
          {isEdit && (
            <Typography variant="body2" color="text.secondary">
              Sách: <strong>{inventory?.bookId?.title}</strong>
              {inventory?.reserved > 0 && (
                <Typography component="span" variant="caption" color="warning.main" sx={{ ml: 1 }}>
                  (Đang đặt: {inventory.reserved})
                </Typography>
              )}
            </Typography>
          )}
          <TextField
            label="Số lượng" type="number" fullWidth size="small"
            value={quantity} onChange={e => setQuantity(e.target.value)}
            inputProps={{ min: isEdit ? (inventory?.reserved || 0) : 0 }}
            helperText={isEdit ? `Tối thiểu: ${inventory?.reserved || 0} (đang đặt)` : ''}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
          {submitting ? <CircularProgress size={18} sx={{ color: 'white' }} /> : (isEdit ? 'Cập nhật' : 'Nhập kho')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const BookManagement = () => {
  const [tab, setTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingInventory, setLoadingInventory] = useState(true);

  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [seriesList, setSeriesList] = useState([]);

  const [bookDialog, setBookDialog] = useState({ open: false, book: null });
  const [inventoryDialog, setInventoryDialog] = useState({ open: false, inventory: null });

  useEffect(() => {
    Promise.all([
      fetchCategories().then(r => setCategories(r.data || [])),
      fetchAuthors().then(r => setAuthors(r.data || [])),
      fetchPublishers().then(r => setPublishers(r.data || [])),
      fetchSeries().then(r => setSeriesList(r.data || [])),
    ]).catch(err => console.error('Dropdown load failed:', err));
  }, []);

  const loadBooks = async () => {
    try {
      setLoadingBooks(true);
      const res = await fetchBooks();
      setBooks(res.data || []);
    } catch {
      toast.error('Không thể tải danh sách');
    } finally {
      setLoadingBooks(false);
    }
  };

  const loadInventory = async () => {
    try {
      setLoadingInventory(true);
      const res = await fetchInventory();
      setInventory(res.data || []);
    } catch {
      toast.error('Không thể tải dữ liệu kho');
    } finally {
      setLoadingInventory(false);
    }
  };

  useEffect(() => { loadBooks(); }, []);
  useEffect(() => { loadInventory(); }, []);

  const handleDeleteBook = async (book) => {
    if (!window.confirm(`Bạn có chắc muốn ẩn sách "${book.title}"?`)) return;
    try {
      await deleteBook(book._id);
      toast.success('Đã ẩn sách thành công');
      loadBooks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể ẩn sách');
    }
  };

  const filteredBooks = books.filter(b =>
    b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.authorIds?.some(a => (typeof a === 'object' ? a.name : '').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const inventoryBookIds = new Set(inventory.map(inv => inv.bookId?._id || inv.bookId));
  const booksWithoutInventory = books.filter(b => !inventoryBookIds.has(b._id));

  const thStyle = { fontWeight: 700, color: 'text.secondary', borderBottom: 'none' };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Quản lý Sản phẩm</Typography>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" startIcon={<InventoryIcon />} sx={{ borderRadius: 2 }}
            onClick={() => setInventoryDialog({ open: true, inventory: null })}>
            Nhập kho
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} sx={{ borderRadius: 2 }}
            onClick={() => setBookDialog({ open: true, book: null })}>
            Thêm sách mới
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tab label="Danh sách" sx={{ fontWeight: 700 }} />
        <Tab label="Quản lý kho" sx={{ fontWeight: 700 }} />
      </Tabs>

      {/* ── Tab 1: Books ── */}
      <TabPanel value={tab} index={0}>
        <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 3, mb: 3 }}>
          <TextField fullWidth size="small" placeholder="Tìm theo tiêu đề hoặc tác giả..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment> }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Paper>

        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f9fafb' }}>
              <TableRow>
                <TableCell sx={thStyle}>SÁCH</TableCell>
                <TableCell sx={thStyle}>TÁC GIẢ</TableCell>
                <TableCell sx={thStyle}>GIÁ</TableCell>
                <TableCell sx={thStyle}>DANH MỤC</TableCell>
                <TableCell sx={thStyle}>TRẠNG THÁI</TableCell>
                <TableCell sx={{ ...thStyle, textAlign: 'right' }}>HÀNH ĐỘNG</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingBooks ? (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4 }}><CircularProgress size={28} /></TableCell></TableRow>
              ) : filteredBooks.length === 0 ? (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>Không tìm thấy sách nào</TableCell></TableRow>
              ) : filteredBooks.map(book => (
                <TableRow key={book._id} hover sx={{ '&:last-child td': { border: 0 } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar src={book.coverImage} variant="rounded" sx={{ width: 40, height: 56, borderRadius: 1 }}>📚</Avatar>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, maxWidth: 200 }} noWrap>{book.title}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>
                    {book.authorIds?.map(a => typeof a === 'object' ? a.name : '').filter(Boolean).join(', ') || '—'}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{Number(book.price)?.toLocaleString('vi-VN')} đ</Typography>
                    {book.discountPrice > 0 && (
                      <Typography variant="caption" color="error.main" sx={{ textDecoration: 'line-through' }}>
                        {Number(book.discountPrice)?.toLocaleString('vi-VN')} đ
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{book.categoryId?.name || '—'}</TableCell>
                  <TableCell><StatusChip status={book.status} /></TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" size="small" onClick={() => setBookDialog({ open: true, book })}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton color="error" size="small" onClick={() => handleDeleteBook(book)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* ── Tab 2: Inventory ── */}
      <TabPanel value={tab} index={1}>
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f9fafb' }}>
              <TableRow>
                <TableCell sx={thStyle}>SÁCH</TableCell>
                <TableCell sx={thStyle}>SỐ LƯỢNG KHO</TableCell>
                <TableCell sx={thStyle}>ĐANG ĐẶT</TableCell>
                <TableCell sx={thStyle}>CÒN LẠI</TableCell>
                <TableCell sx={{ ...thStyle, textAlign: 'right' }}>HÀNH ĐỘNG</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingInventory ? (
                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4 }}><CircularProgress size={28} /></TableCell></TableRow>
              ) : inventory.length === 0 ? (
                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>Chưa có dữ liệu kho</TableCell></TableRow>
              ) : inventory.map(inv => {
                const available = Math.max(0, (inv.quantity || 0) - (inv.reserved || 0));
                const isLow = available < 10;
                return (
                  <TableRow key={inv._id} hover sx={{ '&:last-child td': { border: 0 } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar src={inv.bookId?.coverImage} variant="rounded" sx={{ width: 36, height: 50, borderRadius: 1 }}>📚</Avatar>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }} noWrap>{inv.bookId?.title || '—'}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 600 }}>{inv.quantity || 0}</Typography></TableCell>
                    <TableCell>
                      <Chip label={inv.reserved || 0} size="small" color="warning" variant="outlined" sx={{ fontWeight: 700 }} />
                    </TableCell>
                    <TableCell>
                      <Chip label={available} size="small" sx={{
                        fontWeight: 700, bgcolor: isLow ? '#fef2f2' : '#ecfdf5', color: isLow ? '#dc2626' : '#059669'
                      }} />
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" variant="outlined" sx={{ borderRadius: 2 }}
                        onClick={() => setInventoryDialog({ open: true, inventory: inv })}>
                        Cập nhật
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Dialogs */}
      <BookFormDialog
        open={bookDialog.open}
        onClose={() => setBookDialog({ open: false, book: null })}
        book={bookDialog.book}
        categories={categories}
        authors={authors}
        publishers={publishers}
        seriesList={seriesList}
        onSuccess={() => { loadBooks(); loadInventory(); }}
      />
      <InventoryDialog
        open={inventoryDialog.open}
        onClose={() => setInventoryDialog({ open: false, inventory: null })}
        inventory={inventoryDialog.inventory}
        books={booksWithoutInventory}
        onSuccess={loadInventory}
      />
    </Box>
  );
};

export default BookManagement;
