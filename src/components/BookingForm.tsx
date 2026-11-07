import React, { useState } from 'react';
import {
  Check,
  Copy,
  MessageCircle,
  FileSpreadsheet,
  Loader2,
  AlertCircle,
  Link as LinkIcon,
} from 'lucide-react';
import {
  BookingRecord,
  getAccessToken,
  googleSignIn,
  createBookingSpreadsheet,
  getSavedSpreadsheetId,
  saveSpreadsheetId,
  extractSpreadsheetId,
  getSavedWebhookUrl,
  appendBookingToSheet,
  sendBookingToWebhook,
  formatPhoneNumberForSheet,
} from '../services/googleSheetsService';

interface BookingFormProps {
  priceAdult: number;
  priceChildRatio: number;
  serifFontClass?: string;
  onNewBooking?: (booking: BookingRecord) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  priceAdult = 500000,
  priceChildRatio = 0.5,
  serifFontClass = 'font-serif',
  onNewBooking,
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
  const [activeSheetId, setActiveSheetId] = useState<string | null>(() => getSavedSpreadsheetId());
  const [lastBookingData, setLastBookingData] = useState<BookingRecord | null>(null);
  const [isSyncingManual, setIsSyncingManual] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [pastedUrl, setPastedUrl] = useState('');

  const [zaloToast, setZaloToast] = useState(false);

  const formatVnd = (num: number) => {
    return num.toLocaleString('vi-VN') + 'đ';
  };

  const totalPrice = adultCount * priceAdult + childCount * (priceAdult * priceChildRatio);

  const handleOpenZalo = () => {
    handleCopy();
    setZaloToast(true);
    setTimeout(() => setZaloToast(false), 4000);
    window.open('https://zalo.me/0898236879', '_blank');
  };

  const handleSavePastedSheetUrl = () => {
    if (!pastedUrl.trim()) return;
    const cleanId = extractSpreadsheetId(pastedUrl);
    saveSpreadsheetId(cleanId);
    setActiveSheetId(cleanId);
    setShowLinkInput(false);
    alert('Đã liên kết thành công với Google Sheet ID: ' + cleanId);
  };

