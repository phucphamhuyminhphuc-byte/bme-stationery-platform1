/* =========================================================================
   DATABASE SCHEMA (Dạng Comment)
   =========================================================================
   1. Users: { id, name, phone, role (user/business/coordinator/admin), cccd, taxId, status, avatar, location }
   2. Posts: { id, authorId, author, category, content, images, likes, comments, time, replies }
   3. Stores: { id, ownerId, name, lat, lng, distance, status, rating, products, feedback_count }
   4. Feedback: { id, storeId, userId, author, rating, comment, date }
   5. Tiny_Communities: { id, name, description, membersCount, tags, members }
   6. Files: { id, communityId, title, type (pdf/doc), size, url, uploadedBy, date }
   7. Images_Vector: { id, entityId, vectorData, ocrText, tags, lat, lng }
   ========================================================================= */

export const mockUser = {
  id: 'u1',
  name: 'Nguyễn Văn Kỹ Thuật',
  phone: '0987654321',
  role: 'user',
  avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
  location: 'Q.1, TP.HCM',
};

export const mockPosts = [
  {
    id: 'p1',
    authorId: 'u2',
    author: '🏥 Trần B (BME Store)',
    avatar: 'https://i.pravatar.cc/150?u=b042581f4e29026024d',
    category: 'Rao bán',
    content: 'Cần thanh lý gấp 5 bo mạch máy thở chức năng hoàn hảo. Bảo hành 6 tháng. Giá tốt cho nhà thầu.',
    images: ['https://via.placeholder.com/400x300?text=Bo+Mach+May+Tho'],
    likes: 24,
    comments: 5,
    time: '2 giờ trước',
    replies: [
      { id: 'r1', author: 'Công ty Y', text: 'Giá bao nhiêu bạn?', time: '1 giờ trước' },
      { id: 'r2', author: 'Bệnh viện A', text: 'Còn hàng không? Xin liên hệ', time: '30 phút trước' },
    ],
  },
  {
    id: 'p2',
    authorId: 'u3',
    author: '👨‍🔧 Kỹ sư Lê C',
    avatar: 'https://i.pravatar.cc/150?u=c042581f4e29026024d',
    category: 'Cần sửa chữa',
    content: 'Máy X-Quang di động báo lỗi E-405 (đèn báo đỏ). Khu vực Quận 1. Ai xử lý được inbox mình với nhé! Trả công cao.',
    images: ['https://via.placeholder.com/400x300?text=May+X+Quang+Loi+E405'],
    likes: 8,
    comments: 12,
    time: '5 giờ trước',
    replies: [
      { id: 'r3', author: 'Kỹ thuật BME', text: 'Lỗi này là X-ray generator. Mình có sửa', time: '4 giờ trước' },
      { id: 'r4', author: 'Chuyên gia Y', text: 'Bảo hành chưa hết?', time: '2 giờ trước' },
    ],
  },
  {
    id: 'p3',
    authorId: 'u4',
    author: '💡 Nguyễn D (Chuyên gia)',
    avatar: 'https://i.pravatar.cc/150?u=d042581f4e29026024d',
    category: 'Chia sẻ kiến thức',
    content: '📚 HƯỚNG DẪN: Cách reset lỗi máy ECG | Cơ chế hoạt động của cảm biến SpO2 và những sai lầm phổ biến khi hiệu chuẩn. Các bước chi tiết:',
    images: ['https://via.placeholder.com/400x300?text=Huong+Dan+ECG'],
    likes: 156,
    comments: 34,
    time: '1 ngày trước',
    replies: [
      { id: 'r5', author: 'Kỹ sư Hải', text: 'Rất hữu ích! Cảm ơn bạn', time: '20 giờ trước' },
      { id: 'r6', author: 'Nhà thầu TQ', text: 'Còn video hướng dẫn không?', time: '15 giờ trước' },
    ],
  },
  {
    id: 'p4',
    authorId: 'u5',
    author: '🛒 Lê F (Cửa hàng Online)',
    avatar: 'https://i.pravatar.cc/150?u=e042581f4e29026024d',
    category: 'Tìm mua',
    content: '🔍 Cần tìm 10 cái Bộ cảm biến ECG cao cấp loại 5 sợi, hàng mới 100%. Yêu cầu: Dây gắn vàng, chất lượng xuất khẩu. Bao kiểm hàng.',
    images: ['https://via.placeholder.com/400x300?text=Cam+Bien+ECG'],
    likes: 12,
    comments: 3,
    time: '6 giờ trước',
    replies: [
      { id: 'r7', author: 'Cấp phát BME', text: 'Mình có sẵn. Bao ship?', time: '5 giờ trước' },
    ],
  },
];

