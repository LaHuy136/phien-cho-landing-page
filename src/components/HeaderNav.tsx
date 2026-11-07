import React from 'react';
import { Sliders, Eye, Download } from 'lucide-react';

interface HeaderNavProps {
  serifFontClass?: string;
  isPublishMode: boolean;
  onOpenCustomizer: () => void;
  onTogglePublishMode: () => void;
  onOpenExportModal: () => void;
  onOpenGoogleSheetsModal?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  serifFontClass = 'font-serif',
  isPublishMode,
  onOpenCustomizer,
  onTogglePublishMode,
  onOpenExportModal,
  onOpenGoogleSheetsModal,
}) => {
  return (
    <>
      {/* Top Banner when in Editor Mode */}
      {!isPublishMode && (
        <aside
          aria-label="Thanh công cụ tùy chỉnh"
          className="sticky top-0 z-40 bg-stone-900 px-4 py-2 text-stone-200 border-b border-stone-800 shadow-sm"
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-semibold text-white">Chế độ Thiết kế:</span>
              <span className="hidden sm:inline text-stone-300">
                Tùy chỉnh giao diện &amp; đồng bộ dữ liệu đặt chỗ
              </span>
            </div>

            <div className="flex items-center gap-2">
              {onOpenGoogleSheetsModal && (
                <button
                  type="button"
                  onClick={onOpenGoogleSheetsModal}
                  className="inline-flex items-center gap-1.5 rounded-md bg-emerald-800/80 px-2.5 py-1 font-semibold text-emerald-200 hover:bg-emerald-700 transition cursor-pointer"
                  title="Kết nối và xem dữ liệu đổ về Google Sheet"
                >
                  <span>Google Sheet</span>
                </button>
              )}

              <button
                type="button"
                onClick={onOpenCustomizer}
                className="inline-flex items-center gap-1.5 rounded-md bg-stone-800 px-2.5 py-1 font-medium text-amber-300 hover:bg-stone-700 transition cursor-pointer"
              >
                <Sliders className="h-3.5 w-3.5" />
                <span>Bảng tùy chỉnh</span>
              </button>

              <button
                type="button"
                onClick={onTogglePublishMode}
                className="inline-flex items-center gap-1.5 rounded-md bg-amber-600 px-3 py-1 font-bold text-white hover:bg-amber-500 transition shadow-xs cursor-pointer"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Bỏ thanh này để Publish</span>
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Main Navigation (Strict Top Bar Contract) */}
      <header className="sticky top-0 z-30 w-full bg-[var(--deep,#7d2c19)]/95 backdrop-blur-md border-b border-white/10 text-[var(--on-deep,#f6ece0)] shadow-md transition-all">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-5 py-3.5">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="/"
            className={`text-2xl font-bold tracking-tight text-[var(--on-deep,#f6ece0)] whitespace-nowrap shrink-0 ${serifFontClass}`}
          >
            chồ <span className="opacity-75 text-sm font-normal">· Nhà hàng ký ức dòng sông</span>
          </a>

          {/* Zone 2: 4–5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[var(--on-deep,#f6ece0)]/90">
            <a
              href="#cau-chuyen"
              className="hover:text-white transition-colors hover:underline underline-offset-8 whitespace-nowrap shrink-0"
            >
              Câu chuyện Chồ
            </a>
            <a
              href="#chuong-trinh"
              className="hover:text-white transition-colors hover:underline underline-offset-8 whitespace-nowrap shrink-0"
            >
              Lịch trình phiên chợ
            </a>
            <a
              href="#sau-ganh"
              className="hover:text-white transition-colors hover:underline underline-offset-8 whitespace-nowrap shrink-0"
            >
              Sáu gánh hàng rong
            </a>
            <a
              href="#dat-ve"
              className="hover:text-white transition-colors hover:underline underline-offset-8 whitespace-nowrap shrink-0"
            >
              Đặt vé đi chợ
            </a>
            <a
              href="#hoi-dap"
              className="hover:text-white transition-colors hover:underline underline-offset-8 whitespace-nowrap shrink-0"
            >
              Hỏi đáp
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#dat-ve"
              className="inline-block rounded-full bg-[var(--gold,#d99c48)] px-5 py-2 text-xs sm:text-sm font-bold text-[#2a1d19] hover:brightness-110 transition shadow-sm whitespace-nowrap shrink-0"
            >
              Giữ chỗ đi chợ
            </a>
          </div>
        </div>
      </header>
    </>
  );
};