  const handleManualSyncToSheet = async () => {
    if (!lastBookingData) return;
    setIsSyncingManual(true);
    try {
      let token = await getAccessToken();
      if (!token) {
        const signinRes = await googleSignIn();
        token = signinRes?.accessToken || null;
      }

      if (!token) {
        alert('Vui lòng chọn tài khoản Google để cấp quyền lưu vào Google Sheet của bạn.');
        setIsSyncingManual(false);
        return;
      }

      let sheetId = getSavedSpreadsheetId() || activeSheetId;
      if (!sheetId) {
        const newSheet = await createBookingSpreadsheet(token);
        sheetId = newSheet.id;
        setActiveSheetId(newSheet.id);
      }

      await appendBookingToSheet(token, sheetId, lastBookingData);
      setActiveSheetId(sheetId);
      setSheetSyncStatus('Dữ liệu giữ chỗ đã đổ về Google Sheet thành công!');
    } catch (err: any) {
      console.error(err);
      alert('Không thể ghi vào Google Sheet: ' + (err.message || 'Lỗi'));
    } finally {
      setIsSyncingManual(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    // 1. Validate Họ và tên (tối thiểu 3 ký tự, chỉ gồm chữ cái hợp lệ)
    if (!trimmedName || trimmedName.length < 3) {
      setErrorMsg('Họ và tên cần có ít nhất 3 ký tự. Bạn vui lòng nhập đầy đủ họ tên giúp Chồ nhé.');
      return;
    }

    if (!/^[a-zA-ZÀ-ỹ\s.'-]+$/.test(trimmedName)) {
      setErrorMsg('Họ và tên không hợp lệ. Vui lòng chỉ nhập chữ cái tiếng Việt hoặc tiếng Anh.');
      return;
    }

    // 2. Validate Số điện thoại (10 chữ số bắt đầu bằng 09, 08, 07, 05, 03 hoặc số quốc tế hợp lệ)
    const cleanPhone = trimmedPhone.replace(/[\s.-]/g, '');
    const isForeign =
      (/^\+[1-9]/.test(cleanPhone) && !cleanPhone.startsWith('+84')) ||
      (/^00[1-9]/.test(cleanPhone) && !cleanPhone.startsWith('0084'));

    let normalizedPhone = trimmedPhone;

    if (isForeign) {
      if (!/^\+?[0-9]{8,16}$/.test(cleanPhone)) {
        setErrorMsg('Số điện thoại quốc tế chưa đúng định dạng. Bạn kiểm tra lại mã vùng quốc tế giúp Chồ nhé.');
        return;
      }
      normalizedPhone = cleanPhone;
    } else {
      // Chuẩn hóa đầu số Việt Nam (+84 -> 0)
      let vn = cleanPhone;
      if (vn.startsWith('+84')) {
        vn = '0' + vn.slice(3);
      } else if (vn.startsWith('84') && vn.length === 11) {
        vn = '0' + vn.slice(2);
      }

      // Kiểm tra chính xác 10 chữ số bắt đầu bằng 03, 05, 07, 08, 09
      const vnPhoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;
      if (!vnPhoneRegex.test(vn)) {
        setErrorMsg(
          'Số điện thoại phải gồm đúng 10 chữ số và bắt đầu bằng đầu số 09, 08, 07, 05 hoặc 03 (Ví dụ: 0905123456).'
        );
        return;
      }
      normalizedPhone = vn;
    }

    if (adultCount + childCount < 1) {
      setErrorMsg('Bạn chọn ít nhất một vé tham gia nhé.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);
    setSheetSyncStatus('Đang xử lý và gửi dữ liệu về Google Sheet...');

    const bookingData: BookingRecord = {
      name: trimmedName,
      phone: normalizedPhone,
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

    setLastBookingData(bookingData);

    if (onNewBooking) {
      onNewBooking(bookingData);
    }

    // Send directly to Google Sheets
    let sheetSuccess = false;
    let token = await getAccessToken();
    let sheetId = getSavedSpreadsheetId() || activeSheetId;
    const webhookUrl = getSavedWebhookUrl();

    // If no token in memory, connect Google
    if (!token) {
      try {
        const signinRes = await googleSignIn();
        if (signinRes?.accessToken) {
          token = signinRes.accessToken;
        }
      } catch (authErr) {
        console.warn('Google sign-in skipped or closed', authErr);
      }
    }

    if (token) {
      // Auto-create spreadsheet if none connected yet
      if (!sheetId) {
        try {
          const newSheet = await createBookingSpreadsheet(token);
          sheetId = newSheet.id;
          setActiveSheetId(newSheet.id);
        } catch (e) {
          console.warn('Could not auto-create sheet', e);
        }
      }

      if (sheetId) {
        try {
          await appendBookingToSheet(token, sheetId, bookingData);
          sheetSuccess = true;
          setActiveSheetId(sheetId);
          setSheetSyncStatus('Dữ liệu giữ chỗ đã đổ về Google Sheet thành công!');
        } catch (err) {
          console.warn('Could not append via API, fallback', err);
        }
      }
    }

    if (webhookUrl) {
      try {
        await sendBookingToWebhook(webhookUrl, bookingData);
        sheetSuccess = true;
        setSheetSyncStatus('Dữ liệu giữ chỗ đã đổ về Google Sheet thành công!');
      } catch (err) {
        console.warn('Webhook failed', err);
      }
    }

    if (!sheetSuccess) {
      setSheetSyncStatus('Đã ghi nhận thông tin. Nhấn nút bên dưới để đổ trực tiếp vào Google Sheet.');
    }

    setIsSubmitting(false);

    const formattedRaw = formatPhoneNumberForSheet(trimmedPhone);
    const displayPhone = formattedRaw.replace(/^'/, '');

    let msg = `Giữ chỗ Phiên chợ ký ức ở Chồ, tối 24/11\nHọ tên: ${trimmedName}\nSĐT: ${displayPhone}\nVé người lớn: ${adultCount} · Trẻ 6–12 tuổi: ${childCount}\nTạm tính: ${formatVnd(totalPrice)} (chưa VAT)`;
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
            <span className="text-[11px] text-[var(--muted,#6b5a52)] mt-1 block">
              Tối thiểu 3 ký tự (Ví dụ: Nguyễn Văn An)
            </span>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--ink,#2a1d19)] mb-1">
              Số điện thoại (Zalo hoặc Whatsapp)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0905 123 456 hoặc +84... / Quốc tế (Whatsapp)"
              className="w-full rounded-xl border border-[var(--line,#dccfbd)] bg-[var(--bg,#f4efe6)] px-4 py-2.5 text-sm text-[var(--ink,#2a1d19)] focus:outline-none focus:ring-2 focus:ring-[var(--gold,#d99c48)]"
              required
            />
            <span className="text-[11px] text-[var(--muted,#6b5a52)] mt-1 block">
              Gồm đúng 10 số, bắt đầu bằng 09, 08, 07, 05, 03 (hoặc SĐT quốc tế)
            </span>
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
            <div className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-xs text-rose-800 font-semibold flex items-start gap-2 animate-in fade-in" role="alert">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
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

          {/* Submission Feedback Modal/Card */}
          {bookingSummary && (
            <div className="mt-4 rounded-xl border-2 border-[var(--accent,#993820)] bg-[var(--bg,#f4efe6)] p-5 animate-in fade-in duration-300 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-[var(--accent,#993820)]">
                <Check className="w-4 h-4" />
                <span>Thông tin giữ chỗ của bạn đã sẵn sàng!</span>
              </div>

              {/* Zalo Toast notification */}
              {zaloToast && (
                <div className="rounded-lg bg-blue-50 border border-blue-300 p-2.5 text-xs font-semibold text-blue-900 flex items-center gap-2 animate-in fade-in">
                  <MessageCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Đã sao chép nội dung! Đang chuyển đến Zalo hotline Chồ Dining (0898 236 879)...</span>
                </div>
              )}

              {/* Status */}
              {sheetSyncStatus?.includes('thành công') ? (
                <div className="rounded-lg bg-emerald-100/90 border border-emerald-300 p-2.5 text-xs font-semibold text-emerald-900 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Dữ liệu giữ chỗ đã được lưu thành công!</span>
                </div>
              ) : (
                <div className="rounded-lg bg-amber-50 border border-amber-300 p-3 text-xs space-y-2">
                  <div className="flex items-start gap-2 text-amber-950 font-medium">
                    <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span>
                      Dữ liệu giữ chỗ đã được ghi nhận trên máy. Nhấn nút bên dưới để cấp quyền và đổ trực tiếp vào dòng tiếp theo của Google Sheet:
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleManualSyncToSheet}
                    disabled={isSyncingManual}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 text-xs font-bold shadow-xs transition duration-150 cursor-pointer disabled:opacity-50"
                  >
                    {isSyncingManual ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang kết nối & ghi vào Google Sheet...</span>
                      </>
                    ) : (
                      <>
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>⚡ Nhấn vào đây để lưu vào Google Sheet</span>
                      </>
                    )}
                  </button>

                  <div className="pt-1 flex items-center justify-between text-[11px] text-stone-600">
                    <span>
                      {activeSheetId ? `Đang trỏ về Sheet ID: ${activeSheetId.slice(0, 10)}...` : 'Chưa có Sheet ID'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowLinkInput(!showLinkInput)}
                      className="underline text-stone-700 hover:text-black font-medium cursor-pointer"
                    >
                      {showLinkInput ? 'Đóng' : 'Dán link Sheet của bạn'}
                    </button>
                  </div>

                  {showLinkInput && (
                    <div className="pt-2 border-t border-amber-200/80 space-y-1.5">
                      <label className="block text-[11px] font-semibold text-stone-800">
                        Dán URL Google Sheet bạn đang mở (ví dụ file trong ảnh):
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={pastedUrl}
                          onChange={(e) => setPastedUrl(e.target.value)}
                          placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                          className="flex-1 rounded-md border border-stone-300 px-2 py-1 text-xs bg-white text-stone-800 focus:outline-emerald-700 font-mono"
                        />
                        <button
                          type="button"
                          onClick={handleSavePastedSheetUrl}
                          className="px-3 py-1 rounded-md bg-stone-800 text-white text-xs font-semibold hover:bg-stone-900 transition cursor-pointer"
                        >
                          Lưu
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <pre className="whitespace-pre-wrap rounded-lg bg-[var(--card,#fbf7f0)] p-3.5 text-xs text-[var(--ink,#2a1d19)] border border-[var(--line,#dccfbd)] font-mono leading-relaxed">
                {bookingSummary}
              </pre>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[var(--gold,#d99c48)] px-4 py-2 text-xs font-bold text-[#2a1d19] hover:brightness-105 transition cursor-pointer shadow-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Đã sao chép vào bộ nhớ!' : 'Sao chép tin nhắn'}</span>
                </button>

                {/* Zalo Button directly routing to 0898 236 879 */}
                <button
                  type="button"
                  onClick={handleOpenZalo}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#0068ff] hover:bg-[#0052cc] text-white px-4 py-2 text-xs font-bold transition duration-150 cursor-pointer shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white text-white" />
                  <span>Gửi qua Zalo Chồ (0898 236 879)</span>
                </button>
              </div>

              <p className="text-[11px] leading-relaxed text-[var(--muted,#6b5a52)]">
                Khi bấm <b>&ldquo;Gửi qua Zalo Chồ&rdquo;</b>, thông tin đặt chỗ sẽ được tự động sao chép và mở trực tiếp cuộc trò chuyện với hotline <b>0898 236 879</b>. Bạn chỉ cần nhấn Dán (Paste) để gửi cho Chồ Dining xác nhận.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