export const mockStores = [
  {
    id: 's1',
    ownerId: 'u2',
    name: 'BME Tech Service',
    lat: 10.762622,
    lng: 106.660172,
    distance: '2.5 km',
    status: 'online',
    rating: 4.8,
    feedback_count: 156,
    products: ['Bo mạch máy thở', 'Linh kiện X-ray', 'Cảm biến ECG'],
    image: 'https://via.placeholder.com/300x200?text=BME+Tech',
    description: 'Chuyên cung cấp linh kiện, sửa chữa máy y tế',
  },
  {
    id: 's2',
    ownerId: 'u6',
    name: 'Medical Equipment Center',
    lat: 10.776666,
    lng: 106.701666,
    distance: '5.2 km',
    status: 'online',
    rating: 4.5,
    feedback_count: 98,
    products: ['Máy thở', 'Máy X-ray', 'Thiết bị hồi sức'],
    image: 'https://via.placeholder.com/300x200?text=Medical+Center',
    description: 'Cung cấp thiết bị y tế chính hãng',
  },
  {
    id: 's3',
    ownerId: 'u7',
    name: 'Advanced Biotech Solutions',
    lat: 10.8,
    lng: 106.65,
    distance: '8.1 km',
    status: 'offline',
    rating: 4.6,
    feedback_count: 203,
    products: ['Thiết bị chẩn đoán', 'Thiết bị hồi sức', 'Các linh kiện'],
    image: 'https://via.placeholder.com/300x200?text=Biotech',
    description: 'Công ty cổ phần chuyên y sinh',
  },
];

export const mockFeedbacks = [
  {
    id: 'fb1',
    storeId: 's1',
    userId: 'u8',
    author: 'Bệnh viện Chợ Rẫy',
    rating: 5,
    comment: 'Dịch vụ xuất sắc, giao hàng nhanh, chất lượng đảm bảo.',
    date: '2 ngày trước',
    avatar: 'https://i.pravatar.cc/150?u=f042581f4e29026024d',
  },
  {
    id: 'fb2',
    storeId: 's1',
    userId: 'u9',
    author: 'Kỹ sư Hà',
    rating: 4,
    comment: 'Sửa chữa nhanh, nhưng giá hơi cao.',
    date: '5 ngày trước',
    avatar: 'https://i.pravatar.cc/150?u=g042581f4e29026024d',
  },
  {
    id: 'fb3',
    storeId: 's2',
    userId: 'u10',
    author: 'Công ty Sài Gòn',
    rating: 5,
    comment: 'Hàng chính hãng, bảo hành tốt. Sẽ quay lại.',
    date: '1 tuần trước',
    avatar: 'https://i.pravatar.cc/150?u=h042581f4e29026024d',
  },
];

export const mockCommunities = [
  {
    id: 'c1',
    name: 'Hội sửa chữa máy X-Quang',
    description: 'Cộng đồng các kỹ thuật viên, chuyên gia X-Quang chia sẻ kinh nghiệm',
    membersCount: 234,
    tags: ['X-ray', 'Bảo dưỡng', 'Sửa chữa'],
    icon: '🔬',
    members: ['Kỹ sư A', 'Kỹ sư B', 'Bác sĩ C'],
  },
  {
    id: 'c2',
    name: 'Kỹ sư máy thở & Hồi sức',
    description: 'Trao đổi về máy thở, kỹ thuật hồi sức, điều trị tích cực',
    membersCount: 512,
    tags: ['Máy thở', 'Hồi sức', 'Chẩn đoán'],
    icon: '💨',
    members: ['BS Dũng', 'KS Linh', 'BS Hiệp'],
  },
  {
    id: 'c3',
    name: 'Linh kiện điện tử y tế',
    description: 'Chia sẻ về linh kiện, board, cảm biến y tế',
    membersCount: 189,
    tags: ['Linh kiện', 'PCB', 'Cảm biến'],
    icon: '🔌',
    members: ['Kỹ sư Hà', 'Kỹ sư Minh', 'Kỹ sư Hùng'],
  },
  {
    id: 'c4',
    name: 'ECG & Tim mạch',
    description: 'Chuyên sâu về máy ECG, Holter, các thiết bị tim mạch',
    membersCount: 167,
    tags: ['ECG', 'Tim mạch', 'Holter'],
    icon: '❤️',
    members: ['BS Loan', 'KS Sơn', 'KS Hương'],
  },
];

