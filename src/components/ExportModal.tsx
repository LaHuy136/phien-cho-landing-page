import React, { useState } from 'react';
import { X, Check, Copy, Download, Globe, Server, ShieldAlert, Sparkles, ExternalLink, HelpCircle } from 'lucide-react';
import { LandingConfig } from '../types';
import { FAQS, TIMELINE_EVENTS } from '../data/landingData';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: LandingConfig;
  onEnterPublishMode: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  config,
  onEnterPublishMode,
}) => {
  const [activeTab, setActiveTab] = useState<'dns' | 'html' | 'json'>('dns');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [subdomainChoice, setSubdomainChoice] = useState<'subdomain' | 'root'>('subdomain');
  const [subdomainName, setSubdomainName] = useState('phiencho');

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
      });
    }
  };

  // Generate full, standalone production HTML file with user fonts, images and content
  const generateStandaloneHtml = () => {
    const customBg = config.hero.customImageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80';
    const keyVisual = config.hero.keyVisualUrl || '/images/key_visual.jpg';

    return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${config.hero.title || 'Phiên chợ ký ức ở Chồ'} — Tối 24/11</title>
  <meta name="description" content="${config.hero.description || 'Phiên chợ ký ức ở Chồ Dining - Đà Nẵng'}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <style>
    @font-face {
      font-family: 'Beautydisplay';
      src: url('https://db.onlinewebfonts.com/t/08ee0bdd19b93bb20a3ce6c8be5ebf8b.woff2') format('woff2');
      font-weight: 100 900;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'Haskoy';
      src: url('https://raw.githubusercontent.com/ertekinno/haskoy/main/fonts/woff2/Haskoy-variable.woff2') format('woff2-variations');
      font-weight: 100 900;
      font-style: normal;
      font-display: swap;
    }
    :root {
      --bg: #f4efe6;
      --card: #fbf7f0;
      --ink: #2a1d19;
      --muted: #6b5a52;
      --line: #dccfbd;
      --accent: #993820;
      --deep: #7d2c19;
      --gold: #d99c48;
      --serif: "Beautydisplay", "Beauty Display", "Cormorant Garamond", Georgia, serif;
      --sans: "Haskoy", "Be Vietnam Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      background-image: url('/assets/aistudio/image_f227f726.png');
      background-repeat: repeat;
      background-size: 520px auto;
      color: var(--ink);
      font-family: var(--sans);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    .wrap { max-width: 1140px; margin: 0 auto; padding: 0 20px; }
    h1, h2, h3, h4, .serif { font-family: var(--serif); font-weight: normal; }
    .hero {
      position: relative;
      background-color: var(--deep);
      color: #f6ece0;
      padding: 70px 0 60px;
      overflow: hidden;
    }
    .hero-bg {
      position: absolute;
      inset: 0;
      background-image: linear-gradient(to right, rgba(24,6,3,0.95), rgba(43,12,5,0.85), rgba(24,6,3,0.7)), url('${customBg}');
      background-size: cover;
      background-position: center;
      z-index: 0;
    }
    .hero-content {
      position: relative;
      z-index: 10;
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 40px;
      align-items: center;
    }
    .tagline { color: var(--gold); font-size: 1.25rem; font-style: italic; margin-bottom: 12px; }
    .hero h1 { font-size: clamp(2.4rem, 5vw, 4rem); line-height: 1.15; margin-bottom: 16px; }
    .hero p { font-size: 1.05rem; opacity: 0.92; margin-bottom: 24px; line-height: 1.6; }
    .hero-facts { display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; font-size: 0.95rem; }
    .hero-facts b { color: #fff; }
    .hero-btns { display: flex; gap: 12px; flex-wrap: wrap; }
    .btn {
      display: inline-block;
      padding: 12px 26px;
      border-radius: 999px;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      font-size: 0.95rem;
      transition: all 0.2s;
    }
    .btn-gold { background: var(--gold); color: #2a1d19; border: none; }
    .btn-gold:hover { filter: brightness(1.1); transform: translateY(-1px); }
    .btn-ghost { border: 2px solid var(--gold); color: #f6ece0; background: rgba(0,0,0,0.3); }
    .btn-ghost:hover { background: rgba(255,255,255,0.1); }
    .hero-img {
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.7);
      border: 2px solid rgba(217,156,72,0.3);
    }
    .hero-img img { width: 100%; height: auto; display: block; object-fit: cover; }
    section { padding: 70px 0; }
    .section-title { font-size: clamp(1.8rem, 3.5vw, 2.6rem); color: var(--accent); margin-bottom: 12px; }
    .section-sub { color: var(--muted); margin-bottom: 36px; max-width: 680px; }
    .quote-box {
      border-left: 4px solid var(--gold);
      padding-left: 24px;
      font-size: 1.6rem;
      color: var(--accent);
      font-style: italic;
      margin-bottom: 20px;
    }
    .stalls-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      list-style: none;
    }
    .stall-card {
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 14px rgba(0,0,0,0.04);
      display: flex;
      flex-direction: column;
    }
    .stall-card img { width: 100%; height: 200px; object-fit: cover; }
    .stall-body { padding: 20px; flex: 1; display: flex; flex-direction: column; }
    .stall-tag { display: inline-block; font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--gold); margin-bottom: 6px; }
    .stall-body h3 { font-size: 1.4rem; color: var(--accent); margin-bottom: 8px; }
    .stall-body p { color: var(--muted); font-size: 0.95rem; line-height: 1.55; margin-bottom: 14px; flex: 1; }
    .stall-sub { font-size: 0.85rem; font-weight: 600; color: var(--ink); border-top: 1px dashed var(--line); pt: 10px; padding-top: 10px; }
    .timeline-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; list-style: none; margin-top: 24px; }
    .timeline-item { background: #fff; padding: 18px; border-radius: 12px; border: 1px solid var(--line); }
    .timeline-time { font-size: 1.4rem; color: var(--accent); font-weight: 700; }
    .timeline-name { font-weight: 600; margin: 4px 0; font-size: 0.95rem; }
    .timeline-desc { font-size: 0.82rem; color: var(--muted); }
    .booking-box {
      background: #fff;
      border-radius: 20px;
      border: 2px solid var(--gold);
      padding: 36px;
      max-width: 640px;
      margin: 0 auto;
      box-shadow: 0 10px 30px rgba(0,0,0,0.06);
      text-align: center;
    }
    .faq-item { border-bottom: 1px solid var(--line); padding: 16px 0; text-align: left; }
    .faq-item summary { font-size: 1.15rem; font-weight: 600; color: var(--accent); cursor: pointer; list-style: none; display: flex; justify-content: space-between; align-items: center; }
    .faq-item p { margin-top: 8px; color: var(--muted); font-size: 0.95rem; }
    footer { background: var(--deep); color: #f6ece0; padding: 40px 0; text-align: center; }
    @media (max-width: 768px) {
      .hero-content { grid-template-columns: 1fr; }
      .hero-img { order: -1; max-width: 420px; margin: 0 auto; }
    }
  </style>
</head>
<body>
  <header class="hero">
    <div class="hero-bg"></div>
    <div class="wrap hero-content">
      <div>
        <p class="tagline serif">${config.hero.customTagline || 'Cuối năm, về Chồ gặp nhau.'}</p>
        <h1 class="serif">${config.hero.title || 'Phiên chợ ký ức ở Chồ'}</h1>
        <p>${config.hero.description || 'Mấy ngày cuối năm, người ta thường muốn tìm về một nơi thân thuộc. Tối 24/11, Chồ mở một phiên chợ nhỏ ngay trong sảnh.'}</p>
        <div class="hero-facts">
          <div>📅 <b>Thời gian:</b> ${config.hero.eventDateFormatted} · ${config.hero.eventTimeFormatted}</div>
          <div>📍 <b>Địa điểm:</b> ${config.hero.locationName} (${config.hero.locationAddress})</div>
          <div>🎟️ <b>Giá vé:</b> ${config.hero.priceAdult.toLocaleString('vi-VN')} VND/khách (Giới hạn ${config.hero.totalTickets} vé)</div>
        </div>
        <div class="hero-btns">
          <a class="btn btn-gold" href="#dat-ve">Giữ chỗ đi chợ</a>
          <a class="btn btn-ghost" href="#sau-ganh">Dạo 6 gánh hàng</a>
        </div>
      </div>
      <div class="hero-img">
        <img src="${keyVisual}" alt="Key Visual Phiên chợ ký ức ở Chồ">
      </div>
    </div>
  </header>

  <main>
    <section class="wrap">
      <div class="quote-box serif">
        &ldquo;${config.story?.quote || 'Chợ ở quê mình không chỉ để mua bán.'}&rdquo;
      </div>
      <p style="font-size:1.05rem;line-height:1.7;color:var(--ink);max-width:800px;margin-bottom:12px;">
        ${config.story?.paragraph1 || 'Ở quê miền Trung, chợ là nơi người ta gặp nhau. Mua cá, mua rau chỉ là chuyện phụ; chuyện chính là hỏi thăm, là nghe ai mới về.'}
      </p>
      <p style="font-size:1.05rem;line-height:1.7;color:var(--ink);max-width:800px;">
        ${config.story?.paragraph2 || 'Phiên chợ ở Chồ mượn cái nếp ấy cho một buổi tối cuối năm. Bạn cầm rổ tre, đi từ gánh này sang gánh khác, đứng ăn, đứng nghe, rồi cả sảnh cùng nâng chén.'}
      </p>
    </section>

    <section style="background: rgba(251,247,240,0.8); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line);">
      <div class="wrap">
        <h2 class="section-title serif">${config.timeline?.title || 'Một tối ở phiên chợ'}</h2>
        <p class="section-sub">${config.timeline?.subtitle || 'Không sân khấu, không trò chơi ồn ào. Chợ đi theo nhịp tự nhiên của chính nó.'}</p>
        <ol class="timeline-list">
          ${(config.timeline?.events || TIMELINE_EVENTS).map(item => `
            <li class="timeline-item">
              <div class="timeline-time serif">${item.time}</div>
              <div class="timeline-name">${item.title}</div>
              <div class="timeline-desc">${item.desc}</div>
            </li>
          `).join('')}
        </ol>
      </div>
    </section>

    <section id="sau-ganh" class="wrap">
      <h2 class="section-title serif">${config.stallsSection?.title || 'Sáu gánh hàng, mỗi gánh một câu chuyện'}</h2>
      <p class="section-sub">${config.stallsSection?.subtitle || 'Người đứng gánh mặc áo bà ba, đội nón lá, rao bằng giọng Quảng mộc mạc.'}</p>
      <ul class="stalls-grid">
        ${config.stalls.map(s => `
          <li class="stall-card">
            ${s.imageUrl ? `<img src="${s.imageUrl}" alt="${s.name}" loading="lazy">` : ''}
            <div class="stall-body">
              <span class="stall-tag">Gánh Chồ</span>
              <h3 class="serif">${s.name}</h3>
              <p>${s.desc}</p>
              <div class="stall-sub">${s.sub}</div>
            </div>
          </li>
        `).join('')}
      </ul>
    </section>

    <section id="dat-ve" class="wrap" style="text-align:center;">
      <div class="booking-box" style="text-align:left;max-width:540px;margin:0 auto;">
        <h2 class="section-title serif" style="margin-bottom:8px;text-align:center;">Giữ chỗ đi chợ</h2>
        <p style="color:var(--muted);margin-bottom:20px;text-align:center;font-size:0.95rem;">Vé 500.000đ/người lớn · Trẻ em 250.000đ · Dưới 6 tuổi miễn phí</p>
        
        <form id="bookingForm" onsubmit="handleFormSubmit(event)" style="display:flex;flex-direction:column;gap:12px;">
          <div>
            <label style="font-size:0.85rem;font-weight:600;display:block;margin-bottom:4px;">Họ và tên của bạn</label>
            <input type="text" id="custName" required placeholder="Ví dụ: Nguyễn Văn An" style="width:100%;padding:10px 14px;border:1px solid var(--line);border-radius:10px;font-size:0.95rem;background:#fff;" />
          </div>
          <div>
            <label style="font-size:0.85rem;font-weight:600;display:block;margin-bottom:4px;">Số điện thoại (dùng Zalo)</label>
            <input type="tel" id="custPhone" required placeholder="Ví dụ: 0905 123 456" style="width:100%;padding:10px 14px;border:1px solid var(--line);border-radius:10px;font-size:0.95rem;background:#fff;" />
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div>
              <label style="font-size:0.85rem;font-weight:600;display:block;margin-bottom:4px;">Vé người lớn</label>
              <input type="number" id="adultCount" value="2" min="1" max="50" style="width:100%;padding:8px 12px;border:1px solid var(--line);border-radius:10px;font-size:0.95rem;background:#fff;" />
            </div>
            <div>
              <label style="font-size:0.85rem;font-weight:600;display:block;margin-bottom:4px;">Trẻ 6–12 tuổi</label>
              <input type="number" id="childCount" value="0" min="0" max="30" style="width:100%;padding:8px 12px;border:1px solid var(--line);border-radius:10px;font-size:0.95rem;background:#fff;" />
            </div>
          </div>
          <div>
            <label style="font-size:0.85rem;font-weight:600;display:block;margin-bottom:4px;">Ghi chú hoặc tiệc công ty</label>
            <input type="text" id="custNote" placeholder="Ghi chú thêm nếu có..." style="width:100%;padding:8px 12px;border:1px solid var(--line);border-radius:10px;font-size:0.95rem;background:#fff;" />
          </div>

          <button type="submit" id="submitBtn" class="btn btn-gold" style="width:100%;padding:14px;font-size:1rem;margin-top:6px;text-align:center;">
            Giữ chỗ đi chợ ngay
          </button>
        </form>

        <div id="bookingResult" style="display:none;margin-top:16px;padding:16px;background:var(--card);border:2px solid var(--accent);border-radius:12px;">
          <b style="color:var(--accent);display:block;margin-bottom:6px;">✓ Thông tin giữ chỗ đã sẵn sàng!</b>
          <pre id="summaryText" style="white-space:pre-wrap;font-size:0.85rem;background:#fff;padding:10px;border-radius:8px;border:1px solid var(--line);font-family:inherit;"></pre>
          <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">
            <a id="zaloLink" target="_blank" class="btn btn-gold" style="font-size:0.85rem;padding:8px 16px;">Gửi tin qua Zalo Chồ</a>
            <button type="button" onclick="copyBookingMsg()" class="btn btn-ghost" style="color:var(--ink);border-color:var(--line);font-size:0.85rem;padding:8px 16px;">Sao chép tin</button>
          </div>
        </div>
      </div>
    </section>

    <section class="wrap">
      <h2 class="section-title serif">Vài điều bạn có thể hỏi</h2>
      <div>
        ${(config.faqs || FAQS).map(f => `
          <details class="faq-item">
            <summary class="serif">${f.q}</summary>
            <p>${f.a}</p>
          </details>
        `).join('')}
      </div>
    </section>
  </main>

  <footer>
    <div class="wrap">
      <p style="font-weight:600;font-size:1.1rem;margin-bottom:6px;">Chồ Dining · Nhà hàng ký ức dòng sông</p>
      <p style="opacity:0.85;font-size:0.95rem;">202–204 Trần Bạch Đằng, Quận Ngũ Hành Sơn, Đà Nẵng</p>
      <p class="serif" style="font-style:italic;margin-top:14px;color:var(--gold);">Một bữa cơm, một dòng ký ức.</p>
    </div>
  </footer>

  <script>
    var webhookUrl = localStorage.getItem('cho_sheets_webhook_url_v1') || '';
    var lastSummary = '';

    function handleFormSubmit(e) {
      e.preventDefault();
      var name = document.getElementById('custName').value.trim();
      var phone = document.getElementById('custPhone').value.trim();
      var adults = parseInt(document.getElementById('adultCount').value) || 0;
      var children = parseInt(document.getElementById('childCount').value) || 0;
      var note = document.getElementById('custNote').value.trim();
      var total = adults * 500000 + children * 250000;

      lastSummary = 'Giữ chỗ Phiên chợ ký ức ở Chồ, tối 24/11\\nHọ tên: ' + name + '\\nSĐT: ' + phone + '\\nVé người lớn: ' + adults + ' · Trẻ em: ' + children + '\\nTạm tính: ' + total.toLocaleString('vi-VN') + 'đ' + (note ? ('\\nGhi chú: ' + note) : '');

      document.getElementById('summaryText').innerText = lastSummary;
      document.getElementById('zaloLink').href = 'https://zalo.me?text=' + encodeURIComponent(lastSummary);
      document.getElementById('bookingResult').style.display = 'block';

      // Send to Google Sheets webhook if available
      if (webhookUrl) {
        fetch(webhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name,
            phone: phone,
            adultCount: adults,
            childCount: children,
            totalPrice: total,
            bizInfo: note,
            timestamp: new Date().toLocaleString('vi-VN')
          })
        }).catch(function(err){ console.log(err); });
      }
    }

    function copyBookingMsg() {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(lastSummary).then(function() {
          alert('Đã sao chép thông tin đặt chỗ!');
        });
      }
    }
  </script>
