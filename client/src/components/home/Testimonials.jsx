import React from 'react';
import { Box, Typography, Container, Grid, Paper, Avatar, Chip } from '@mui/material';
import Rating from '@mui/material/Rating';
import FacebookIcon from '@mui/icons-material/Facebook';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const reviews = [
  { 
    id: 1, 
    name: "Nguyễn Hoàng Phương Nghi", 
    date: "Tháng 11, 2024", 
    avatar: "https://i.pravatar.cc/150?img=11", 
    rating: 5, 
    tag: "Khoa học viễn tưởng", 
    content: "Trước khi dùng Readify, mình từng gặp nhiều khó khăn trong việc tổ chức danh sách đọc và tìm những cuốn sách thực sự thu hút. Readify rất ngăn nắp. Nhờ các tính năng như theo dõi tiến độ và gợi ý thông minh, thói quen đọc của mình đã tăng trưởng vượt bậc..." 
  },
  { 
    id: 2, 
    name: "Nguyễn Phương Huỳnh", 
    date: "Tháng 10, 2024", 
    avatar: "https://i.pravatar.cc/150?img=5", 
    rating: 5, 
    tag: "Sách kỹ năng", 
    content: "Review Readify một chút! Mua sách ở đây cực kỳ dễ dàng, không hề có quảng cáo 😂 Kết quả: Mình đã đọc xong 3 cuốn trong tháng này. Nền tảng rất tiện lợi, có thể khám phá và đọc thử mọi lúc mọi nơi!" 
  },
  { 
    id: 3, 
    name: "Trần Bảo Ngọc", 
    date: "Tháng 11, 2024", 
    avatar: "https://i.pravatar.cc/150?img=12", 
    rating: 5, 
    tag: "Kinh tế & Kinh doanh", 
    content: "Dạ em xin review Readify ngắn gọn bằng 3 chữ: giỏi, chu đáo, nhiệt tình. Đội ngũ hỗ trợ giải đáp thắc mắc rất nhanh, nên mình không phải lo quá nhiều về việc giao nhận hay chất lượng sách... Kho sách có hệ thống, từ cơ bản đến nâng cao!" 
  },
  { 
    id: 4, 
    name: "Lê Đình Bảo Trân", 
    date: "Tháng 09, 2024", 
    avatar: "https://i.pravatar.cc/150?img=14", 
    rating: 5, 
    tag: "Văn học kinh điển", 
    content: "Readify đã đồng hành cùng mình ngay từ những bước chân đầu tiên trong hành trình xây dựng thói quen đọc sách. Từ những lựa chọn đầu tiên về văn học, mình đã khám phá ra nhiều viên ngọc ẩn. Nhờ vào danh mục rõ ràng và gợi ý tận tâm." 
  },
  { 
    id: 5, 
    name: "Nguyễn Ngọc Lan Chi", 
    date: "Tháng 10, 2024", 
    avatar: "https://i.pravatar.cc/150?img=15", 
    rating: 5, 
    tag: "Tâm lý học", 
    content: "Tìm sách theo chủ đề ở đây cực kỳ thú vị so với cách truyền thống??? Đó giờ mình thấy khó nhất là tìm được cuốn sách thực sự 'chạm'. Mình từng bị ngợp giữa hàng ngàn tiêu đề, nhưng giờ đã tìm được bộ sách ưng ý nhờ Readify!" 
  },
  { 
    id: 6, 
    name: "Đinh Văn Thái Bảo", 
    date: "Tháng 09, 2024", 
    avatar: "https://i.pravatar.cc/150?img=16", 
    rating: 5, 
    tag: "Blockchain & Crypto", 
    content: "🚀 Cần tìm tài liệu gấp, mình đã chọn Readify. Kho sách phong phú, lớp phân loại rõ ràng để không ảnh hưởng đến việc tìm kiếm. Mình được đội ngũ tư vấn rất kỹ... Hệ thống gợi ý đa dạng, phản hồi nhanh chóng!" 
  }
];

const Testimonials = () => {
  return (
    <Box sx={{ py: 10, background: '#f3f4f6' }}>
      <Container maxWidth="lg">

        {/* HEADER */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Chip
            label="ĐÁNH GIÁ TỪ ĐỘC GIẢ"
            sx={{
              bgcolor: '#3b82f6',
              color: '#fff',
              fontWeight: 700,
              borderRadius: '999px',
              mb: 2,
              px: 2
            }}
          />

          <Typography sx={{ fontSize: 42, fontWeight: 800, mb: 2 }}>
            Độc giả nói gì về Readify
          </Typography>

          <Typography sx={{ color: '#6b7280', fontSize: 16 }}>
            <Box component="span" sx={{ color: '#3b82f6', fontWeight: 700 }}>
              300+ đánh giá
            </Box>{' '}
            từ người yêu sách
          </Typography>
        </Box>

        {/* GRID 2 CỘT GIỐNG ẢNH */}
        <Grid container spacing={3}>
          {reviews.map((review) => (
            <Grid item xs={12} md={6} key={review.id}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  border: '1px solid #e5e7eb',
                  position: 'relative',
                  height: '100%',
                  background: '#fff',
                  transition: 'all 0.25s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.06)'
                  }
                }}
              >
                {/* QUOTE ICON MỜ */}
                <FormatQuoteIcon
                  sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    fontSize: 40,
                    color: '#e5e7eb'
                  }}
                />

                {/* HEADER CARD */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Avatar src={review.avatar} sx={{ width: 48, height: 48 }} />

                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>
                        {review.name}
                      </Typography>

                      <Typography sx={{ fontSize: 13, color: '#9ca3af' }}>
                        {review.date}
                      </Typography>

                      <Rating value={review.rating} readOnly size="small" sx={{ color: '#f97316' }} />
                    </Box>
                  </Box>

                  <FacebookIcon sx={{ color: '#1877f2' }} />
                </Box>

                {/* CONTENT */}
                <Typography
                  sx={{
                    color: '#6b7280',
                    mb: 3,
                    lineHeight: 1.6,
                    fontSize: 14
                  }}
                >
                  {review.content}
                </Typography>

                {/* TAG */}
                <Chip
                  label={review.tag}
                  size="small"
                  sx={{
                    bgcolor: '#dbeafe',
                    color: '#1d4ed8',
                    fontWeight: 600,
                    borderRadius: '999px'
                  }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>

      </Container>
    </Box>
  );
};

export default Testimonials;