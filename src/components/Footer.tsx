import React from 'react';
import { Sliders, Phone, MapPin, Clock } from 'lucide-react';
import { LandingConfig } from '../types';

interface FooterProps {
  serifFontClass?: string;
  config?: LandingConfig;
  onOpenExportModal?: () => void;
  onOpenGoogleSheetsModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  serifFontClass = 'font-serif',
  config,
  onOpenExportModal,
  onOpenGoogleSheetsModal,
}) => {
  return (
    <footer className="w-full bg-[var(--deep,#7d2c19)] text-[var(--on-deep,#f6ece0)] pt-16 pb-12 border-t border-white/10 relative">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          <div className="md:col-span-5 space-y-3">
            <a
              href="/"
              className={`inline-block text-3xl font-bold tracking-tight text-[var(--gold,#d99c48)] hover:brightness-110 transition ${serifFontClass}`}
            >
              chồ
            </a>
            <p className="text-base font-semibold text-white tracking-wide">
              {config?.hero?.locationName || 'Chồ Dining'} · Nhà hàng ký ức dòng sông
            </p>
            <p className="text-sm opacity-85 max-w-md leading-relaxed">
              Mỗi món ăn là một câu chuyện, mỗi phiên chợ là một dòng ký ức được kể bằng hương vị mộc mạc của quê nhà xứ Quảng.
            </p>
            <p className={`pt-2 text-xl italic text-[var(--gold,#d99c48)] ${serifFontClass}`}>
              &ldquo;{config?.hero?.customTagline || 'Một bữa cơm, một dòng ký ức.'}&rdquo;
            </p>
          </div>

          <div className="md:col-span-4 space-y-3.5 text-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--gold,#d99c48)]">
              Thông tin liên hệ
            </h4>
            <div className="flex items-start gap-2.5 opacity-90">
              <MapPin className="h-4 w-4 shrink-0 mt-1 text-[var(--gold,#d99c48)]" />
              <span>
                {config?.hero?.locationAddress || '202–204 Trần Bạch Đằng, Đà Nẵng'}
              </span>
            </div>
            <div className="flex items-center gap-2.5 opacity-90">
              <Phone className="h-4 w-4 shrink-0 text-[var(--gold,#d99c48)]" />
              <span>Hotline & Zalo đặt chỗ: 0898 236 879</span>
            </div>
            <div className="flex items-center gap-2.5 opacity-90">
              <Clock className="h-4 w-4 shrink-0 text-[var(--gold,#d99c48)]" />
              <span>
                Thời gian sự kiện: {config?.hero?.eventTimeFormatted || '17:30–20:30'}, {config?.hero?.eventDateFormatted || 'Tối thứ Ba 24/11/2026'}
              </span>
            </div>
          </div>

          <div className="md:col-span-3 space-y-3 text-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--gold,#d99c48)]">
              Lối tắt
            </h4>
            <ul className="space-y-2.5 opacity-85 text-sm">
              <li>
                <a href="#cau-chuyen" className="hover:text-white hover:underline transition">
                  Câu chuyện Chồ
                </a>
              </li>
              <li>
                <a href="#chuong-trinh" className="hover:text-white hover:underline transition">
                  Lịch trình phiên chợ
                </a>
              </li>
              <li>
                <a href="#sau-ganh" className="hover:text-white hover:underline transition">
                  Sáu gánh hàng rong
                </a>
              </li>
              <li>
                <a href="#dat-ve" className="hover:text-white hover:underline transition">
                  Đặt vé đi chợ
                </a>
              </li>
              <li>
                <a href="#hoi-dap" className="hover:text-white hover:underline transition">
                  Hỏi đáp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs opacity-70 gap-4">
          <p>© 2026 Chồ Dining. Bảo lưu mọi quyền.</p>

          <div className="flex items-center gap-3">
            {onOpenExportModal && (
              <button
                type="button"
                onClick={onOpenExportModal}
                className="hover:text-white hover:underline text-amber-200/80 transition cursor-pointer"
              >
                Xuất bản & Tên miền
              </button>
            )}
            {onOpenGoogleSheetsModal && (
              <>
                <span>·</span>
                <button
                  type="button"
                  onClick={onOpenGoogleSheetsModal}
                  className="hover:text-white hover:underline text-emerald-300/80 transition cursor-pointer"
                >
                  Google Sheet
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
