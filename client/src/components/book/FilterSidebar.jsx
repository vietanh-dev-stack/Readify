import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Rating,
  Slider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';

const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);

const ratingOptions = [5, 4, 3, 2, 1];

const FilterSection = ({
  title,
  children,
  defaultExpanded = true,
  mobile = false,
}) => (
  <Accordion
    disableGutters
    defaultExpanded={defaultExpanded}
    elevation={0}
    square={false}
    sx={{
      border: '1px solid rgba(30, 58, 138, 0.08)',
      borderRadius: '16px !important',
      overflow: 'hidden',
      bgcolor: mobile ? 'rgba(255,255,255,0.95)' : '#fff',
      boxShadow: '0 6px 20px rgba(15, 23, 42, 0.05)',
      '&:before': {
        display: 'none',
      },
      '& + &': {
        mt: 1.25,
      },
    }}
  >
    <AccordionSummary
      expandIcon={<ExpandMoreRoundedIcon sx={{ color: '#1e3a8a' }} />}
      sx={{
        minHeight: 56,
        px: 2,
        '& .MuiAccordionSummary-content': {
          my: 1.2,
        },
      }}
    >
      <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>{title}</Typography>
    </AccordionSummary>
    <AccordionDetails sx={{ px: 2, pt: 0, pb: 2 }}>{children}</AccordionDetails>
  </Accordion>
);

const CheckboxGroup = ({ items = [], selectedValues = [], groupName, onToggle }) => (
  <FormGroup>
    {items.map((item) => (
      <FormControlLabel
        key={item}
        control={
          <Checkbox
            checked={selectedValues.includes(item)}
            onChange={() => onToggle(groupName, item)}
            size="small"
            sx={{
              color: 'rgba(30, 58, 138, 0.45)',
              '&.Mui-checked': {
                color: '#1e3a8a',
              },
            }}
          />
        }
        label={
          <Typography variant="body2" sx={{ color: '#334155' }}>
            {item}
          </Typography>
        }
        sx={{ mr: 0 }}
      />
    ))}
  </FormGroup>
);

const FilterSidebar = ({
  filters,
  options,
  priceBounds,
  onSearchChange,
  onToggleGroupValue,
  onPriceChange,
  onRatingChange,
  onClearAll,
  mobile = false,
}) => {
  const minPrice = priceBounds?.[0] ?? 0;
  const maxPrice = priceBounds?.[1] ?? 1000000;

  return (
    <Box
      sx={{
        width: '100%',
        p: mobile ? 0 : 2,
        borderRadius: mobile ? 0 : 4,
        bgcolor: mobile ? 'transparent' : '#f8fafc',
      }}
    >
      <Stack spacing={2}>
        <Box
          sx={{
            p: mobile ? 0 : 2,
            borderRadius: mobile ? 0 : 4,
            bgcolor: '#fff',
            border: mobile ? 'none' : '1px solid rgba(30, 58, 138, 0.08)',
            boxShadow: mobile ? 'none' : '0 10px 30px rgba(15, 23, 42, 0.06)',
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
            sx={{ mb: 1.5 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e3a8a' }}>
              Bộ lọc
            </Typography>
            <Button
              variant="text"
              startIcon={<RestartAltRoundedIcon />}
              onClick={onClearAll}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                color: '#f59e0b',
                '&:hover': {
                  bgcolor: 'rgba(245, 158, 11, 0.08)',
                },
              }}
            >
              Xóa tất cả
            </Button>
          </Stack>

          <TextField
            fullWidth
            size="small"
            placeholder="Tìm theo tên sách hoặc tác giả"
            value={filters.search}
            onChange={(event) => onSearchChange(event.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: '#fff',
              },
            }}
          />
        </Box>

        <FilterSection title="Danh mục" mobile={mobile}>
          <CheckboxGroup
            items={options?.categories || []}
            selectedValues={filters.categories}
            groupName="categories"
            onToggle={onToggleGroupValue}
          />
        </FilterSection>

        <FilterSection title="Khoảng giá" mobile={mobile}>
          <Box sx={{ px: 1 }}>
            <Slider
              value={filters.priceRange}
              onChange={(_, value) => onPriceChange(value)}
              min={minPrice}
              max={maxPrice}
              step={10000}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => formatCurrency(value)}
              sx={{
                color: '#1e3a8a',
                '& .MuiSlider-thumb': {
                  boxShadow: '0 0 0 8px rgba(30, 58, 138, 0.12)',
                },
              }}
            />
          </Box>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
            sx={{ mt: 1 }}
          >
            <Box
              sx={{
                px: 1.5,
                py: 0.75,
                borderRadius: 2,
                bgcolor: '#eff6ff',
                color: '#1e3a8a',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              {formatCurrency(filters.priceRange[0])}
            </Box>
            <Divider flexItem sx={{ alignSelf: 'center' }} />
            <Box
              sx={{
                px: 1.5,
                py: 0.75,
                borderRadius: 2,
                bgcolor: '#fef3c7',
                color: '#b45309',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              {formatCurrency(filters.priceRange[1])}
            </Box>
          </Stack>
        </FilterSection>

        <FilterSection title="Đánh giá" mobile={mobile}>
          <Stack spacing={0.75}>
            {ratingOptions.map((value) => (
              <Button
                key={value}
                variant={filters.rating === value ? 'contained' : 'outlined'}
                onClick={() => onRatingChange(filters.rating === value ? null : value)}
                startIcon={
                  <Rating
                    value={value}
                    max={5}
                    readOnly
                    size="small"
                    icon={<StarRoundedIcon fontSize="inherit" />}
                    emptyIcon={<StarRoundedIcon fontSize="inherit" />}
                    sx={{ color: '#eab308' }}
                  />
                }
                sx={{
                  justifyContent: 'flex-start',
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  py: 1,
                  color: filters.rating === value ? '#fff' : '#1e3a8a',
                  borderColor: 'rgba(30, 58, 138, 0.16)',
                  bgcolor: filters.rating === value ? '#1e3a8a' : '#fff',
                  '&:hover': {
                    borderColor: '#1e3a8a',
                    bgcolor: filters.rating === value ? '#1d4ed8' : 'rgba(30, 58, 138, 0.04)',
                  },
                }}
              >
                Từ {value} sao
              </Button>
            ))}
          </Stack>
        </FilterSection>

        <FilterSection title="Tác giả" mobile={mobile}>
          <Box
            sx={{
              maxHeight: 220,
              overflowY: 'auto',
              pr: 0.5,
              '&::-webkit-scrollbar': {
                width: 6,
              },
              '&::-webkit-scrollbar-thumb': {
                borderRadius: 999,
                bgcolor: 'rgba(30, 58, 138, 0.2)',
              },
            }}
          >
            <CheckboxGroup
              items={options?.authors || []}
              selectedValues={filters.authors}
              groupName="authors"
              onToggle={onToggleGroupValue}
            />
          </Box>
        </FilterSection>

        <FilterSection title="Bộ sách" mobile={mobile} defaultExpanded={false}>
          <CheckboxGroup
            items={options?.series || []}
            selectedValues={filters.series}
            groupName="series"
            onToggle={onToggleGroupValue}
          />
        </FilterSection>

        <FilterSection title="Nhà xuất bản" mobile={mobile} defaultExpanded={false}>
          <CheckboxGroup
            items={options?.publishers || []}
            selectedValues={filters.publishers}
            groupName="publishers"
            onToggle={onToggleGroupValue}
          />
        </FilterSection>
      </Stack>
    </Box>
  );
};

export default FilterSidebar;