export const mockFiles = [
  {
    id: 'f1',
    communityId: 'c1',
    title: 'Hướng dẫn sửa chữa X-Quang GE Discovery.pdf',
    type: 'pdf',
    size: '45 MB',
    url: '#',
    uploadedBy: 'Kỹ sư A',
    date: '1 tuần trước',
    downloads: 234,
  },
  {
    id: 'f2',
    communityId: 'c1',
    title: 'Service Manual - Siemens YSIO X-Ray.pdf',
    type: 'pdf',
    size: '82 MB',
    url: '#',
    uploadedBy: 'Kỹ sư B',
    date: '2 tuần trước',
    downloads: 456,
  },
  {
    id: 'f3',
    communityId: 'c2',
    title: 'Quy trình hiệu chuẩn máy thở Philips.docx',
    type: 'doc',
    size: '2.3 MB',
    url: '#',
    uploadedBy: 'BS Dũng',
    date: '3 ngày trước',
    downloads: 123,
  },
  {
    id: 'f4',
    communityId: 'c2',
    title: 'Troubleshooting - Lỗi phổ biến máy thở.pdf',
    type: 'pdf',
    size: '15 MB',
    url: '#',
    uploadedBy: 'KS Linh',
    date: '5 ngày trước',
    downloads: 567,
  },
  {
    id: 'f5',
    communityId: 'c3',
    title: 'Datasheet - ECG Sensor Amplifier IC.pdf',
    type: 'pdf',
    size: '3 MB',
    url: '#',
    uploadedBy: 'Kỹ sư Hà',
    date: '1 ngày trước',
    downloads: 89,
  },
];

// Mock heatmap data cho Admin Dashboard
export const mockHeatmapData = [
  { lat: 10.762622, lng: 106.660172, intensity: 0.9, label: 'Quận 1 - Nhu cầu cao' },
  { lat: 10.776666, lng: 106.701666, intensity: 0.4, label: 'Quận 2 - Ít nhu cầu' },
  { lat: 10.8, lng: 106.65, intensity: 0.7, label: 'Quận 3 - Nhu cầu trung bình' },
  { lat: 10.85, lng: 106.7, intensity: 0.2, label: 'Quận 4 - Ít nhu cầu' },
  { lat: 10.73, lng: 106.6, intensity: 0.85, label: 'Quận 5 - Nhu cầu cao' },
];

// Mock analytics cho Admin
export const mockAnalytics = {
  totalUsers: 12543,
  activeStores: 456,
  totalTransactions: 8932,
  averageRating: 4.7,
  trendingKeywords: [
    { keyword: 'Máy thở', searches: 1234, trend: 'up' },
    { keyword: 'Bo mạch ECG', searches: 892, trend: 'up' },
    { keyword: 'X-ray điều trị', searches: 756, trend: 'down' },
    { keyword: 'Cảm biến SpO2', searches: 645, trend: 'up' },
    { keyword: 'Hồi sức', searches: 543, trend: 'stable' },
  ],
  alerts: [
    { id: 'a1', severity: 'high', message: 'Lỗi "Hỏng bo mạch máy thở" tăng 340% tuần này' },
    { id: 'a2', severity: 'medium', message: 'Khu vực Quận 1 thiếu kỹ thuật viên' },
    { id: 'a3', severity: 'low', message: 'Cập nhật mới: Hướng dẫn E-405 X-Quang' },
  ],
};

// Mock data cho OCR search result
export const mockOcrResult = {
  confidence: 95,
  detectedText: 'E-405 ERROR',
  results: [
    {
      type: 'article',
      title: 'Giải quyết lỗi E-405 máy X-Quang',
      snippet: 'Lỗi E-405 thường xuất hiện khi X-ray generator bị lỗi...',
      url: '#',
      timestamp: '2 ngày trước',
    },
    {
      type: 'store',
      name: 'BME Tech Service',
      service: 'Sửa lỗi E-405',
      distance: '2.5 km',
      rating: 4.8,
      url: '#',
    },
    {
      type: 'spare-part',
      name: 'X-ray Generator Module',
      price: '2.500.000 VNĐ',
      store: 'Advanced Medical Store',
      url: '#',
    },
  ],
};

// Mock technicians nearby
export const mockTechniciansNearby = [
  {
    id: 't1',
    name: 'Kỹ sư Hùng',
    specialty: 'Máy X-Quang, ECG',
    distance: '1.2 km',
    rating: 4.9,
    responseTime: '15 phút',
    status: 'online',
    lat: 10.762622,
    lng: 106.660172,
    avatar: 'https://i.pravatar.cc/150?u=t1',
  },
  {
    id: 't2',
    name: 'Kỹ sư Linh',
    specialty: 'Máy thở, Hồi sức',
    distance: '2.1 km',
    rating: 4.7,
    responseTime: '20 phút',
    status: 'online',
    lat: 10.770000,
    lng: 106.665000,
    avatar: 'https://i.pravatar.cc/150?u=t2',
  },
  {
    id: 't3',
    name: 'Kỹ sư Minh',
    specialty: 'Linh kiện, PCB',
    distance: '3.5 km',
    rating: 4.6,
    responseTime: '25 phút',
    status: 'busy',
    lat: 10.755000,
    lng: 106.680000,
    avatar: 'https://i.pravatar.cc/150?u=t3',
  },
];
