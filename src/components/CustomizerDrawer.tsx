import React, { useRef, useState } from 'react';
import {
  FileText,
  Type,
  Image as ImageIcon,
  Sliders,
  Check,
  RotateCcw,
  Upload,
  Eye,
  Download,
  X,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Link as LinkIcon,
  HelpCircle,
  Clock,
  MapPin,
  Calendar,
  Ticket,
  Utensils,
  BookOpen,
} from 'lucide-react';
import {
  AVAILABLE_SERIF_FONTS,
  AVAILABLE_SANS_FONTS,
  CURATED_FOOD_PRESETS,
  DEFAULT_LANDING_CONFIG,
  TIMELINE_EVENTS,
  FAQS,
} from '../data/landingData';
import { LandingConfig, StallItem } from '../types';

interface CustomizerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: LandingConfig;
  onChangeConfig: (newConfig: LandingConfig) => void;
  onEnterPublishMode: () => void;
  onOpenExportModal: () => void;
  editingStallId?: string | null;
  onClearEditingStall?: () => void;
}

export const CustomizerDrawer: React.FC<CustomizerDrawerProps> = ({
  isOpen,
  onClose,
  config,
  onChangeConfig,
  onEnterPublishMode,
  onOpenExportModal,
  editingStallId,
  onClearEditingStall,
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'fonts' | 'images' | 'presets' | 'publish'>('content');
  const [selectedStallId, setSelectedStallId] = useState<string>(editingStallId || config.stalls[0]?.id || 'stall1');
  const [contentSection, setContentSection] = useState<'hero' | 'story' | 'timeline' | 'stalls' | 'faqs'>('hero');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [heroCustomUrl, setHeroCustomUrl] = useState(config.hero.customImageUrl || '');
  const [keyVisualCustomUrl, setKeyVisualCustomUrl] = useState(config.hero.keyVisualUrl || '/images/key_visual.jpg');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const keyVisualFileInputRef = useRef<HTMLInputElement>(null);

  // Update selectedStallId if passed from outside
  React.useEffect(() => {
    if (editingStallId) {
      setSelectedStallId(editingStallId);
      setActiveTab('images');
    }
  }, [editingStallId]);

  if (!isOpen) return null;

  const currentStall = config.stalls.find((s) => s.id === selectedStallId) || config.stalls[0];

  // Font handlers
  const handleSerifChange = (font: string) => {
    onChangeConfig({
      ...config,
      fonts: { ...config.fonts, serifFont: font },
    });
  };

  const handleSansChange = (font: string) => {
    onChangeConfig({
      ...config,
      fonts: { ...config.fonts, sansFont: font },
    });
  };

  const handleFontSizeScale = (scale: number) => {
    onChangeConfig({
      ...config,
      fonts: { ...config.fonts, fontSizeScale: scale },
    });
  };

  // Image handlers for stall
  const updateStallImage = (stallId: string, url: string) => {
    const updatedStalls = config.stalls.map((s) => (s.id === stallId ? { ...s, imageUrl: url } : s));
    onChangeConfig({ ...config, stalls: updatedStalls });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, stallId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateStallImage(stallId, event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeroFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChangeConfig({
            ...config,
            hero: { ...config.hero, customImageUrl: event.target.result as string, visualType: 'image' },
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKeyVisualFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChangeConfig({
            ...config,
            hero: { ...config.hero, keyVisualUrl: event.target.result as string },
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Preset handlers
  const applyPreset = (presetName: string) => {
    if (presetName === 'original') {
      onChangeConfig({
        ...DEFAULT_LANDING_CONFIG,
        stallsStyle: 'minimal-classic',
        hero: { ...DEFAULT_LANDING_CONFIG.hero, visualType: 'background' },
      });
    } else if (presetName === 'hoian') {
      onChangeConfig({
        ...config,
        fonts: {
          ...config.fonts,
          serifFont: 'Playfair Display',
          sansFont: 'Plus Jakarta Sans',
        },
        stallsStyle: 'card-image',
        hero: {
          ...config.hero,
          visualType: 'background',
          customImageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1920&q=80',
        },
      });
    } else if (presetName === 'modern') {
      onChangeConfig({
        ...config,
        fonts: {
          ...config.fonts,
          serifFont: 'Plus Jakarta Sans',
          sansFont: 'Be Vietnam Pro',
        },
        stallsStyle: 'card-image',
        hero: {
          ...config.hero,
          visualType: 'background',
          customImageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80',
        },
      });
    } else if (presetName === 'rustic') {
      onChangeConfig({
        ...config,
        fonts: {
          ...config.fonts,
          serifFont: 'Noto Serif',
          sansFont: 'DM Sans',
        },
        stallsStyle: 'floating-badge',
        hero: {
          ...config.hero,
          visualType: 'background',
          customImageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1920&q=80',
        },
      });
    }
  };

  // Content update helpers
  const updateHeroContent = (field: string, value: any) => {
    onChangeConfig({
      ...config,
      hero: {
        ...config.hero,
        [field]: value,
      },
    });
  };

  const updateStoryContent = (field: 'quote' | 'paragraph1' | 'paragraph2', value: string) => {
    onChangeConfig({
      ...config,
      story: {
        quote: config.story?.quote || 'Chợ ở quê mình không chỉ để mua bán.',
        paragraph1: config.story?.paragraph1 || '',
        paragraph2: config.story?.paragraph2 || '',
        [field]: value,
      },
    });
  };

  const updateTimelineHeader = (field: 'title' | 'subtitle', value: string) => {
    onChangeConfig({
      ...config,
      timeline: {
        title: config.timeline?.title || 'Một tối ở phiên chợ',
        subtitle: config.timeline?.subtitle || '',
        events: config.timeline?.events || TIMELINE_EVENTS,
        [field]: value,
      },
    });
  };

  const updateTimelineEvent = (index: number, field: 'time' | 'title' | 'desc', value: string) => {
    const currentEvents = [...(config.timeline?.events || TIMELINE_EVENTS)];
    currentEvents[index] = {
      ...currentEvents[index],
      [field]: value,
    };
    onChangeConfig({
      ...config,
      timeline: {
        title: config.timeline?.title || 'Một tối ở phiên chợ',
        subtitle: config.timeline?.subtitle || '',
        events: currentEvents,
      },
    });
  };

  const updateStallsSection = (field: 'title' | 'subtitle', value: string) => {
    onChangeConfig({
      ...config,
      stallsSection: {
        title: config.stallsSection?.title || 'Sáu gánh hàng, mỗi gánh một câu chuyện',
        subtitle: config.stallsSection?.subtitle || '',
        [field]: value,
      },
    });
  };

  const updateStallText = (stallId: string, field: 'name' | 'desc' | 'sub', value: string) => {
    const updatedStalls = config.stalls.map((s) => (s.id === stallId ? { ...s, [field]: value } : s));
    onChangeConfig({ ...config, stalls: updatedStalls });
  };

  const updateFaq = (index: number, field: 'q' | 'a', value: string) => {
    const currentFaqs = [...(config.faqs || FAQS)];
    currentFaqs[index] = {
      ...currentFaqs[index],
      [field]: value,
    };
    onChangeConfig({
      ...config,
      faqs: currentFaqs,
    });
  };

  const resetContentToDefault = () => {
    onChangeConfig({
      ...config,
      hero: {
        ...config.hero,
        title: DEFAULT_LANDING_CONFIG.hero.title,
        customTagline: DEFAULT_LANDING_CONFIG.hero.customTagline,
        description: DEFAULT_LANDING_CONFIG.hero.description,
        eventDateFormatted: DEFAULT_LANDING_CONFIG.hero.eventDateFormatted,
        eventTimeFormatted: DEFAULT_LANDING_CONFIG.hero.eventTimeFormatted,
        locationName: DEFAULT_LANDING_CONFIG.hero.locationName,
        locationAddress: DEFAULT_LANDING_CONFIG.hero.locationAddress,
        priceAdult: DEFAULT_LANDING_CONFIG.hero.priceAdult,
        totalTickets: DEFAULT_LANDING_CONFIG.hero.totalTickets,
      },
      story: DEFAULT_LANDING_CONFIG.story,
      timeline: DEFAULT_LANDING_CONFIG.timeline,
      stallsSection: DEFAULT_LANDING_CONFIG.stallsSection,
      stalls: config.stalls.map((s, idx) => ({
        ...s,
        name: DEFAULT_LANDING_CONFIG.stalls[idx]?.name || s.name,
        desc: DEFAULT_LANDING_CONFIG.stalls[idx]?.desc || s.desc,
        sub: DEFAULT_LANDING_CONFIG.stalls[idx]?.sub || s.sub,
      })),
      faqs: DEFAULT_LANDING_CONFIG.faqs,
    });
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white text-stone-800 shadow-2xl transition-all duration-300 border-l border-stone-200">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-stone-200 bg-stone-50 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Sliders className="h-5 w-5 text-amber-700" />
          <h2 className="text-base font-bold text-stone-900">Tùy chỉnh Giao diện</h2>
        </div>
        <button
          onClick={() => {
            onClose();
            if (onClearEditingStall) onClearEditingStall();
          }}
          className="rounded-lg p-1.5 text-stone-500 hover:bg-stone-200 hover:text-stone-900 transition"
          title="Đóng bảng tùy chỉnh"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation Tabs (5 Tabs) */}
      <div className="grid grid-cols-5 border-b border-stone-200 bg-white text-xs font-semibold">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex flex-col items-center gap-1 py-3 px-1 border-b-2 transition ${
            activeTab === 'content'
              ? 'border-amber-700 text-amber-800 bg-amber-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Nội dung</span>
        </button>

        <button
          onClick={() => setActiveTab('fonts')}
          className={`flex flex-col items-center gap-1 py-3 px-1 border-b-2 transition ${
            activeTab === 'fonts'
              ? 'border-amber-700 text-amber-800 bg-amber-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Type className="h-4 w-4" />
          <span>Font chữ</span>
        </button>

        <button
          onClick={() => setActiveTab('images')}
          className={`flex flex-col items-center gap-1 py-3 px-1 border-b-2 transition ${
            activeTab === 'images'
              ? 'border-amber-700 text-amber-800 bg-amber-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <ImageIcon className="h-4 w-4" />
          <span>Hình ảnh</span>
        </button>

        <button
          onClick={() => setActiveTab('presets')}
          className={`flex flex-col items-center gap-1 py-3 px-1 border-b-2 transition ${
            activeTab === 'presets'
              ? 'border-amber-700 text-amber-800 bg-amber-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>Mẫu sẵn</span>
        </button>

        <button
          onClick={() => setActiveTab('publish')}
          className={`flex flex-col items-center gap-1 py-3 px-1 border-b-2 transition ${
            activeTab === 'publish'
              ? 'border-amber-700 text-amber-800 bg-amber-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Eye className="h-4 w-4" />
          <span>Publish</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* TAB 0: CONTENT EDITING */}
        {activeTab === 'content' && (
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Tùy chỉnh nội dung chữ trên trang
                </label>
                <button
                  type="button"
                  onClick={resetContentToDefault}
                  className="text-[11px] text-amber-700 hover:text-amber-900 underline flex items-center gap-1"
                  title="Khôi phục văn bản mẫu ban đầu"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Mẫu gốc</span>
                </button>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                Nhập văn bản bên dưới để cập nhật tiêu đề, mô tả, ngày giờ, địa điểm và danh sách món ăn theo thực tế.
              </p>

              {/* Section Sub-tabs */}
              <div className="mt-3 flex flex-wrap gap-1.5 p-1 bg-stone-100 rounded-lg text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setContentSection('hero')}
                  className={`px-2.5 py-1.5 rounded-md transition ${
                    contentSection === 'hero'
                      ? 'bg-white text-amber-900 shadow-xs font-bold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Sự kiện & Hero
                </button>
                <button
                  type="button"
                  onClick={() => setContentSection('story')}
                  className={`px-2.5 py-1.5 rounded-md transition ${
                    contentSection === 'story'
                      ? 'bg-white text-amber-900 shadow-xs font-bold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Câu chuyện
                </button>
                <button
                  type="button"
                  onClick={() => setContentSection('timeline')}
                  className={`px-2.5 py-1.5 rounded-md transition ${
                    contentSection === 'timeline'
                      ? 'bg-white text-amber-900 shadow-xs font-bold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Lịch trình
                </button>
                <button
                  type="button"
                  onClick={() => setContentSection('stalls')}
                  className={`px-2.5 py-1.5 rounded-md transition ${
                    contentSection === 'stalls'
                      ? 'bg-white text-amber-900 shadow-xs font-bold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  6 Gánh hàng
                </button>
                <button
                  type="button"
                  onClick={() => setContentSection('faqs')}
                  className={`px-2.5 py-1.5 rounded-md transition ${
                    contentSection === 'faqs'
                      ? 'bg-white text-amber-900 shadow-xs font-bold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Hỏi đáp
                </button>
              </div>
            </div>

            {/* Sub-section 1: Hero & Event details */}
            {contentSection === 'hero' && (
              <div className="space-y-4 rounded-xl border border-stone-200 bg-stone-50/70 p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-900">
                  <Calendar className="h-4 w-4" />
                  <span>Thông tin Sự kiện & Phần mở đầu</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Tên sự kiện / Tiêu đề chính
                  </label>
                  <input
                    type="text"
                    value={config.hero.title ?? 'Phiên chợ ký ức ở Chồ'}
                    onChange={(e) => updateHeroContent('title', e.target.value)}
                    className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-xs focus:border-amber-700 focus:outline-none"
                    placeholder="VD: Phiên chợ ký ức ở Chồ"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Câu đề từ (Tagline)
                  </label>
                  <input
                    type="text"
                    value={config.hero.customTagline ?? 'Cuối năm, về Chồ gặp nhau.'}
                    onChange={(e) => updateHeroContent('customTagline', e.target.value)}
                    className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-xs focus:border-amber-700 focus:outline-none"
                    placeholder="VD: Cuối năm, về Chồ gặp nhau."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Đoạn văn giới thiệu sự kiện
                  </label>
                  <textarea
                    rows={4}
                    value={
                      config.hero.description ??
                      'Mấy ngày cuối năm, người ta thường muốn tìm về một nơi thân thuộc. Tối 24/11, Chồ mở một phiên chợ nhỏ ngay trong sảnh. Nơi đó có gánh hàng rong, có tiếng rao mộc mạc và có người đứng gánh kể câu chuyện xứ Quảng. Mời bạn ghé chơi một phiên chợ chiều để chầm chậm chạm vào nếp xưa.'
                    }
                    onChange={(e) => updateHeroContent('description', e.target.value)}
                    className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-xs focus:border-amber-700 focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Ngày diễn ra (Hiển thị)
                    </label>
                    <input
                      type="text"
                      value={config.hero.eventDateFormatted ?? 'Tối thứ Ba 24/11/2026'}
                      onChange={(e) => updateHeroContent('eventDateFormatted', e.target.value)}
                      className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-xs focus:border-amber-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Khung giờ
                    </label>
                    <input
                      type="text"
                      value={config.hero.eventTimeFormatted ?? '17:30–20:30'}
                      onChange={(e) => updateHeroContent('eventTimeFormatted', e.target.value)}
                      className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-xs focus:border-amber-700 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Tên địa điểm
                    </label>
                    <input
                      type="text"
                      value={config.hero.locationName ?? 'Nhà hàng Chồ Dining'}
                      onChange={(e) => updateHeroContent('locationName', e.target.value)}
                      className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-xs focus:border-amber-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Địa chỉ
                    </label>
                    <input
                      type="text"
                      value={config.hero.locationAddress ?? '202–204 Trần Bạch Đằng, Đà Nẵng'}
                      onChange={(e) => updateHeroContent('locationAddress', e.target.value)}
                      className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-xs focus:border-amber-700 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Giá vé người lớn (VNĐ)
                    </label>
                    <input
                      type="number"
                      step={50000}
                      value={config.hero.priceAdult ?? 500000}
                      onChange={(e) => updateHeroContent('priceAdult', Number(e.target.value))}
                      className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-xs focus:border-amber-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Giới hạn số vé
                    </label>
                    <input
                      type="number"
                      value={config.hero.totalTickets ?? 70}
                      onChange={(e) => updateHeroContent('totalTickets', Number(e.target.value))}
                      className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-xs focus:border-amber-700 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Sub-section 2: Story Section */}
            {contentSection === 'story' && (
              <div className="space-y-4 rounded-xl border border-stone-200 bg-stone-50/70 p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-900">
                  <BookOpen className="h-4 w-4" />
                  <span>Câu chuyện Chồ (Section tự sự)</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Câu trích dẫn nổi bật
                  </label>
                  <textarea
                    rows={2}
                    value={config.story?.quote ?? 'Chợ ở quê mình không chỉ để mua bán.'}
                    onChange={(e) => updateStoryContent('quote', e.target.value)}
                    className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-xs focus:border-amber-700 focus:outline-none italic"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Đoạn văn 1
                  </label>
                  <textarea
                    rows={3}
                    value={
                      config.story?.paragraph1 ??
                      'Ở quê miền Trung, chợ là nơi người ta gặp nhau. Mua cá, mua rau chỉ là chuyện phụ; chuyện chính là hỏi thăm, là nghe ai mới về, là đứng lại ăn một món rồi nói thêm vài câu.'
                    }
                    onChange={(e) => updateStoryContent('paragraph1', e.target.value)}
                    className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-xs focus:border-amber-700 focus:outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Đoạn văn 2
                  </label>
                  <textarea
                    rows={4}
                    value={
                      config.story?.paragraph2 ??
                      'Phiên chợ ở Chồ mượn cái nếp ấy cho một buổi tối cuối năm. Bạn cầm rổ tre, đi từ gánh này sang gánh khác, đứng ăn, đứng nghe, rồi cả sảnh cùng nâng chén. Chồ không dựng lại chợ xưa. Chồ chỉ muốn mang lại cho bạn cảm giác thân quen ngày cũ, trọn vẹn theo cách của hôm nay.'
                    }
                    onChange={(e) => updateStoryContent('paragraph2', e.target.value)}
                    className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-xs focus:border-amber-700 focus:outline-none leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* Sub-section 3: Timeline */}
            {contentSection === 'timeline' && (
              <div className="space-y-4 rounded-xl border border-stone-200 bg-stone-50/70 p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-900">
                  <Clock className="h-4 w-4" />
                  <span>Lịch trình phiên chợ</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Tiêu đề mục lịch trình
                  </label>
                  <input
                    type="text"
                    value={config.timeline?.title ?? 'Một tối ở phiên chợ'}
                    onChange={(e) => updateTimelineHeader('title', e.target.value)}
                    className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-xs focus:border-amber-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Mô tả phụ
                  </label>
                  <input
                    type="text"
                    value={
                      config.timeline?.subtitle ??
                      'Không sân khấu, không trò chơi ồn ào. Chợ đi theo nhịp tự nhiên của chính nó, bạn cứ thong thả đi theo.'
                    }
                    onChange={(e) => updateTimelineHeader('subtitle', e.target.value)}
                    className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-xs focus:border-amber-700 focus:outline-none"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <span className="block text-xs font-bold text-stone-600 uppercase tracking-wider">
                    Các mốc thời gian:
                  </span>
                  {(config.timeline?.events ?? TIMELINE_EVENTS).map((event, idx) => (
                    <div key={idx} className="rounded-lg border border-stone-200 bg-white p-3 space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[11px] text-stone-500">Giờ</label>
                          <input
                            type="text"
                            value={event.time}
                            onChange={(e) => updateTimelineEvent(idx, 'time', e.target.value)}
                            className="w-full rounded border border-stone-300 px-2 py-1 text-xs font-bold text-amber-800"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[11px] text-stone-500">Tên mốc</label>
                          <input
                            type="text"
                            value={event.title}
                            onChange={(e) => updateTimelineEvent(idx, 'title', e.target.value)}
                            className="w-full rounded border border-stone-300 px-2 py-1 text-xs font-semibold"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] text-stone-500">Chi tiết hoạt động</label>
                        <input
                          type="text"
                          value={event.desc}
                          onChange={(e) => updateTimelineEvent(idx, 'desc', e.target.value)}
                          className="w-full rounded border border-stone-300 px-2 py-1 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-section 4: Food Stalls */}
            {contentSection === 'stalls' && (
              <div className="space-y-4 rounded-xl border border-stone-200 bg-stone-50/70 p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-900">
                  <Utensils className="h-4 w-4" />
                  <span>Sáu gánh hàng rong</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Tiêu đề phần gánh hàng
                  </label>
                  <input
                    type="text"
                    value={config.stallsSection?.title ?? 'Sáu gánh hàng, mỗi gánh một câu chuyện'}
                    onChange={(e) => updateStallsSection('title', e.target.value)}
                    className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-xs focus:border-amber-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Lời dẫn
                  </label>
                  <textarea
                    rows={2}
                    value={
                      config.stallsSection?.subtitle ??
                      'Người đứng gánh mặc áo bà ba, đội nón lá, rao bằng giọng Quảng mộc mạc. Bạn cứ hỏi, họ sẽ kể tường tận từng món.'
                    }
                    onChange={(e) => updateStallsSection('subtitle', e.target.value)}
                    className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-xs focus:border-amber-700 focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <span className="block text-xs font-bold text-stone-600 uppercase tracking-wider">
                    Chi tiết từng gánh (1 đến 6):
                  </span>
                  {config.stalls.map((stall, idx) => (
                    <div key={stall.id} className="rounded-lg border border-stone-200 bg-white p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-800">
                          Gánh 0{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStallId(stall.id);
                            setActiveTab('images');
                          }}
                          className="text-[11px] text-amber-700 underline hover:text-amber-900"
                        >
                          Đổi ảnh gánh này
                        </button>
                      </div>

                      <div>
                        <label className="block text-[11px] text-stone-500">Tên gánh</label>
                        <input
                          type="text"
                          value={stall.name}
                          onChange={(e) => updateStallText(stall.id, 'name', e.target.value)}
                          className="w-full rounded border border-stone-300 px-2 py-1 text-xs font-bold text-stone-900"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-stone-500">Mô tả món ăn</label>
                        <textarea
                          rows={2}
                          value={stall.desc}
                          onChange={(e) => updateStallText(stall.id, 'desc', e.target.value)}
                          className="w-full rounded border border-stone-300 px-2 py-1 text-xs text-stone-700 leading-relaxed"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-stone-500">Món ăn kèm / Ghi chú</label>
                        <input
                          type="text"
                          value={stall.sub}
                          onChange={(e) => updateStallText(stall.id, 'sub', e.target.value)}
                          className="w-full rounded border border-stone-300 px-2 py-1 text-xs text-stone-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-section 5: FAQs */}
            {contentSection === 'faqs' && (
              <div className="space-y-4 rounded-xl border border-stone-200 bg-stone-50/70 p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-900">
                  <HelpCircle className="h-4 w-4" />
                  <span>Hỏi đáp thường gặp (FAQ)</span>
                </div>

                <div className="space-y-3">
                  {(config.faqs ?? FAQS).map((faq, idx) => (
                    <div key={idx} className="rounded-lg border border-stone-200 bg-white p-3 space-y-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-600">
                          Câu hỏi {idx + 1}
                        </label>
                        <input
                          type="text"
                          value={faq.q}
                          onChange={(e) => updateFaq(idx, 'q', e.target.value)}
                          className="w-full rounded border border-stone-300 px-2 py-1 text-xs font-semibold text-amber-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-stone-500">Câu trả lời</label>
                        <textarea
                          rows={3}
                          value={faq.a}
                          onChange={(e) => updateFaq(idx, 'a', e.target.value)}
                          className="w-full rounded border border-stone-300 px-2 py-1 text-xs text-stone-700 leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 1: FONTS */}
        {activeTab === 'fonts' && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Font chữ tiêu đề & Điểm nhấn (Serif / Display)
              </label>
              <div className="space-y-2">
                {AVAILABLE_SERIF_FONTS.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => handleSerifChange(font.id)}
                    className={`w-full flex items-center justify-between rounded-xl border p-3 text-left transition ${
                      config.fonts.serifFont === font.id
                        ? 'border-amber-700 bg-amber-50 text-amber-950 ring-1 ring-amber-700'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-800'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-semibold">{font.label}</div>
                      <div
                        className="text-xs text-stone-500 mt-0.5"
                        style={{ fontFamily: font.id }}
                      >
                        Nét chữ mẫu: &ldquo;{font.sample}&rdquo;
                      </div>
                    </div>
                    {config.fonts.serifFont === font.id && (
                      <Check className="h-4 w-4 text-amber-700 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Font chữ nội dung (Body / Sans)
              </label>
              <div className="space-y-2">
                {AVAILABLE_SANS_FONTS.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => handleSansChange(font.id)}
                    className={`w-full flex items-center justify-between rounded-xl border p-3 text-left transition ${
                      config.fonts.sansFont === font.id
                        ? 'border-amber-700 bg-amber-50 text-amber-950 ring-1 ring-amber-700'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-800'
                    }`}
                  >
                    <span className="text-sm font-medium">{font.label}</span>
                    {config.fonts.sansFont === font.id && (
                      <Check className="h-4 w-4 text-amber-700 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Tỷ lệ kích thước chữ (Font Scale)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { scale: 0.95, label: 'Nhỏ gọn (95%)' },
                  { scale: 1.0, label: 'Chuẩn (100%)' },
                  { scale: 1.1, label: 'Lớn rõ (110%)' },
                ].map((item) => (
                  <button
                    key={item.scale}
                    onClick={() => handleFontSizeScale(item.scale)}
                    className={`rounded-lg border py-2 text-xs font-semibold transition ${
                      config.fonts.fontSizeScale === item.scale
                        ? 'border-amber-700 bg-amber-700 text-white'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: IMAGES */}
        {activeTab === 'images' && (
          <div className="space-y-6">
            {/* Section 1: Event Key Visual Poster (Right Column) */}
            <div className="rounded-xl border border-stone-200 p-4 bg-stone-50/50">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                Key Visual Sự Kiện (Poster cột phải Section 1)
              </label>

              <div className="flex gap-3 items-center mb-3">
                <div className="relative h-20 w-16 overflow-hidden rounded-lg border border-amber-300 shadow-xs shrink-0">
                  <img
                    src={config.hero.keyVisualUrl || '/images/key_visual.jpg'}
                    alt="Key Visual Preview"
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <div className="text-xs text-stone-600 flex-1">
                  <p className="font-semibold text-stone-900">Poster chính thức sự kiện</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">Key visual nghệ thuật gánh hàng rong bên sông Hàn</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={keyVisualCustomUrl}
                    onChange={(e) => {
                      setKeyVisualCustomUrl(e.target.value);
                      onChangeConfig({
                        ...config,
                        hero: { ...config.hero, keyVisualUrl: e.target.value },
                      });
                    }}
                    placeholder="Dán link ảnh Key Visual..."
                    className="flex-1 rounded-lg border border-stone-300 px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-700"
                  />
                  <button
                    type="button"
                    onClick={() => keyVisualFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1 rounded-lg border border-stone-300 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-100 cursor-pointer"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Tải ảnh</span>
                  </button>
                  <input
                    ref={keyVisualFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleKeyVisualFileUpload}
                  />
                </div>
              </div>
            </div>

            {/* Section 1: Hero Background Image */}
            <div className="rounded-xl border border-stone-200 p-4 bg-stone-50/50">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                Ảnh background Section 1 (Hero Banner)
              </label>

              {/* Preset Background Images */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[
                  {
                    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80',
                    label: 'Không gian Chồ ấm áp',
                  },
                  {
                    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1920&q=80',
                    label: 'Đèn lồng phố Hội',
                  },
                  {
                    url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1920&q=80',
                    label: 'Bến sông chiều tối',
                  },
                  {
                    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1920&q=80',
                    label: 'Gánh hàng rong quê',
                  },
                ].map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => {
                      setHeroCustomUrl(preset.url);
                      onChangeConfig({
                        ...config,
                        hero: { ...config.hero, visualType: 'background', customImageUrl: preset.url },
                      });
                    }}
                    className={`group relative h-20 overflow-hidden rounded-lg border text-left transition ${
                      config.hero.customImageUrl === preset.url
                        ? 'border-amber-700 ring-2 ring-amber-600'
                        : 'border-stone-300 hover:border-amber-600'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="h-full w-full object-cover group-hover:scale-105 transition"
                    />
                    <div className="absolute inset-0 bg-black/45 flex items-end p-1.5">
                      <span className="text-[11px] font-semibold text-white drop-shadow-xs">
                        {preset.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Image URL or Upload */}
              <div className="space-y-2 mt-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={heroCustomUrl}
                    onChange={(e) => {
                      setHeroCustomUrl(e.target.value);
                      onChangeConfig({
                        ...config,
                        hero: { ...config.hero, visualType: 'background', customImageUrl: e.target.value },
                      });
                    }}
                    placeholder="Dán link ảnh background Section 1..."
                    className="flex-1 rounded-lg border border-stone-300 px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-700"
                  />
                  <button
                    type="button"
                    onClick={() => heroFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1 rounded-lg border border-stone-300 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-100"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Tải ảnh</span>
                  </button>
                  <input
                    ref={heroFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleHeroFileUpload}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Stall Layout Style */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Kiểu hiển thị ảnh của 6 gánh hàng
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'card-image', label: 'Ảnh bìa trên' },
                  { id: 'floating-badge', label: 'Huy hiệu tròn' },
                  { id: 'minimal-classic', label: 'Tối giản (Bản gốc)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      onChangeConfig({
                        ...config,
                        stallsStyle: item.id as any,
                      })
                    }
                    className={`rounded-lg border p-2 text-xs font-medium text-center transition ${
                      config.stallsStyle === item.id
                        ? 'border-amber-700 bg-amber-700 text-white'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Section 3: Select Stall to edit */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Chọn gánh để thay đổi ảnh
              </label>
              <div className="grid grid-cols-3 gap-2">
                {config.stalls.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStallId(s.id)}
                    className={`rounded-lg border p-2 text-left text-xs transition ${
                      selectedStallId === s.id
                        ? 'border-amber-700 bg-amber-50 font-bold text-amber-900 ring-1 ring-amber-700'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className="text-[10px] text-stone-400">Gánh {idx + 1}</div>
                    <div className="truncate">{s.name.replace('Gánh ', '')}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Current Stall Image Configuration Box */}
            {currentStall && (
              <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-stone-900">{currentStall.name}</h3>
                  <span className="text-xs text-stone-500">Mã: {currentStall.id}</span>
                </div>

                {/* Preview Thumbnail */}
                {currentStall.imageUrl && (
                  <div className="relative h-32 w-full overflow-hidden rounded-lg border border-stone-200">
                    <img
                      src={currentStall.imageUrl}
                      alt={currentStall.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-1 right-2 rounded bg-black/60 px-2 py-0.5 text-[10px] text-white">
                      Ảnh đang dùng
                    </div>
                  </div>
                )}

                {/* File Upload Button */}
                <div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-amber-300 bg-white py-2.5 text-xs font-semibold text-amber-900 hover:bg-amber-100/60 transition cursor-pointer"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Tải ảnh từ máy tính của bạn</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, currentStall.id)}
                  />
                  <p className="mt-1 text-[11px] text-stone-500 text-center">
                    Ảnh tải lên sẽ hiển thị trực tiếp ngay trên trang web.
                  </p>
                </div>

                {/* URL Input */}
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-stone-600">
                    Hoặc dán link ảnh (URL) trực tiếp:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      placeholder="https://example.com/anh-mon-an.jpg"
                      className="flex-1 rounded-lg border border-stone-300 px-3 py-1.5 text-xs text-stone-800"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customUrlInput.trim()) {
                          updateStallImage(currentStall.id, customUrlInput.trim());
                          setCustomUrlInput('');
                        }
                      }}
                      className="rounded-lg bg-amber-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-800 transition"
                    >
                      Áp dụng
                    </button>
                  </div>
                </div>

                {/* Presets for this stall */}
                {CURATED_FOOD_PRESETS[currentStall.id] && (
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1.5">
                      Gợi ý ảnh chụp ẩm thực phù hợp:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {CURATED_FOOD_PRESETS[currentStall.id].map((url, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => updateStallImage(currentStall.id, url)}
                          className={`relative h-16 overflow-hidden rounded-lg border transition ${
                            currentStall.imageUrl === url
                              ? 'ring-2 ring-amber-700 border-amber-700'
                              : 'border-stone-200 hover:opacity-80'
                          }`}
                        >
                          <img
                            src={url}
                            alt="Preset"
                            className="h-full w-full object-cover"
                          />
                          {currentStall.imageUrl === url && (
                            <div className="absolute inset-0 bg-amber-900/40 flex items-center justify-center">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PRESETS */}
        {activeTab === 'presets' && (
          <div className="space-y-4">
            <p className="text-xs text-stone-500">
              Chọn nhanh một phong cách thẩm mỹ đã được phối sẵn chuẩn xác:
            </p>

            <button
              onClick={() => applyPreset('original')}
              className="w-full flex items-center justify-between rounded-xl border border-stone-200 p-4 text-left hover:border-amber-700 hover:bg-amber-50/50 transition group"
            >
              <div>
                <h4 className="text-sm font-bold text-stone-900">1. Không gian Chồ Ấm Cúng</h4>
                <p className="text-xs text-stone-500 mt-1">
                  Font Beautydisplay trang nhã kết hợp Haskoy mộc mạc, cùng ảnh background tràn viền ấm áp.
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-stone-400 group-hover:text-amber-700 shrink-0" />
            </button>

            <button
              onClick={() => applyPreset('hoian')}
              className="w-full flex items-center justify-between rounded-xl border border-stone-200 p-4 text-left hover:border-amber-700 hover:bg-amber-50/50 transition group"
            >
              <div>
                <h4 className="text-sm font-bold text-stone-900">2. Phố Hội Hoài Cổ</h4>
                <p className="text-xs text-stone-500 mt-1">
                  Font Playfair Display thanh lịch kết hợp Plus Jakarta Sans, ảnh các gánh hàng ẩm thực sinh động.
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-stone-400 group-hover:text-amber-700 shrink-0" />
            </button>

            <button
              onClick={() => applyPreset('rustic')}
              className="w-full flex items-center justify-between rounded-xl border border-stone-200 p-4 text-left hover:border-amber-700 hover:bg-amber-50/50 transition group"
            >
              <div>
                <h4 className="text-sm font-bold text-stone-900">3. Đất Quảng Trầm Mặc</h4>
                <p className="text-xs text-stone-500 mt-1">
                  Font Noto Serif truyền thống, huy hiệu ảnh tròn tinh tế, không gian ven sông trầm lắng.
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-stone-400 group-hover:text-amber-700 shrink-0" />
            </button>

            <button
              onClick={() => applyPreset('modern')}
              className="w-full flex items-center justify-between rounded-xl border border-stone-200 p-4 text-left hover:border-amber-700 hover:bg-amber-50/50 transition group"
            >
              <div>
                <h4 className="text-sm font-bold text-stone-900">4. Ẩm Thực Hiện Đại</h4>
                <p className="text-xs text-stone-500 mt-1">
                  Typography Plus Jakarta Sans sắc nét, banner hình ảnh toàn cảnh nhà hàng sang trọng.
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-stone-400 group-hover:text-amber-700 shrink-0" />
            </button>
          </div>
        )}

        {/* TAB 4: PUBLISH & REMOVE CUSTOMIZER */}
        {activeTab === 'publish' && (
          <div className="space-y-5">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm mb-1">
                <Check className="h-4 w-4" />
                <span>Bạn đã tùy chỉnh xong?</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Đúng theo yêu cầu của bạn: sau khi tùy chỉnh font và hình ảnh, bạn có thể chuyển ngay sang chế độ xuất bản để toàn bộ thanh công cụ biến mất, trả lại trang landing sạch sẽ, chuyên nghiệp 100%.
              </p>
            </div>

            <button
              type="button"
              onClick={onEnterPublishMode}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-700 py-3.5 px-4 text-sm font-bold text-white shadow-md hover:bg-amber-800 transition active:scale-[0.99] cursor-pointer"
            >
              <Eye className="h-4 w-4" />
              <span>Bỏ công cụ tùy chỉnh & Xem trang Publish</span>
            </button>

            <div className="pt-2 border-t border-stone-200 space-y-2">
              <button
                type="button"
                onClick={onOpenExportModal}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-stone-50 py-2.5 px-4 text-xs font-semibold text-stone-800 hover:bg-stone-100 transition"
              >
                <Download className="h-4 w-4" />
                <span>Xuất file HTML hoàn chỉnh / Sao chép mã nguồn</span>
              </button>

              <button
                type="button"
                onClick={() => onChangeConfig(DEFAULT_LANDING_CONFIG)}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-stone-200 py-2.5 px-4 text-xs font-medium text-stone-600 hover:text-stone-900 transition"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Khôi phục cài đặt gốc ban đầu</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer action bar */}
      <div className="border-t border-stone-200 bg-stone-50 p-4 flex items-center justify-between">
        <button
          onClick={onEnterPublishMode}
          className="text-xs font-bold text-amber-800 hover:underline inline-flex items-center gap-1"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>Chuyển sang chế độ Publish</span>
        </button>

        <button
          onClick={() => {
            onClose();
            if (onClearEditingStall) onClearEditingStall();
          }}
          className="rounded-lg bg-stone-900 px-4 py-2 text-xs font-semibold text-white hover:bg-stone-800 transition"
        >
          Đóng lại
        </button>
      </div>
    </div>
  );
};