</body>
</html>`;
  };

  const outputCode =
    activeTab === 'html'
      ? generateStandaloneHtml()
      : JSON.stringify(config, null, 2);

  const handleDownloadFile = () => {
    const filename =
      activeTab === 'html' ? 'index.html' : 'landing-config.json';
    const mime = activeTab === 'html' ? 'text/html' : 'application/json';
    const blob = new Blob([outputCode], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 px-5 sm:px-6 py-4 bg-stone-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <Globe className="h-5 w-5 text-amber-700" />
            <div>
              <h3 className="font-bold text-stone-900 text-base sm:text-lg">Xuất bản & Cấu hình Tên miền (cholocale.com)</h3>
              <p className="text-xs text-stone-500">Hướng dẫn chi tiết cho bảng điều khiển DNS Tenten / Cloudflare</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-200 hover:text-stone-700 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-stone-200 bg-stone-100/70 px-4 sm:px-6 pt-2 gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('dns')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'dns'
                ? 'border-amber-700 text-amber-800 bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Server className="h-4 w-4 text-amber-700" />
            <span>Hướng dẫn Trỏ DNS Tenten</span>
          </button>

          <button
            onClick={() => setActiveTab('html')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'html'
                ? 'border-amber-700 text-amber-800 bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Download className="h-4 w-4" />
            <span>Tải file index.html độc lập</span>
          </button>

          <button
            onClick={() => setActiveTab('json')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'json'
                ? 'border-amber-700 text-amber-800 bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>Cấu hình JSON</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 text-sm text-stone-700">
          {activeTab === 'dns' && (
            <div className="space-y-5">
              {/* Important Warning Notice about Existing Mail Records */}
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex gap-3 items-start text-amber-900">
                <ShieldAlert className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm space-y-1">
                  <b className="font-semibold text-amber-950">Lưu ý an toàn quan trọng từ ảnh DNS của bạn:</b>
                  <p>
                    Tên miền của bạn đang có <b>Google Workspace (Gmail: smtp.google.com)</b> và máy chủ mail <b>dining.mail (150.95.104.102)</b> hoạt động.
                    Tuyệt đối <b>KHÔNG xóa hay sửa</b> các bản ghi <code>MX</code>, <code>TXT (spf, dmarc)</code> hiện tại!
                  </p>
                </div>
              </div>

              {/* Step 1: Choose Domain Mode */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Bước 1: Chọn kiểu tên miền bạn muốn dùng
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSubdomainChoice('subdomain')}
                    className={`text-left p-3.5 rounded-xl border-2 transition cursor-pointer ${
                      subdomainChoice === 'subdomain'
                        ? 'border-amber-700 bg-amber-50/50 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <b className="text-stone-900 text-sm">Khuyên dùng: Tên miền phụ (Subdomain)</b>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">An toàn 100%</span>
                    </div>
                    <p className="text-xs text-stone-600">
                      Ví dụ: <code>phiencho.cholocale.com</code> hoặc <code>sukien.cholocale.com</code>. Không bao giờ ảnh hưởng đến web chính hoặc email.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSubdomainChoice('root')}
                    className={`text-left p-3.5 rounded-xl border-2 transition cursor-pointer ${
                      subdomainChoice === 'root'
                        ? 'border-amber-700 bg-amber-50/50 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <b className="text-stone-900 text-sm">Tên miền chính (Root domain)</b>
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">Toàn trang Chồ</span>
                    </div>
                    <p className="text-xs text-stone-600">
                      Ví dụ: <code>cholocale.com</code> và <code>www.cholocale.com</code>. Sử dụng toàn bộ trang chủ làm landing page.
                    </p>
                  </button>
                </div>

                {subdomainChoice === 'subdomain' && (
                  <div className="flex items-center gap-2 pt-1 text-xs">
                    <span className="text-stone-600">Tên subdomain:</span>
                    <input
                      type="text"
                      value={subdomainName}
                      onChange={(e) => setSubdomainName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      className="px-2.5 py-1 rounded-md border border-stone-300 font-mono text-xs w-28 bg-white focus:outline-amber-700"
                    />
                    <span className="text-stone-500 font-mono font-semibold">.cholocale.com</span>
                  </div>
                )}
              </div>

              {/* Step 2: The exact records to add on Tenten */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center justify-between">
                  <span>Bước 2: Bấm nút xanh &ldquo;+ Thêm bản ghi&rdquo; trên Tenten và điền:</span>
                </label>

                <div className="rounded-xl border border-stone-200 overflow-hidden bg-stone-900 text-stone-200 text-xs font-mono">
                  <div className="grid grid-cols-12 bg-stone-800 px-3.5 py-2 text-stone-400 font-semibold uppercase tracking-wider text-[11px]">
                    <div className="col-span-2">LOẠI</div>
                    <div className="col-span-4">TÊN</div>
                    <div className="col-span-5">GIÁ TRỊ</div>
                    <div className="col-span-1 text-right">CHÉP</div>
                  </div>

                  {subdomainChoice === 'subdomain' ? (
                    <div className="divide-y divide-stone-800">
                      {/* Subdomain hosting via Tenten IP */}
                      <div className="grid grid-cols-12 px-3.5 py-3 items-center hover:bg-stone-800/40">
                        <div className="col-span-2 text-emerald-400 font-bold">A</div>
                        <div className="col-span-4 text-amber-300">{subdomainName}</div>
                        <div className="col-span-5 text-stone-300 font-sans">150.95.104.102 (IP Tenten của bạn)</div>
                        <div className="col-span-1 text-right">
                          <button
                            type="button"
                            onClick={() => handleCopy('150.95.104.102', 'sub-ip')}
                            className="p-1 hover:text-white transition cursor-pointer"
                            title="Sao chép IP"
                          >
                            {copiedKey === 'sub-ip' ? <Check className="w-4 h-4 text-emerald-400 inline" /> : <Copy className="w-4 h-4 inline" />}
                          </button>
                        </div>
                      </div>
                      {/* Or CNAME via Cloudflare Pages / Vercel */}
                      <div className="grid grid-cols-12 px-3.5 py-3 items-center hover:bg-stone-800/40">
                        <div className="col-span-2 text-sky-400 font-bold">CNAME</div>
                        <div className="col-span-4 text-amber-300">{subdomainName}</div>
                        <div className="col-span-5 text-stone-300 truncate">phiencho-cho.pages.dev (nếu dùng Cloudflare)</div>
                        <div className="col-span-1 text-right">
                          <button
                            type="button"
                            onClick={() => handleCopy(subdomainName, 'sub-cname')}
                            className="p-1 hover:text-white transition cursor-pointer"
                          >
                            {copiedKey === 'sub-cname' ? <Check className="w-4 h-4 text-emerald-400 inline" /> : <Copy className="w-4 h-4 inline" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="divide-y divide-stone-800">
                      <div className="grid grid-cols-12 px-3.5 py-3 items-center hover:bg-stone-800/40">
                        <div className="col-span-2 text-emerald-400 font-bold">A</div>
                        <div className="col-span-4 text-amber-300">@</div>
                        <div className="col-span-5 text-stone-300 font-sans">150.95.104.102</div>
                        <div className="col-span-1 text-right">
                          <button
                            type="button"
                            onClick={() => handleCopy('150.95.104.102', 'root-ip')}
                            className="p-1 hover:text-white transition cursor-pointer"
                          >
                            {copiedKey === 'root-ip' ? <Check className="w-4 h-4 text-emerald-400 inline" /> : <Copy className="w-4 h-4 inline" />}
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-12 px-3.5 py-3 items-center hover:bg-stone-800/40">
                        <div className="col-span-2 text-sky-400 font-bold">CNAME</div>
                        <div className="col-span-4 text-amber-300">www</div>
                        <div className="col-span-5 text-stone-300 font-sans">cholocale.com</div>
                        <div className="col-span-1 text-right">
                          <button
                            type="button"
                            onClick={() => handleCopy('cholocale.com', 'root-www')}
                            className="p-1 hover:text-white transition cursor-pointer"
                          >
                            {copiedKey === 'root-www' ? <Check className="w-4 h-4 text-emerald-400 inline" /> : <Copy className="w-4 h-4 inline" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 3: Deployment Options */}
              <div className="space-y-3 pt-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Bước 3: Đưa giao diện vừa sửa lên mạng (Publish)
                </label>
                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-700 text-xs font-bold text-white">1</span>
                    <div className="text-xs space-y-1">
                      <b className="text-stone-900 font-semibold text-sm">Cách dễ nhất: Tải file index.html độc lập và upload lên cPanel Tenten</b>
                      <p className="text-stone-600">
                        Chuyển sang tab <b>&ldquo;Tải file index.html độc lập&rdquo;</b> ở trên &rarr; bấm <b>Tải file về máy</b> &rarr; Đăng nhập Hosting Tenten (cPanel) &rarr; vào thư mục <code>public_html</code> (hoặc thư mục subdomain) và tải file lên là xong ngay 100%!
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-700 text-xs font-bold text-white">2</span>
                    <div className="text-xs space-y-1">
                      <b className="text-stone-900 font-semibold text-sm">Cách hiện đại miễn phí: Dùng Cloudflare Pages (Khuyên dùng)</b>
                      <p className="text-stone-600">
                        Vì Nameserver của bạn đang là <code>peter.ns.cloudflare.com</code> & <code>walk.ns.cloudflare.com</code>, bạn có tài khoản Cloudflare.
                        Chỉ cần vào <b>Cloudflare &gt; Workers &amp; Pages</b>, kéo thả thư mục hoặc file HTML, rồi gắn Custom Domain là website chạy siêu tốc và tự có HTTPS xanh!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'html' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-stone-600">
                  File HTML độc lập chứa toàn bộ nội dung, ảnh bìa, key visual, 6 gánh hàng, timeline, font chữ và phong cách thiết kế bạn vừa chỉnh:
                </p>
                <button
                  type="button"
                  onClick={() => handleCopy(outputCode, 'full-html')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-stone-300 text-xs font-semibold bg-white hover:bg-stone-50 cursor-pointer"
                >
                  {copiedKey === 'full-html' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'full-html' ? 'Đã sao chép!' : 'Sao chép HTML'}</span>
                </button>
              </div>

              <div className="relative">
                <pre className="max-h-72 overflow-y-auto rounded-xl bg-stone-900 p-4 font-mono text-xs text-stone-200 leading-relaxed">
                  {outputCode}
                </pre>
              </div>

              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-900 flex items-center justify-between">
                <span>File <code>index.html</code> này chạy trực tiếp trên bất kỳ Hosting/VPS hoặc mở thẳng trên trình duyệt mà không cần cài đặt node.js hay build code.</span>
                <button
                  type="button"
                  onClick={handleDownloadFile}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 text-white px-3 py-1.5 font-bold hover:bg-emerald-900 transition shrink-0 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải index.html ngay</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'json' && (
            <div className="space-y-4">
              <p className="text-xs text-stone-600">
                Toàn bộ cấu hình dữ liệu và font chữ của landing page dạng JSON để sao lưu hoặc import lại sau:
              </p>
              <pre className="max-h-72 overflow-y-auto rounded-xl bg-stone-900 p-4 font-mono text-xs text-stone-200 leading-relaxed">
                {JSON.stringify(config, null, 2)}
              </pre>
              <button
                type="button"
                onClick={() => handleCopy(JSON.stringify(config, null, 2), 'json')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-stone-300 text-xs font-semibold bg-white hover:bg-stone-50 cursor-pointer"
              >
                {copiedKey === 'json' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedKey === 'json' ? 'Đã sao chép JSON!' : 'Sao chép JSON'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-200 bg-stone-50 px-5 sm:px-6 py-3.5 shrink-0">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleDownloadFile}
              className="inline-flex items-center gap-1.5 rounded-lg bg-stone-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-stone-800 transition cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Tải file {activeTab === 'html' ? 'index.html' : 'cấu hình'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEnterPublishMode();
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-700 px-4 py-2 text-xs font-bold text-white hover:bg-amber-800 transition cursor-pointer"
            >
              <span>Vào chế độ Publish (Xem trực tiếp)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

