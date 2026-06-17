/* =========================================================================
   DATABASE SCHEMA (Dạng Comment)
   =========================================================================
   1. Users: { id, name, phone, role (user/business/coordinator), cccd, taxId, status }
   2. Posts: { id, authorId, category, content, images[], likes, comments, createdAt }
   3. Stores: { id, ownerId, name, location (Lat/Long spatial data), products[], rating }
   4. Feedback: { id, storeId, userId, rating, comment, createdAt }
   5. Tiny_Communities: { id, name, description, membersCount, tags[] }
   6. Files: { id, communityId, title, type (pdf/doc), size, url, fullTextContent }
   7. Images_Vector: { id, entityId, vectorData (AI search), ocrText, tags }
   ========================================================================= */

export const mockUser = {
  id: 'u1',
  name: 'Nguyễn Văn Kỹ Thuật',
  phone: '0987654321',
  role: 'user',
  avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d'
};

export const mockPosts = [
  {
    id: 'p1',
    author: 'Trần B (BME Store)',
    category: 'Rao bán',
    content: 'Cần thanh lý gấp 5 bo mạch máy thở chức năng hoàn hảo. Bảo hành 6 tháng.',
    likes: 24,
    comments: 5,
    time: '2 giờ trước'
  },
  {
    id: 'p2',
    author: 'Kỹ sư Lê C',
    category: 'Cần sửa chữa',
    content: 'Máy X-Quang di động báo lỗi E-405, khu vực Quận 1. Ai xử lý được inbox mình với nhé!',
    likes: 8,
    comments: 12,
    time: '5 giờ trước'
  }
];

export const mockStores = [
  {
    id: 's1',
    name: 'BME Tech Service',
    lat: 10.762622,
    lng: 106.660172,
    distance: '2.5 km',
    status: 'online',
    rating: 4.8,
    reviews: 156,
    products: [
      { id: 'prod1', name: 'Bo mạch máy thở ABC', price: '2,500,000đ' },
      { id: 'prod2', name: 'Cảm biến oxy', price: '850,000đ' }
    ]
  },
  {
    id: 's2',
    name: 'Vật tư Y tế Bình Minh',
    lat: 10.772622,
    lng: 106.650172,
    distance: '4.1 km',
    status: 'online',
    rating: 4.5,
    reviews: 89,
    products: [
      { id: 'prod3', name: 'Bóng đèn X-Quang', price: '15,000,000đ' }
    ]
  }
];

export const mockCommunities = [
  {
    id: 'c1',
    name: 'Hội sửa chữa máy X-Quang',
    members: 1250,
    description: 'Nơi chia sẻ tài liệu, pan bệnh máy X-Quang các hãng.'
  },
  {
    id: 'c2',
    name: 'Kỹ sư Máy thở & Monitor',
    members: 3420,
    description: 'Cộng đồng kỹ sư hồi sức cấp cứu lớn nhất VN.'
  }
];

export const mockFiles = [
  {
    id: 'f1',
    communityId: 'c1',
    title: 'Service Manual X-Ray Shimadzu.pdf',
    type: 'PDF',
    size: '15 MB',
    content: 'Tài liệu hướng dẫn sửa chữa máy X-Ray bao gồm sơ đồ mạch board nguồn, lỗi E01, E02...'
  },
  {
    id: 'f2',
    communityId: 'c2',
    title: 'Ventilator PB840 Error Codes.docx',
    type: 'DOCX',
    size: '2 MB',
    content: 'Tổng hợp mã lỗi máy thở PB840. Cách khắc phục lỗi hỏng bo mạch, lỗi khí nén...'
  }
];

export const mockFeedbacks = [
  { id: 'fb1', user: 'Hoàng Anh', rating: 5, text: 'Thợ đến nhanh, sửa máy thở chuyên nghiệp.' },
  { id: 'fb2', user: 'Lê V', rating: 4, text: 'Linh kiện tốt, giá hơi cao nhưng chấp nhận được.' }
];