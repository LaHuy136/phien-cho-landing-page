import React, { useState } from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';
import { StallItem } from '../types';

interface StallCardProps {
  stall: StallItem;
  index: number;
  stallsStyle: 'card-image' | 'minimal-classic' | 'floating-badge';
  isPublishMode: boolean;
  onEditImage?: (stall: StallItem) => void;
  serifFontClass?: string;
}

export const StallCard: React.FC<StallCardProps> = ({
  stall,
  index,
  stallsStyle,
  isPublishMode,
  onEditImage,
  serifFontClass = 'font-serif',
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <li
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--line,#dccfbd)] bg-[var(--card,#fbf7f0)] transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      {/* Card Image if enabled */}
      {stallsStyle === 'card-image' && stall.imageUrl && !imageError && (
        <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-amber-900/10">
          <img
            src={stall.imageUrl}
            alt={stall.imageAlt || stall.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
          
          {/* Quick edit button for user when not in publish mode */}
          {!isPublishMode && onEditImage && (
            <button
              onClick={() => onEditImage(stall)}
              type="button"
              className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-xs transition hover:bg-amber-600"
              title="Nhấn để đổi hình ảnh gánh này"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Đổi ảnh</span>
            </button>
          )}

          <span className="absolute bottom-2 left-3 rounded-sm bg-black/50 px-2 py-0.5 text-[11px] font-medium tracking-wider text-amber-200 uppercase backdrop-blur-xs">
            Gánh 0{index + 1}
          </span>
        </div>
      )}

      {/* Fallback image / edit prompt if minimal or image error */}
      {stallsStyle === 'card-image' && (imageError || !stall.imageUrl) && !isPublishMode && (
        <div
          onClick={() => onEditImage && onEditImage(stall)}
          className="flex h-28 w-full cursor-pointer flex-col items-center justify-center border-b border-dashed border-[var(--line,#dccfbd)] bg-amber-950/5 text-amber-800/70 hover:bg-amber-950/10 transition"
        >
          <ImageIcon className="h-6 w-6 mb-1 opacity-60" />
          <span className="text-xs font-medium">Nhấn để thêm hình ảnh món ăn</span>
        </div>
      )}

      {/* Floating circular badge style */}
      {stallsStyle === 'floating-badge' && stall.imageUrl && !imageError && (
        <div className="pt-4 px-5 flex items-center justify-between">
          <span className="text-xs font-semibold text-amber-800 tracking-wider uppercase">
            Gánh số {index + 1}
          </span>
          <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-amber-600/40 shadow-xs">
            <img
              src={stall.imageUrl}
              alt={stall.name}
              className="h-full w-full object-cover"
              onError={() => setImageError(true)}
            />
          </div>
        </div>
      )}

      {/* Content body */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <h3
            className={`text-xl sm:text-2xl font-bold tracking-tight text-[var(--ink,#2a1d19)] ${serifFontClass} mb-2`}
          >
            {stall.name}
          </h3>
          <p className="text-sm leading-relaxed text-[var(--muted,#6b5a52)]">
            {stall.desc}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-dashed border-[var(--line,#dccfbd)] text-xs font-medium text-[var(--ink,#2a1d19)] flex items-center justify-between">
          <span>{stall.sub}</span>
          {!isPublishMode && stallsStyle !== 'card-image' && onEditImage && (
            <button
              onClick={() => onEditImage(stall)}
              className="text-[11px] text-amber-800 underline hover:text-amber-900"
            >
              Chọn ảnh
            </button>
          )}
        </div>
      </div>
    </li>
  );
};
