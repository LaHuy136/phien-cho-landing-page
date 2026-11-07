import React, { useState } from 'react';
import { Check, Copy, MessageCircle, FileSpreadsheet, Loader2, Sparkles, ExternalLink } from 'lucide-react';
import {
  BookingRecord,
  getAccessToken,
  getSavedSpreadsheetId,
  getSavedWebhookUrl,
  appendBookingToSheet,
  sendBookingToWebhook,
} from '../services/googleSheetsService';

interface BookingFormProps {
  priceAdult: number;
  priceChildRatio: number;
  serifFontClass?: string;
  onOpenGoogleSheetsModal?: () => void;
  onNewBooking?: (booking: BookingRecord) => void;
  isPublishMode?: boolean;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  priceAdult = 500000,
  priceChildRatio = 0.5,
  serifFontClass = 'font-serif',
  onOpenGoogleSheetsModal,
  onNewBooking,
  isPublishMode = false,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [adultCount, setAdultCount] = useState(2);
  const [childCount, setChildCount] = useState(0);
  const [isBiz, setIsBiz] = useState(false);
  const [bizInfo, setBizInfo] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [bookingSummary, setBookingSummary] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sheetSyncStatus, setSheetSyncStatus] = useState<string | null>(null);

  const formatVnd = (num: number) => {
    return num.toLocaleString('vi-VN') + 'đ';
  };

  const totalPrice = adultCount * priceAdult + childCount * (priceAdult * priceChildRatio);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      setErrorMsg('Bạn nhập họ tên giúp Chồ nhé.');
      return;
    }

    if (!/^[0-9+\s.]{9,14}$/.test(trimmedPhone)) {
      setErrorMsg('Số điện thoại chưa đúng, bạn kiểm tra lại giúp Chồ.');
      return;
    }

    if (adultCount + childCount < 1) {
      setErrorMsg('Bạn chọn ít nhất một vé tham gia nhé.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);
    setSheetSyncStatus(null);

    const bookingData: BookingRecord = {
      name: trimmedName,
      phone: trimmedPhone,
      adultCount,
      childCount,
      totalPrice,
      bizInfo: isBiz ? (bizInfo.trim() || 'Cần tư vấn tiệc công ty') : 'Khách lẻ',
      createdAt: new Date().toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    if (onNewBooking) {
      onNewBooking(bookingData);
    }

    // Try sending to Google Sheets:
    let sheetSuccess = false;
    const token = await getAccessToken();
    const sheetId = getSavedSpreadsheetId();
    const webhookUrl = getSavedWebhookUrl();

    if (token && sheetId) {
      try {
        await appendBookingToSheet(token, sheetId, bookingData);
        sheetSuccess = true;
        setSheetSyncStatus('Đã tự động lưu vào Google Sheet của Chồ Dining');
      } catch (err) {
        console.warn('Could not append via API, trying webhook fallback', err);
      }
    }

    if (!sheetSuccess && webhookUrl) {
      try {
        await sendBookingToWebhook(webhookUrl, bookingData);
        sheetSuccess = true;
        setSheetSyncStatus('Đã đổ dữ liệu thành công về Google Sheet');
      } catch (err) {
        console.warn('Webhook failed', err);
      }
    }

    if (!sheetSuccess) {
      if (sheetId) {
        setSheetSyncStatus('Đã ghi nhận cục bộ (bấm Đồng bộ lên Google Sheet khi mở trang quản trị)');
      }
    }

    setIsSubmitting(false);

    let msg = `Giữ chỗ Phiên chợ ký ức ở Chồ, tối 24/11\nHọ tên: ${trimmedName}\nSĐT: ${trimmedPhone}\nVé người lớn: ${adultCount} · Trẻ 6–12 tuổi: ${childCount}\nTạm tính: ${formatVnd(totalPrice)} (chưa VAT)`;
    if (isBiz) {
      msg += `\nCần chỗ tất niên công ty: ${bizInfo.trim() || 'Cần tư vấn thêm cho đoàn'}`;
    }

    setBookingSummary(msg);
  };


  const handleCopy = () => {
    if (!bookingSummary) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(bookingSummary).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      {/* Left Column: Ticket description */}
      <div className="lg:col-span-6 space-y-4 text-[var(--ink,#2a1d19)]">
        <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--accent,#993820)] ${serifFontClass}`}>
          Một chiếc vé, một phiên chợ
        </h2>

        <div className="flex items-baseline gap-2 pt-1 pb-2">
          <span className={`text-4xl sm:text-5xl font-bold text-[var(--accent,#993820)] ${serifFontClass}`}>
            {formatVnd(priceAdult)}
          </span>
          <span className="text-sm sm:text-base font-medium text-[var(--muted,#6b5a52)]">
            / người lớn · chưa VAT
          </span>
        </div>

        <p className="text-base sm:text-lg leading-relaxed text-[var(--muted,#6b5a52)]">
          Vé là một chiếc rổ tre và những đồng xu tre. Bạn đi chợ bằng xu: đủ để ăn ở cả sáu gánh, không phải tính toán gì.
        </p>

        <ul className="space-y-3 pt-2 text-sm text-[var(--muted,#6b5a52)]">
          <li className="flex items-start gap-3">
            <span className="mt-1 h-3 w-3 shrink-0 rounded-full border-2 border-[var(--accent,#993820)]" />
            <span>Muốn uống thêm một ly bia mát, hay mang về chút nước mắm Nam Ô, bánh tráng Đại Lộc, trà sen thơm, bạn có thể đổi thêm xu tại quầy.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 h-3 w-3 shrink-0 rounded-full border-2 border-[var(--accent,#993820)]" />
            <span>Trẻ 6–12 tuổi đi chợ nửa giá ({formatVnd(priceAdult * priceChildRatio)}), dưới 6 tuổi đi cùng gia đình không mất vé.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 h-3 w-3 shrink-0 rounded-full border-2 border-[var(--accent,#993820)]" />
            <span>Chợ nhỏ thân tình để giữ trọn vẹn không khí ấm áp, chỉ phát hành giới hạn 70 vé.</span>
          </li>
        </ul>

        <div className="rounded-xl border border-dashed border-[var(--line,#dccfbd)] bg-amber-950/5 p-4 text-sm text-[var(--ink,#2a1d19)]">
          <p className="m-0">
            Nếu công ty bạn đang tìm một không gian độc đáo và hoài niệm cho bữa tiệc tất niên cuối năm, cứ tích chọn ở form bên cạnh. Đội ngũ Chồ sẽ liên hệ trao đổi chi tiết trong vòng 24 giờ.
          </p>
        </div>
      </div>

      {/* Right Column: Interactive Form */}
      <div className="lg:col-span-6">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-2xl border border-[var(--line,#dccfbd)] bg-[var(--card,#fbf7f0)] p-6 sm:p-8 shadow-sm space-y-4"
        >
          <div>
            <label className="block text-sm font-semibold text-[var(--ink,#2a1d19)] mb-1">
              Họ và tên của bạn
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Nguyễn Văn An"
              className="w-full rounded-xl border border-[var(--line,#dccfbd)] bg-[var(--bg,#f4efe6)] px-4 py-2.5 text-sm text-[var(--ink,#2a1d19)] focus:outline-none focus:ring-2 focus:ring-[var(--gold,#d99c48)]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--ink,#2a1d19)] mb-1">
              Số điện thoại (dùng Zalo)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ví dụ: 0905 123 456"
              className="w-full rounded-xl border border-[var(--line,#dccfbd)] bg-[var(--bg,#f4efe6)] px-4 py-2.5 text-sm text-[var(--ink,#2a1d19)] focus:outline-none focus:ring-2 focus:ring-[var(--gold,#d99c48)]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[var(--ink,#2a1d19)] mb-1">
                Vé người lớn
              </label>
              <input
                type="number"
                min={0}
                max={30}
                value={adultCount}
                onChange={(e) => setAdultCount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full rounded-xl border border-[var(--line,#dccfbd)] bg-[var(--bg,#f4efe6)] px-4 py-2 text-sm text-[var(--ink,#2a1d19)] focus:outline-none focus:ring-2 focus:ring-[var(--gold,#d99c48)]"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[var(--ink,#2a1d19)] mb-1">
                Trẻ em 6–12 tuổi
              </label>
              <input
                type="number"
                min={0}
                max={30}
                value={childCount}
                onChange={(e) => setChildCount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full rounded-xl border border-[var(--line,#dccfbd)] bg-[var(--bg,#f4efe6)] px-4 py-2 text-sm text-[var(--ink,#2a1d19)] focus:outline-none focus:ring-2 focus:ring-[var(--gold,#d99c48)]"
              />
            </div>
          </div>

          <div className="pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer text-sm text-[var(--ink,#2a1d19)]">
              <input
                type="checkbox"
                checked={isBiz}
                onChange={(e) => setIsBiz(e.target.checked)}
                className="h-4 w-4 rounded border-amber-300 text-[var(--accent,#993820)] focus:ring-[var(--gold,#d99c48)]"
              />
              <span>Công ty tôi đang tìm chỗ tổ chức tiệc tất niên</span>
            </label>

            {isBiz && (
              <div className="mt-3">
                <input
                  type="text"
                  value={bizInfo}
                  onChange={(e) => setBizInfo(e.target.value)}
                  placeholder="Tên công ty và số lượng khách dự kiến..."
                  className="w-full rounded-xl border border-[var(--line,#dccfbd)] bg-[var(--bg,#f4efe6)] px-4 py-2 text-sm text-[var(--ink,#2a1d19)] focus:outline-none focus:ring-2 focus:ring-[var(--gold,#d99c48)]"
                />
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-dashed border-[var(--line,#dccfbd)]">
            <div className="flex justify-between items-center text-sm font-semibold text-[var(--ink,#2a1d19)]">
              <span>Tạm tính ({adultCount + childCount} vé):</span>
              <span className="text-base text-[var(--accent,#993820)] font-bold">
                {formatVnd(totalPrice)} <span className="text-xs text-[var(--muted,#6b5a52)] font-normal">(chưa VAT)</span>
              </span>
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-600 font-medium" role="alert">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-[var(--gold,#d99c48)] py-3 px-6 text-sm font-bold text-[#2a1d19] transition duration-200 hover:brightness-105 active:scale-[0.99] cursor-pointer shadow-sm flex items-center justify-center gap-2 disabled:opacity-75"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xử lý đặt chỗ...</span>
              </>
            ) : (
              <span>Giữ chỗ đi chợ ngay</span>
            )}
          </button>

          {/* Admin / Manager Connection Link */}
          {!isPublishMode && onOpenGoogleSheetsModal && (
            <div className="pt-1 flex items-center justify-between text-xs text-stone-500 border-t border-dashed border-[var(--line,#dccfbd)] mt-2">
              <span className="flex items-center gap-1.5 text-emerald-800 font-medium">
                <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                <span>Dữ liệu đổ về Google Sheet</span>
              </span>
              <button
                type="button"
                onClick={onOpenGoogleSheetsModal}
                className="text-emerald-700 hover:text-emerald-900 font-semibold underline underline-offset-2 transition cursor-pointer"
              >
                Cấu hình bảng tính &rarr;
              </button>
            </div>
          )}

          {/* Submission Feedback Modal/Card */}
          {bookingSummary && (
            <div className="mt-4 rounded-xl border-2 border-[var(--accent,#993820)] bg-[var(--bg,#f4efe6)] p-5 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-sm font-bold text-[var(--accent,#993820)] mb-2">
                <Check className="w-4 h-4" />
                <span>Thông tin giữ chỗ của bạn đã sẵn sàng!</span>
              </div>

              {sheetSyncStatus && (
                <div className="mb-3 rounded-lg bg-emerald-100/80 border border-emerald-300 p-2.5 text-xs font-semibold text-emerald-900 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{sheetSyncStatus}</span>
                </div>
              )}

              <pre className="whitespace-pre-wrap rounded-lg bg-[var(--card,#fbf7f0)] p-3.5 text-xs text-[var(--ink,#2a1d19)] border border-[var(--line,#dccfbd)] font-mono leading-relaxed">
                {bookingSummary}
              </pre>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[var(--gold,#d99c48)] px-4 py-2 text-xs font-bold text-[#2a1d19] hover:brightness-105 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Đã sao chép vào bộ nhớ!' : 'Sao chép tin nhắn'}</span>
                </button>

                <a
                  href={`https://zalo.me?text=${encodeURIComponent(bookingSummary)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line,#dccfbd)] bg-white px-4 py-2 text-xs font-medium text-[var(--ink,#2a1d19)] hover:bg-amber-50 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-blue-600" />
                  <span>Gửi qua Zalo</span>
                </a>

                {onOpenGoogleSheetsModal && (
                  <button
                    type="button"
                    onClick={onOpenGoogleSheetsModal}
                    className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-900 hover:bg-emerald-100 transition cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Xem Google Sheet</span>
                  </button>
                )}
              </div>

              <p className="mt-2.5 text-[11px] leading-relaxed text-[var(--muted,#6b5a52)]">
                Bạn sao chép tin nhắn này rồi gửi qua Zalo hoặc Fanpage Chồ Dining để nhà hàng xác nhận giữ chỗ cho bạn nhé.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
