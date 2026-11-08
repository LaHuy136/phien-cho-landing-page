import React, { useState, useEffect, useRef } from 'react';
import { Camera, Image as ImageIcon, Upload, AlertCircle, RefreshCw, Check } from 'lucide-react';
import { StallItem } from '../types';
import { compressImageFile } from '../utils/imageUtils';

interface StallCardProps {
  stall: StallItem;
  index: number;
  stallsStyle: 'card-image' | 'minimal-classic' | 'floating-badge';
  isPublishMode: boolean;
  onEditImage?: (stall: StallItem) => void;
  onUpdateStallImage?: (stallId: string, newUrl: string) => void;
  serifFontClass?: string;
}

export const StallCard: React.FC<StallCardProps> = ({
  stall,
  index,
  stallsStyle,
  isPublishMode,
  onEditImage,
  onUpdateStallImage,
  serifFontClass = 'font-serif',
}) => {
  const [imageError, setImageError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const cardFileInputRef = useRef<HTMLInputElement>(null);

  // CRITICAL FIX: Reset image error state whenever stall.imageUrl changes!
  useEffect(() => {
    setImageError(false);
  }, [stall.imageUrl]);

  const handleCardFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdateStallImage) {
      setIsUploading(true);
      try {
        const compressed = await compressImageFile(file);
        onUpdateStallImage(stall.id, compressed);
        setImageError(false);
      } catch (err) {
        console.warn('Could not compress card image', err);
      } finally {
        setIsUploading(false);
        e.target.value = '';
      }
    }
  };

  return (
    <li
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--line,#dccfbd)] bg-[var(--card,#fbf7f0)] transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      {/* Hidden file input for direct on-card image upload */}
      <input
        ref={cardFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleCardFileSelect}
      />

      {/* Card Image if enabled and valid */}
      {stallsStyle === 'card-image' && stall.imageUrl && !imageError && (
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-stone-900/10">
          <img
            src={stall.imageUrl}
            alt={stall.imageAlt || stall.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70" />

          {/* Quick edit & upload button for user when not in publish mode */}
          {!isPublishMode && (
            <div className="absolute right-2.5 top-2.5 flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
              {onUpdateStallImage && (
                <button
                  type="button"
                  onClick={() => cardFileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex items-center gap-1 rounded-full bg-black/75 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-amber-700 border border-white/20 shadow-md cursor-pointer"
                  title="Tải ảnh trực tiếp từ máy tính"
                >
                  <Upload className="w-3 h-3 text-amber-300" />
                  <span>{isUploading ? 'Đang tải...' : 'Tải ảnh'}</span>
                </button>
              )}

              {onEditImage && (
                <button
                  onClick={() => onEditImage(stall)}
                  type="button"
                  className="flex items-center gap-1 rounded-full bg-black/75 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-amber-700 border border-white/20 shadow-md cursor-pointer"
                  title="Mở thanh công cụ để chọn ảnh mẫu hoặc dán link"
                >
                  <Camera className="w-3 h-3 text-amber-300" />
                  <span>Đổi ảnh</span>
                </button>
              )}
            </div>
          )}

          <span className="absolute bottom-2.5 left-3 rounded-md bg-black/60 px-2.5 py-0.5 text-[11px] font-bold tracking-wider text-amber-200 uppercase backdrop-blur-xs border border-white/10">
            Gánh 0{index + 1}
          </span>
        </div>
      )}

      {/* Fallback image / recovery prompt if minimal or image error occurred */}
      {stallsStyle === 'card-image' && (imageError || !stall.imageUrl) && !isPublishMode && (
        <div className="flex min-h-[140px] w-full flex-col items-center justify-center border-b border-dashed border-amber-300 bg-amber-50/60 p-4 text-center">
          {imageError ? (
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-900">
                <AlertCircle className="h-4 w-4 text-amber-700 shrink-0" />
                <span>Link ảnh hiện tại bị chặn hoặc không hiển thị</span>
              </div>
              <p className="text-[11px] text-stone-600 max-w-xs">
                Bạn có thể tải ảnh trực tiếp từ máy lên (chắc chắn xem được 100%):
              </p>
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => cardFileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-amber-700 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-amber-800 transition cursor-pointer"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Tải ảnh từ máy tính</span>
                </button>
                {onEditImage && (
                  <button
                    type="button"
                    onClick={() => onEditImage(stall)}
                    className="inline-flex items-center gap-1 rounded-lg border border-stone-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-stone-800 hover:bg-stone-50 transition cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5 text-amber-700" />
                    <span>Chọn ảnh mẫu</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div
              onClick={() => (onEditImage ? onEditImage(stall) : cardFileInputRef.current?.click())}
              className="flex w-full cursor-pointer flex-col items-center justify-center py-4 text-amber-800/80 hover:text-amber-950 transition"
            >
              <ImageIcon className="h-7 w-7 mb-1.5 opacity-70 text-amber-700" />
              <span className="text-xs font-bold">Chưa có ảnh cho {stall.name}</span>
              <span className="text-[11px] text-stone-500 mt-0.5 underline">
                Nhấn vào đây để tải ảnh hoặc chọn ảnh mẫu
              </span>
            </div>
          )}
        </div>
      )}

      {/* Floating circular badge style */}
      {stallsStyle === 'floating-badge' && stall.imageUrl && !imageError && (
        <div className="pt-4 px-5 flex items-center justify-between">
          <span className="text-xs font-semibold text-amber-800 tracking-wider uppercase">
            Gánh số {index + 1}
          </span>
          <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-amber-600/50 shadow-md">
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
          <div className="flex items-center justify-between mb-1.5">
            <h3
              className={`text-xl sm:text-2xl font-bold tracking-tight text-[var(--ink,#2a1d19)] ${serifFontClass}`}
            >
              {stall.name}
            </h3>
            {!isPublishMode && onEditImage && stallsStyle !== 'card-image' && (
              <button
                type="button"
                onClick={() => onEditImage(stall)}
                className="text-xs text-amber-800 font-semibold underline hover:text-amber-950"
              >
                Đổi ảnh
              </button>
            )}
          </div>
          <p className="text-sm leading-relaxed text-[var(--muted,#6b5a52)]">
            {stall.desc}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-dashed border-[var(--line,#dccfbd)] text-xs font-medium text-[var(--ink,#2a1d19)] flex items-center justify-between">
          <span>{stall.sub}</span>
          {!isPublishMode && onEditImage && (
            <button
              onClick={() => onEditImage(stall)}
              className="text-[11px] font-semibold text-amber-800 hover:text-amber-950 underline"
            >
              Chỉnh sửa
            </button>
          )}
        </div>
      </div>
    </li>
  );
};
