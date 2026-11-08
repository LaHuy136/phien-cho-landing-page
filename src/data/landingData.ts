import { LandingConfig } from '../types';

export const AVAILABLE_SERIF_FONTS = [
  { id: 'Beautydisplay', label: 'Beautydisplay (Mặc định cho tiêu đề)', sample: 'Phiên chợ ký ức', class: 'font-serif' },
  { id: 'Cormorant Garamond', label: 'Cormorant Garamond (Nguyên bản Chồ)', sample: 'Phiên chợ ký ức', class: 'font-serif' },
  { id: 'Playfair Display', label: 'Playfair Display (Sang trọng cổ điển)', sample: 'Phiên chợ ký ức', class: 'font-serif' },
  { id: 'Noto Serif', label: 'Noto Serif (Trang nghiêm, mộc mạc)', sample: 'Phiên chợ ký ức', class: 'font-serif' },
  { id: 'Lora', label: 'Lora (Văn chương thi vị)', sample: 'Phiên chợ ký ức', class: 'font-serif' },
  { id: 'Merriweather', label: 'Merriweather (Rõ nét, ấn tượng)', sample: 'Phiên chợ ký ức', class: 'font-serif' },
  { id: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans (Hiện đại không chân)', sample: 'Phiên chợ ký ức', class: 'font-sans' },
];

export const AVAILABLE_SANS_FONTS = [
  { id: 'Haskoy', label: 'Haskoy (Mặc định cho nội dung - Variable Sans)' },
  { id: 'Be Vietnam Pro', label: 'Be Vietnam Pro (Chuẩn tiếng Việt - Bản gốc)' },
  { id: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans (Thanh thoát, hiện đại)' },
  { id: 'DM Sans', label: 'DM Sans (Tinh giản, dễ đọc)' },
  { id: 'Manrope', label: 'Manrope (Cân đối hình học)' },
];

export const CHICKEN_FOOD_PRESETS = [
  { url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=800&q=80', label: 'Gà quê nướng than vàng giòn' },
  { url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80', label: 'Gà ta nướng mật ong thảo mộc' },
  { url: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=800&q=80', label: 'Gà luộc lá chanh muối ớt' },
  { url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80', label: 'Gỏi gà xé phay rau răm' },
  { url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80', label: 'Gà nướng sa tế xiên than hoa' },
  { url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80', label: 'Xôi gà đồi xé thơm dẻo' },
];

export const CURATED_FOOD_PRESETS: Record<string, string[]> = {
  stall1: [
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80', // Spring rolls fresh
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80', // Fresh salad herbs
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80', // Vietnamese rolls
  ],
  stall2: [
    'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=800&q=80', // Gà quê nướng than
    'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=800&q=80', // Gà luộc lá chanh
    'https://images.unsplash.com/photo-1505253758473-96b3015f27eb?auto=format&fit=crop&w=800&q=80', // Bánh quê mộc mạc
    'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=800&q=80', // Bánh nậm bèo lá chuối
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80', // Gỏi gà xé phay
  ],
  stall3: [
    'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80', // Crispy pancake / sizzling
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80', // Sizzling skillet
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80', // Golden crispy food
  ],
  stall4: [
    'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=800&q=80', // Gà nướng than hoa
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80', // Charcoal BBQ skewers / gà sa tế
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80', // Roasted pork & grill
    'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80', // Roast poultry
  ],
  stall5: [
    'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80', // Claypot braised stew / warm soup
    'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80', // Rice & savory pot
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80', // Savory bowl
  ],
  stall6: [
    'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80', // Sweet desserts & puddings
    'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80', // Sweet bowls with coconut
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80', // Sweet treats
  ],
  hero: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80', // Warm atmospheric dining
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80', // Rustic restaurant ambient lanterns
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80', // Evening lantern warmth
  ],
  gallery: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
  ]
};

export const TIMELINE_EVENTS = [
  { time: '17:30', title: 'Cổng chợ mở', desc: 'Mời miếng trầu, trao rổ tre và xu' },
  { time: '18:00', title: 'Khai chợ', desc: 'Tiếng rao cất lên vang một góc sảnh' },
  { time: '18:05', title: 'Đi chợ', desc: 'Từng gánh, từng câu chuyện của nếp quê xứ Quảng' },
  { time: '19:30', title: 'Nâng chén', desc: 'Cả sảnh cùng chạm chén ấm tình ngày cuối năm' },
  { time: '20:00', title: 'Ghi lại ký ức', desc: 'Viết vài dòng lưu bút, chụp ảnh kỷ niệm ở cổng chợ' },
  { time: '20:30', title: 'Tan chợ', desc: 'Tiễn nhau ra cổng, mang theo chút quà quê thơm thảo' },
];

export const FAQS = [
  {
    q: 'Đặt chỗ đi chợ như thế nào?',
    a: 'Bạn điền họ tên, số điện thoại và số lượng vé ở mục "Giữ chỗ đi chợ", sau đó nhấn sao chép thông tin để gửi qua Zalo hoặc Fanpage Chồ Dining. Nhân viên Chồ sẽ gọi điện xác nhận đặt chỗ cho bạn ngay.',
  },
  {
    q: 'Dẫn con trẻ đi cùng có được không?',
    a: 'Rất hoan nghênh cả gia đình. Trẻ từ 6–12 tuổi đi chợ nửa giá (250.000đ), trẻ dưới 6 tuổi đi cùng hoàn toàn miễn phí vé.',
  },
  {
    q: 'Chợ họp ở đâu và có bãi đỗ xe không?',
    a: 'Địa điểm tổ chức tại Nhà hàng Chồ Dining, 202 Trần Bạch Đằng, Đà Nẵng. Nhà hàng có bãi đậu ô tô và xe máy rộng rãi, có nhân viên hướng dẫn tận tình.',
  },
];

export const DEFAULT_LANDING_CONFIG: LandingConfig = {
  fonts: {
    serifFont: 'Beautydisplay',
    sansFont: 'Haskoy',
    fontSizeScale: 1.0,
    headingLetterSpacing: 'normal',
    headingWeight: '600',
  },
  hero: {
    title: 'Phiên chợ ký ức ở Chồ',
    description: 'Mấy ngày cuối năm, người ta thường muốn tìm về một nơi thân thuộc. Tối 22/11, Chồ mở một phiên chợ nhỏ ngay trong sảnh. Nơi đó có gánh hàng rong, có tiếng rao mộc mạc và có người đứng gánh kể câu chuyện xứ Quảng. Mời bạn ghé chơi một phiên chợ chiều để chầm chậm chạm vào nếp xưa.',
    visualType: 'background',
    customImageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80',
    keyVisualUrl: '/images/key_visual.jpg',
    showCountdown: true,
    customTagline: 'Cuối năm, về Chồ gặp nhau.',
    eventDate: '2026-11-22T17:30:00+07:00',
    eventDateFormatted: 'Tối chủ nhật 22/11/2026',
    eventTimeFormatted: '17:30–20:30',
    locationName: 'Nhà hàng Chồ Dining',
    locationAddress: '202 Trần Bạch Đằng, Đà Nẵng',
    priceAdult: 500000,
    priceChildRatio: 0.5,
    totalTickets: 70,
  },
  story: {
    quote: 'Chợ ở quê mình không chỉ để mua bán.',
    paragraph1: 'Ở quê miền Trung, chợ là nơi người ta gặp nhau. Mua cá, mua rau chỉ là chuyện phụ; chuyện chính là hỏi thăm, là nghe ai mới về, là đứng lại ăn một món rồi nói thêm vài câu.',
    paragraph2: 'Phiên chợ ở Chồ mượn cái nếp ấy cho một buổi tối cuối năm. Bạn cầm rổ tre, đi từ gánh này sang gánh khác, đứng ăn, đứng nghe, rồi cả sảnh cùng nâng chén. Chồ không dựng lại chợ xưa. Chồ chỉ muốn mang lại cho bạn cảm giác thân quen ngày cũ, trọn vẹn theo cách của hôm nay.',
  },
  timeline: {
    title: 'Một tối ở phiên chợ',
    subtitle: 'Không sân khấu, không trò chơi ồn ào. Chợ đi theo nhịp tự nhiên của chính nó, bạn cứ thong thả đi theo.',
    events: TIMELINE_EVENTS,
  },
  stallsSection: {
    title: 'Sáu gánh hàng, mỗi gánh một câu chuyện',
    subtitle: 'Người đứng gánh mặc áo bà ba, đội nón lá, rao bằng giọng Quảng mộc mạc. Bạn cứ hỏi, họ sẽ kể tường tận từng món.',
  },
  stallsStyle: 'card-image',
  stalls: [
    {
      id: 'stall1',
      name: 'Gánh gỏi cuốn',
      desc: 'Mở đầu bằng vị chua nhẹ, giòn mát: rau càng cua, gỏi dưa leo, đu đủ bò sấy.',
      sub: 'Và phở cuốn tôm chua',
      color: '#993820',
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'Gánh gỏi cuốn tươi ngon và rau ghém đồng quê',
    },
    {
      id: 'stall2',
      name: 'Gánh quà quê',
      desc: 'Quà chợ của người xứ Quảng: bánh lọc, bánh nậm, bèo tôm cháy, bánh ít.',
      sub: 'Thêm khoai, bắp nướng ăn cho vui miệng',
      color: '#b8602c',
      imageUrl: 'https://images.unsplash.com/photo-1505253758473-96b3015f27eb?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'Gánh quà quê bánh bèo, bánh nậm lá chuối',
    },
    {
      id: 'stall3',
      name: 'Gánh bánh nóng',
      desc: 'Bánh xèo, bánh căn đổ ngay trước mặt, nghe tiếng “xèo” là biết bánh sắp chín.',
      sub: 'Chuối chiên, khoai lang chiên ăn kèm',
      color: '#154f5e',
      imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'Bánh xèo miền Trung giòn rụm trên chảo gang nóng',
    },
    {
      id: 'stall4',
      name: 'Gánh nướng',
      desc: 'Bê thui, heo quay giòn da, tôm sú, mực nướng hẹ, hàu sốt tỏi, gà sa tế: mùi than nướng quen thuộc của một buổi chợ.',
      sub: 'Nướng và dọn ra nóng',
      color: '#8c4a20',
      imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'Gánh nướng thơm lừng trên than hoa đỏ rực',
    },
    {
      id: 'stall5',
      name: 'Gánh mâm nóng',
      desc: 'Bò kho bánh mì, cơm chiên cá nục, mì xào nấm linh chi, thịt kho trứng, cá kho tộ: cái đậm đà của mâm cơm miền Trung.',
      sub: 'Và khoai mì, bắp hấp mật mía',
      color: '#d99c48',
      imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'Mâm cơm nóng hổi, nồi cá kho tộ và bò kho bánh mì',
    },
    {
      id: 'stall6',
      name: 'Gánh ngọt',
      desc: 'Chè ba loại, bánh da heo, bánh thốt nốt, kem bơ.',
      sub: 'Gánh cuối, để bạn ngồi lại lâu hơn một chút',
      color: '#3a2a22',
      imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'Gánh chè ngọt thanh tao, kem bơ béo ngậy cuối phiên',
    },
  ],
  faqs: FAQS,
  gallery: {
    enabled: false,
    title: 'Một góc dòng sông, một dòng ký ức',
    subtitle: 'Không gian Chồ bên dòng sông Hàn, nơi hương vị xưa được giữ gìn trọn vẹn',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        caption: 'Ánh đèn vàng ấm cúng bên bàn gỗ mộc',
      },
      {
        url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        caption: 'Góc gốm đất nung và hương trầu cau chào khách',
      },
      {
        url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        caption: 'Rổ tre và gánh hàng rong mộc mạc',
      },
      {
        url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
        caption: 'Tiếng cười rộn ràng và chén rượu nâng mừng',
      },
    ],
  },
  themePalette: {
    bg: '#f4efe6',
    card: '#fbf7f0',
    ink: '#2a1d19',
    muted: '#6b5a52',
    line: '#dccfbd',
    accent: '#993820',
    deep: '#7d2c19',
    gold: '#d99c48',
    teal: '#154f5e',
  },
};
