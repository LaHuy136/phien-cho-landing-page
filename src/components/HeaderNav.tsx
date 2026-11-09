import React from 'react';

interface HeaderNavProps {
  serifFontClass?: string;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  serifFontClass = 'font-serif',
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-[var(--deep,#7d2c19)]/95 backdrop-blur-md border-b border-white/10 text-[var(--on-deep,#f6ece0)] shadow-md transition-all">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-3.5">
        {/* Zone 1: Wordmark */}
        <a
          href="/"
          className={`flex items-center gap-2.5 text-2xl font-bold tracking-tight text-[var(--on-deep,#f6ece0)] whitespace-nowrap shrink-0 group ${serifFontClass}`}
        >
          <img
            src="/favicon.png"
            alt="Logo Chồ Dining"
            className="h-7 w-7 object-contain transition-transform group-hover:scale-105"
          />
          <span>
            chồ <span className="opacity-75 text-sm font-normal">· Nhà hàng ký ức dòng sông</span>
          </span>
        </a>

        {/* Zone 2: Navigation links */}
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
            href="#hoi-dap"
            className="hover:text-white transition-colors hover:underline underline-offset-8 whitespace-nowrap shrink-0"
          >
            Hỏi đáp
          </a>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center shrink-0">
          <a
            href="#dat-ve"
            className="inline-block rounded-full bg-[var(--gold,#d99c48)] px-5 py-2 text-xs sm:text-sm font-bold text-[#2a1d19] hover:brightness-110 transition shadow-sm whitespace-nowrap shrink-0"
          >
            Giữ chỗ đi chợ
          </a>
        </div>
      </div>
    </header>
  );
};
