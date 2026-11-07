/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  Calendar,
  MapPin,
  Ticket,
  ChevronDown,
  Sliders,
  Eye,
  Camera,
  Share2,
  ArrowUp,
  FileSpreadsheet,
} from 'lucide-react';
import { Countdown } from './components/Countdown';
import { StallCard } from './components/StallCard';
import { BookingForm } from './components/BookingForm';
import { CustomizerDrawer } from './components/CustomizerDrawer';
import { ExportModal } from './components/ExportModal';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import { HeaderNav } from './components/HeaderNav';
import { Footer } from './components/Footer';
import {
  DEFAULT_LANDING_CONFIG,
  FAQS,
  TIMELINE_EVENTS,
} from './data/landingData';
import { LandingConfig, StallItem } from './types';
import { BookingRecord } from './services/googleSheetsService';

const STORAGE_KEY_CONFIG = 'cho_landing_config_v2';
const STORAGE_KEY_PUBLISH = 'cho_landing_publish_mode_v1';
const STORAGE_KEY_BOOKINGS = 'cho_recent_bookings_v1';

export default function App() {
  // Initialize config with saved localStorage if present
  const [config, setConfig] = useState<LandingConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG) || localStorage.getItem('cho_landing_config_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure default fonts are updated to Beautydisplay and Haskoy if previous defaults were loaded
        if (parsed?.fonts?.serifFont === 'Cormorant Garamond' || !parsed?.fonts?.serifFont) {
          parsed.fonts.serifFont = 'Beautydisplay';
        }
        if (parsed?.fonts?.sansFont === 'Be Vietnam Pro' || !parsed?.fonts?.sansFont) {
          parsed.fonts.sansFont = 'Haskoy';
        }
        // Ensure hero visualType defaults to background and coin is removed
        if (parsed?.hero?.visualType === 'coin' || !parsed?.hero?.visualType) {
          parsed.hero.visualType = 'background';
        }
        if (!parsed?.hero?.customImageUrl) {
          parsed.hero.customImageUrl = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80';
        }
        if (!parsed?.hero?.keyVisualUrl) {
          parsed.hero.keyVisualUrl = '/images/key_visual.jpg';
        }
        if (!parsed?.hero?.title) {
          parsed.hero.title = DEFAULT_LANDING_CONFIG.hero.title;
        }
        if (!parsed?.hero?.description) {
          parsed.hero.description = DEFAULT_LANDING_CONFIG.hero.description;
        }
        if (!parsed?.story) {
          parsed.story = DEFAULT_LANDING_CONFIG.story;
        }
        if (!parsed?.timeline) {
          parsed.timeline = DEFAULT_LANDING_CONFIG.timeline;
        }
        if (!parsed?.stallsSection) {
          parsed.stallsSection = DEFAULT_LANDING_CONFIG.stallsSection;
        }
        if (!parsed?.faqs) {
          parsed.faqs = DEFAULT_LANDING_CONFIG.faqs;
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Could not parse saved config, using default', e);
    }
    return DEFAULT_LANDING_CONFIG;
  });

  // Track Publish Mode (default false so user sees customizer right away)
  const [isPublishMode, setIsPublishMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_PUBLISH) === 'true';
    } catch {
      return false;
    }
  });

  // Open customizer immediately so user can edit content
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(true);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isGoogleSheetsModalOpen, setIsGoogleSheetsModalOpen] = useState(false);
  const [editingStallId, setEditingStallId] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [recentBookings, setRecentBookings] = useState<BookingRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKINGS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleNewBooking = (booking: BookingRecord) => {
    setRecentBookings((prev) => {
      const updated = [booking, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(updated.slice(0, 50)));
      } catch (e) {
        console.warn('Could not save booking locally', e);
      }
      return updated;
    });
  };

  // Monitor scroll position for smooth Back to Top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Save config to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
    } catch (e) {
      console.warn('Could not save config to localStorage', e);
    }
  }, [config]);

  // Save publish state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PUBLISH, String(isPublishMode));
    } catch (e) {
      console.warn('Could not save publish state', e);
    }
  }, [isPublishMode]);

  // Dynamically load selected Google Fonts into document head (if an external Google font is chosen)
  useEffect(() => {
    const serif = config.fonts.serifFont;
    const sans = config.fonts.sansFont;

    const googleFonts = [
      'Cormorant Garamond',
      'Playfair Display',
      'Noto Serif',
      'Lora',
      'Merriweather',
      'Be Vietnam Pro',
      'Plus Jakarta Sans',
      'DM Sans',
      'Manrope',
    ];
    const fontsToLoad = [serif, sans].filter((f) => googleFonts.includes(f));

    if (fontsToLoad.length > 0) {
      const linkId = 'dynamic-google-fonts-link';
      let link = document.getElementById(linkId) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }

      link.href = `https://fonts.googleapis.com/css2?family=${fontsToLoad
        .map((f) => `${encodeURIComponent(f)}:ital,wght@0,400;0,500;0,600;0,700;1,400`)
        .join('&family=')}&display=swap`;
    }

    // Update CSS variables for root
    const headingFontFamily =
      serif === 'Beautydisplay'
        ? '"Beautydisplay", "Beauty Display", "Beautique Display", "Cormorant Garamond", Georgia, serif'
        : `"${serif}", "Beautydisplay", Georgia, serif`;

    const bodyFontFamily =
      sans === 'Haskoy'
        ? '"Haskoy", "Be Vietnam Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        : `"${sans}", "Haskoy", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;

    document.documentElement.style.setProperty('--serif', headingFontFamily);
    document.documentElement.style.setProperty('--heading', headingFontFamily);
    document.documentElement.style.setProperty('--sans', bodyFontFamily);
    document.documentElement.style.setProperty('--font-scale', `${config.fonts.fontSizeScale}`);
  }, [config.fonts.serifFont, config.fonts.sansFont, config.fonts.fontSizeScale]);

  const handleOpenStallEdit = (stall: StallItem) => {
    setEditingStallId(stall.id);
    setIsCustomizerOpen(true);
  };

  const serifClass = 'font-serif';

  return (
    <div
      className="min-h-screen flex flex-col text-[var(--ink,#2a1d19)] transition-colors duration-200 brand-bg-texture"
      style={{
        fontSize: `calc(16px * ${config.fonts.fontSizeScale})`,
      }}
    >
      {/* Header and Top Notification */}
      <HeaderNav
        serifFontClass={serifClass}
        isPublishMode={isPublishMode}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onTogglePublishMode={() => setIsPublishMode(!isPublishMode)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenGoogleSheetsModal={() => setIsGoogleSheetsModalOpen(true)}
      />

      <main className="flex-1">
        {/* ================= HERO SECTION ================= */}
        {/* ================= HERO SECTION (SECTION 1) ================= */}
        <section className="relative overflow-hidden min-h-[600px] lg:min-h-[660px] flex flex-col justify-between bg-[var(--deep,#7d2c19)] text-[var(--on-deep,#f6ece0)] pt-14 sm:pt-20 pb-12 sm:pb-16">
          {/* Background Image Layer with atmospheric gradient overlay */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={
                config.hero.customImageUrl ||
                'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80'
              }
              alt="Không gian Chồ Dining"
              className="h-full w-full object-cover object-center transform scale-105 filter brightness-[0.82] contrast-[1.08] transition-transform duration-1000"
            />
            {/* Multi-layered dark warm vignette & overlays for superior contrast and readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#180603]/95 via-[#2b0c05]/85 to-[#180603]/75 sm:to-[#180603]/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#180603] via-transparent to-black/45" />
            <div className="absolute inset-0 bg-[var(--deep,#7d2c19)]/25 mix-blend-multiply" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 w-full my-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-center">
              {/* Left Column: Headlines & Call to Actions */}
              <div className="lg:col-span-6 xl:col-span-6 space-y-5">
                <p
                  className={`text-lg sm:text-xl italic text-[var(--gold,#d99c48)] ${serifClass}`}
                >
                  {config.hero.customTagline || 'Cuối năm, về Chồ gặp nhau.'}
                </p>

                <h1
                  className={`text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.12] tracking-tight text-[var(--on-deep,#f6ece0)] ${serifClass}`}
                >
                  {config.hero.title || 'Phiên chợ ký ức ở Chồ'}
                </h1>

                <p className="text-base sm:text-lg leading-relaxed text-[var(--on-deep,#f6ece0)]/90 max-w-2xl">
                  {config.hero.description ||
                    'Mấy ngày cuối năm, người ta thường muốn tìm về một nơi thân thuộc. Tối 24/11, Chồ mở một phiên chợ nhỏ ngay trong sảnh. Nơi đó có gánh hàng rong, có tiếng rao mộc mạc và có người đứng gánh kể câu chuyện xứ Quảng. Mời bạn ghé chơi một phiên chợ chiều để chầm chậm chạm vào nếp xưa.'}
                </p>

                {/* Event Key Facts */}
                <div className="pt-2 space-y-3.5 text-sm sm:text-base">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 shrink-0 mt-0.5 text-[var(--gold,#d99c48)]" />
                    <div>
                      <b className="block font-semibold text-white">
                        {config.hero.eventDateFormatted}
                      </b>
                      <span className="opacity-85 text-xs sm:text-sm">
                        {config.hero.eventTimeFormatted}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 shrink-0 mt-0.5 text-[var(--gold,#d99c48)]" />
                    <div>
                      <b className="block font-semibold text-white">
                        {config.hero.locationName}
                      </b>
                      <span className="opacity-85 text-xs sm:text-sm">
                        {config.hero.locationAddress}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Ticket className="h-5 w-5 shrink-0 mt-0.5 text-[var(--gold,#d99c48)]" />
                    <div>
                      <b className="block font-semibold text-white">
                        Phí đặt chỗ: {config.hero.priceAdult.toLocaleString('vi-VN')}VND/khách
                      </b>
                      <span className="opacity-85 text-xs sm:text-sm">
                        Chưa bao gồm VAT · Giới hạn {config.hero.totalTickets} vé
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="pt-4 flex flex-wrap items-center gap-3.5">
                  <a
                    href="#dat-ve"
                    className="inline-block rounded-full bg-[var(--gold,#d99c48)] px-7 py-3 text-sm sm:text-base font-bold text-[#2a1d19] shadow-lg transition duration-200 hover:brightness-110 active:scale-[0.98]"
                  >
                    Giữ chỗ đi chợ
                  </a>

                  <a
                    href="#sau-ganh"
                    className="inline-block rounded-full border-2 border-[var(--gold,#d99c48)] bg-black/30 backdrop-blur-xs px-6 py-3 text-sm sm:text-base font-semibold text-[var(--on-deep,#f6ece0)] transition duration-200 hover:bg-white/10 active:scale-[0.98]"
                  >
                    Đi dạo một vòng chợ
                  </a>
                </div>

                {/* Countdown Timer */}
                {config.hero.showCountdown && (
                  <div className="pt-2">
                    <Countdown
                      targetDateString={config.hero.eventDate}
                      serifFontClass={serifClass}
                    />
                  </div>
                )}
              </div>

              {/* Right Column: Blended & Enlarged Event Key Visual */}
              <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-center justify-center">
                <div className="relative group w-full max-w-lg lg:max-w-xl xl:max-w-2xl flex items-center justify-center">
                  {/* Atmospheric warm golden-amber backlight glow */}
                  <div className="absolute -inset-4 sm:-inset-8 rounded-full bg-gradient-to-tr from-amber-600/30 via-[var(--gold,#d99c48)]/25 to-amber-700/20 blur-3xl opacity-80 pointer-events-none" />

                  {/* Key Visual Image with soft edge-blending mask into the background */}
                  <div className="relative w-full overflow-hidden rounded-3xl [mask-image:radial-gradient(ellipse_94%_94%_at_50%_50%,black_65%,rgba(0,0,0,0.85)_82%,transparent_100%)] drop-shadow-[0_25px_50px_rgba(0,0,0,0.85)]">
                    <img
                      src={config.hero.keyVisualUrl || '/images/key_visual.jpg'}
                      alt="Key Visual Phiên chợ ký ức ở Chồ Dining"
                      className="w-full h-auto max-h-[640px] sm:max-h-[700px] lg:max-h-[760px] object-contain sm:object-cover object-center transition duration-700 group-hover:scale-[1.02]"
                    />

                    {/* Edge shadow blends to naturally dissolve image borders into hero atmosphere */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#180603]/70 via-transparent to-[#180603]/30" />
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#180603]/40 via-transparent to-[#180603]/40" />

                    {/* Quick action button for user in editor mode (discreet on top-right) */}
                    {!isPublishMode && (
                      <div className="absolute top-3 right-3 opacity-80 hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => setIsCustomizerOpen(true)}
                          className="flex items-center gap-1.5 rounded-full bg-black/75 hover:bg-amber-700 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/25 shadow-lg transition"
                          title="Tùy chỉnh Key Visual hoặc ảnh background"
                        >
                          <Camera className="w-3.5 h-3.5 text-amber-300" />
                          <span>Đổi Key Visual</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Authentic ring pattern divider */}
          <div className="relative z-10 rings-pattern mt-8 w-full shrink-0" aria-hidden="true" />
        </section>

        {/* ================= STORY SECTION ================= */}
        <section id="cau-chuyen" className="py-20 sm:py-24 bg-transparent scroll-mt-20 sm:scroll-mt-24">
          <div className="mx-auto max-w-5xl px-5">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
              <div className="md:col-span-5 border-l-4 border-[var(--gold,#d99c48)] pl-6">
                <blockquote
                  className={`text-2xl sm:text-3xl lg:text-4xl font-normal italic leading-snug text-[var(--accent,#993820)] ${serifClass}`}
                >
                  &ldquo;{config.story?.quote || 'Chợ ở quê mình không chỉ để mua bán.'}&rdquo;
                </blockquote>
              </div>

              <div className="md:col-span-7 space-y-4 text-base sm:text-lg leading-relaxed text-[var(--ink,#2a1d19)] opacity-95">
                <p>
                  {config.story?.paragraph1 ||
                    'Ở quê miền Trung, chợ là nơi người ta gặp nhau. Mua cá, mua rau chỉ là chuyện phụ; chuyện chính là hỏi thăm, là nghe ai mới về, là đứng lại ăn một món rồi nói thêm vài câu.'}
                </p>
                <p>
                  {config.story?.paragraph2 ||
                    'Phiên chợ ở Chồ mượn cái nếp ấy cho một buổi tối cuối năm. Bạn cầm rổ tre, đi từ gánh này sang gánh khác, đứng ăn, đứng nghe, rồi cả sảnh cùng nâng chén. Chồ không dựng lại chợ xưa. Chồ chỉ muốn mang lại cho bạn cảm giác thân quen ngày cũ, trọn vẹn theo cách của hôm nay.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= TIMELINE SECTION ================= */}
        <section id="chuong-trinh" className="py-20 bg-[var(--card,#fbf7f0)]/70 backdrop-blur-xs border-y border-[var(--line,#dccfbd)] scroll-mt-20 sm:scroll-mt-24">
          <div className="mx-auto max-w-6xl px-5">
            <div className="max-w-2xl mb-12">
              <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--accent,#993820)] ${serifClass}`}>
                {config.timeline?.title || 'Một tối ở phiên chợ'}
              </h2>
              <p className="mt-2 text-base text-[var(--muted,#6b5a52)]">
                {config.timeline?.subtitle ||
                  'Không sân khấu, không trò chơi ồn ào. Chợ đi theo nhịp tự nhiên của chính nó, bạn cứ thong thả đi theo.'}
              </p>
            </div>

            {/* Timeline Milestones */}
            <ol className="grid grid-cols-1 md:grid-cols-6 gap-6 md:gap-4 relative pt-2">
              {(config.timeline?.events || TIMELINE_EVENTS).map((item, idx) => (
                <li
                  key={idx}
                  className="relative flex flex-col md:border-t-3 md:border-[var(--accent,#993820)] pt-4 pl-6 md:pl-0 border-l-2 md:border-l-0 border-[var(--accent,#993820)]"
                >
                  {/* Timeline circular dot marker */}
                  <span
                    className="absolute -left-[9px] md:left-0 top-0 md:-top-[9px] h-4 w-4 rounded-full bg-[var(--gold,#d99c48)] border-3 border-[var(--bg,#f4efe6)]"
                    aria-hidden="true"
                  />

                  <time
                    className={`text-2xl font-bold text-[var(--accent,#993820)] ${serifClass} tabular-nums`}
                  >
                    {item.time}
                  </time>
                  <b className="mt-1 text-sm sm:text-base font-semibold text-[var(--ink,#2a1d19)]">
                    {item.title}
                  </b>
                  <span className="mt-1 text-xs sm:text-sm text-[var(--muted,#6b5a52)] leading-relaxed">
                    {item.desc}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ================= 6 FOOD STALLS SECTION ================= */}
        <section id="sau-ganh" className="py-20 sm:py-24 bg-transparent scroll-mt-20 sm:scroll-mt-24">
          <div className="mx-auto max-w-6xl px-5">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--accent,#993820)] ${serifClass}`}>
                  {config.stallsSection?.title || 'Sáu gánh hàng, mỗi gánh một câu chuyện'}
                </h2>
                <p className="mt-2 text-base text-[var(--muted,#6b5a52)] max-w-2xl">
                  {config.stallsSection?.subtitle ||
                    'Người đứng gánh mặc áo bà ba, đội nón lá, rao bằng giọng Quảng mộc mạc. Bạn cứ hỏi, họ sẽ kể tường tận từng món.'}
                </p>
              </div>

              {!isPublishMode && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCustomizerOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--line,#dccfbd)] bg-white px-3.5 py-1.5 text-xs font-semibold text-[var(--ink,#2a1d19)] hover:bg-amber-50 shadow-xs"
                  >
                    <Sliders className="h-3.5 w-3.5 text-amber-700" />
                    <span>Tùy chỉnh nội dung & ảnh 6 gánh</span>
                  </button>
                </div>
              )}
            </div>

            {/* 6 Food Stalls Grid */}
            <div className="relative mt-8">
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                {config.stalls.map((stall, idx) => (
                  <StallCard
                    key={stall.id}
                    stall={stall}
                    index={idx}
                    stallsStyle={config.stallsStyle}
                    isPublishMode={isPublishMode}
                    onEditImage={handleOpenStallEdit}
                    serifFontClass={serifClass}
                  />
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ================= TICKET & BOOKING FORM SECTION ================= */}
        <section id="dat-ve" className="py-20 sm:py-24 bg-[var(--card,#fbf7f0)]/75 backdrop-blur-xs border-t border-[var(--line,#dccfbd)] scroll-mt-20 sm:scroll-mt-24">
          <div className="mx-auto max-w-6xl px-5">
            <BookingForm
              priceAdult={config.hero.priceAdult}
              priceChildRatio={config.hero.priceChildRatio}
              serifFontClass={serifClass}
              onOpenGoogleSheetsModal={() => setIsGoogleSheetsModalOpen(true)}
              onNewBooking={handleNewBooking}
              isPublishMode={isPublishMode}
            />
          </div>
        </section>

        {/* ================= FAQ SECTION ================= */}
        <section id="hoi-dap" className="py-20 bg-transparent border-t border-[var(--line,#dccfbd)] scroll-mt-20 sm:scroll-mt-24">
          <div className="mx-auto max-w-4xl px-5">
            <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight text-[var(--accent,#993820)] mb-8 ${serifClass}`}>
              Vài điều bạn có thể hỏi
            </h2>

            <div className="divide-y divide-[var(--line,#dccfbd)]">
              {(config.faqs || FAQS).map((faq, index) => (
                <details
                  key={index}
                  className="group py-5 transition"
                >
                  <summary className={`flex cursor-pointer items-center justify-between text-lg sm:text-xl font-bold text-[var(--accent,#993820)] ${serifClass}`}>
                    <span>{faq.q}</span>
                    <ChevronDown className="h-5 w-5 shrink-0 text-amber-700 transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-[var(--muted,#6b5a52)] pl-1">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer
        serifFontClass={serifClass}
        isPublishMode={isPublishMode}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onTogglePublishMode={() => setIsPublishMode(!isPublishMode)}
        config={config}
      />

      {/* Smooth Scroll to Top Floating Button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={handleScrollToTop}
          aria-label="Cuộn lên đầu trang"
          className="fixed bottom-5 left-5 z-40 flex items-center gap-2 rounded-full bg-[var(--deep,#7d2c19)]/90 hover:bg-[var(--deep,#7d2c19)] text-[var(--gold,#d99c48)] border border-[var(--gold,#d99c48)]/40 px-3.5 py-2.5 text-xs font-semibold shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          title="Cuộn mượt lên đầu trang"
        >
          <ArrowUp className="h-4 w-4" />
          <span className="hidden sm:inline font-medium">Lên đầu trang</span>
        </button>
      )}

      {/* Persistent Floating Edit Button (Discreet when in Publish mode) */}
      <aside
        aria-label="Công cụ thiết kế nổi"
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2"
      >
        {isPublishMode ? (
          <button
            type="button"
            onClick={() => setIsPublishMode(false)}
            className="flex items-center gap-1.5 rounded-full bg-stone-900/90 hover:bg-stone-900 px-3.5 py-2 text-xs font-semibold text-amber-300 shadow-xl backdrop-blur-md transition hover:scale-105 active:scale-95"
            title="Nhấn để mở lại chế độ tùy chỉnh hình ảnh & font chữ"
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Mở lại Tùy chỉnh</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsGoogleSheetsModalOpen(true)}
              className="flex items-center gap-1.5 rounded-full bg-emerald-800 hover:bg-emerald-700 px-3.5 py-2.5 text-xs font-bold text-white shadow-xl transition hover:scale-105 active:scale-95 cursor-pointer"
              title="Mở kết nối và xem Google Sheet đặt chỗ"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-200" />
              <span className="hidden sm:inline">Google Sheet</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCustomizerOpen(true)}
              className="flex items-center gap-2 rounded-full bg-amber-700 hover:bg-amber-800 px-4 py-2.5 text-xs font-bold text-white shadow-xl transition hover:scale-105 active:scale-95"
            >
              <Sliders className="h-4 w-4" />
              <span>Tùy chỉnh Font & Ảnh</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPublishMode(true)}
              className="flex items-center gap-1.5 rounded-full bg-stone-900 hover:bg-black px-3.5 py-2.5 text-xs font-semibold text-white shadow-xl transition hover:scale-105 active:scale-95"
              title="Bỏ thanh công cụ và xem chế độ xuất bản sạch sẽ"
            >
              <Eye className="h-4 w-4 text-emerald-400" />
              <span>Xem Publish</span>
            </button>
          </div>
        )}
      </aside>

      {/* Customizer Slide-out Drawer */}
      <CustomizerDrawer
        isOpen={isCustomizerOpen}
        onClose={() => {
          setIsCustomizerOpen(false);
          setEditingStallId(null);
        }}
        config={config}
        onChangeConfig={setConfig}
        onEnterPublishMode={() => {
          setIsCustomizerOpen(false);
          setIsPublishMode(true);
        }}
        onOpenExportModal={() => {
          setIsCustomizerOpen(false);
          setIsExportModalOpen(true);
        }}
        editingStallId={editingStallId}
        onClearEditingStall={() => setEditingStallId(null)}
      />

      {/* Export & Download Code Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        config={config}
        onEnterPublishMode={() => {
          setIsExportModalOpen(false);
          setIsPublishMode(true);
        }}
      />

      {/* Google Sheets Sync & Management Modal */}
      <GoogleSheetsModal
        isOpen={isGoogleSheetsModalOpen}
        onClose={() => setIsGoogleSheetsModalOpen(false)}
        recentBookings={recentBookings}
      />
    </div>
  );
}
