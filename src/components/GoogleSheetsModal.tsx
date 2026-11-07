import React, { useState, useEffect } from 'react';
import {
  X,
  FileSpreadsheet,
  Check,
  ExternalLink,
  RefreshCw,
  Copy,
  Plus,
  AlertCircle,
  HelpCircle,
  LogOut,
  UploadCloud,
} from 'lucide-react';
import {
  auth,
  googleSignIn,
  logoutGoogle,
  getAccessToken,
  createBookingSpreadsheet,
  getSavedSpreadsheetId,
  saveSpreadsheetId,
  getSavedWebhookUrl,
  saveWebhookUrl,
  BookingRecord,
  appendBookingToSheet,
} from '../services/googleSheetsService';
import { User } from 'firebase/auth';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  recentBookings?: BookingRecord[];
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  recentBookings = [],
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [spreadsheetId, setSpreadsheetId] = useState<string>(() => getSavedSpreadsheetId() || '');
  const [inputSheetId, setInputSheetId] = useState(spreadsheetId);
  const [webhookUrl, setWebhookUrl] = useState<string>(() => getSavedWebhookUrl());
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const handleLogin = async () => {
    setIsLoading(true);
    setStatusMsg(null);
    try {
      const res = await googleSignIn();
      if (res?.user) {
        setCurrentUser(res.user);
        setStatusMsg({ text: `Đã kết nối tài khoản Google: ${res.user.email}`, type: 'success' });
      }
    } catch (err: any) {
      console.error(err);
      setStatusMsg({ text: err.message || 'Đăng nhập Google thất bại', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutGoogle();
      setCurrentUser(null);
      setStatusMsg({ text: 'Đã đăng xuất tài khoản Google.', type: 'success' });
    } catch (e: any) {
      setStatusMsg({ text: 'Không thể đăng xuất', type: 'error' });
    }
  };

  const handleCreateNewSheet = async () => {
    const token = await getAccessToken();
    if (!token) {
      setStatusMsg({ text: 'Vui lòng đăng nhập Google trước khi tạo bảng tính.', type: 'error' });
      return;
    }

    setIsLoading(true);
    setStatusMsg(null);
    try {
      const { id, url } = await createBookingSpreadsheet(token);
      setSpreadsheetId(id);
      setInputSheetId(id);
      setStatusMsg({
        text: `Đã tạo thành công Google Sheet mới! Dữ liệu khách đặt chỗ sẽ được lưu vào đây.`,
        type: 'success',
      });
    } catch (err: any) {
      console.error(err);
      setStatusMsg({ text: err.message || 'Không thể tạo Google Sheet', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSheetId = () => {
    const trimmed = inputSheetId.trim();
    saveSpreadsheetId(trimmed);
    setSpreadsheetId(trimmed);
    setStatusMsg({ text: 'Đã lưu ID Google Sheet.', type: 'success' });
  };

  const handleSaveWebhook = () => {
    saveWebhookUrl(webhookUrl);
    setStatusMsg({ text: 'Đã lưu Webhook URL Google Apps Script.', type: 'success' });
  };

  const handleSyncAllRecent = async () => {
    const token = await getAccessToken();
    if (!token || !spreadsheetId) {
      setStatusMsg({ text: 'Vui lòng đăng nhập và chọn Google Sheet trước khi đồng bộ.', type: 'error' });
      return;
    }

    if (recentBookings.length === 0) {
      setStatusMsg({ text: 'Chưa có lượt đặt chỗ nào trong phiên làm việc hiện tại.', type: 'error' });
      return;
    }

    setIsSyncing(true);
    try {
      for (const booking of recentBookings) {
        await appendBookingToSheet(token, spreadsheetId, booking);
      }
      setStatusMsg({
        text: `Đã đồng bộ thành công ${recentBookings.length} lượt giữ chỗ vào Google Sheet!`,
        type: 'success',
      });
    } catch (err: any) {
      console.error(err);
      setStatusMsg({ text: err.message || 'Đồng bộ thất bại', type: 'error' });
    } finally {
      setIsSyncing(false);
    }
  };

  const appsScriptCode = `// Google Apps Script để nhận đơn đặt chỗ từ Landing Page gửi thẳng vào Google Sheet
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Nếu dòng 1 chưa có tiêu đề, tạo tiêu đề chuẩn 8 cột
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Thời gian đặt", "Họ và tên khách", "Số điện thoại", "Vé người lớn", "Vé trẻ em (6-12t)", "Tạm tính (VND)", "Yêu cầu tiệc / Ghi chú", "Trạng thái xử lý"]);
    }
    
    // Định dạng số điện thoại: giữ số 0 hoặc ghi chú Whatsapp nếu số quốc tế
    var rawPhone = String(data.phone || '').trim();
    var digitsOnly = rawPhone.replace(/[\\s.-]/g, '');
    var formattedPhone = rawPhone;
    
    if (/^\\+[1-9]/.test(digitsOnly) && !digitsOnly.startsWith('+84')) {
      formattedPhone = "'" + rawPhone + " (Whatsapp)";
    } else {
      var vn = digitsOnly;
      if (vn.startsWith('+84')) vn = '0' + vn.slice(3);
      else if (vn.startsWith('84') && vn.length >= 11) vn = '0' + vn.slice(2);
      else if (vn.length === 9 && /^[35789]/.test(vn)) vn = '0' + vn;
      else if (!vn.startsWith('0') && vn.length >= 9) vn = '0' + vn;
      formattedPhone = "'" + vn;
    }
    
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString("vi-VN"),
      data.name,
      formattedPhone,
      data.adultCount,
      data.childCount,
      data.totalPrice,
      data.bizInfo || "Khách lẻ",
      "Mới đặt - Cần liên hệ"
    ]);

    // Thiết lập trình đơn thả xuống (Dropdown) cho cột Trạng thái xử lý
    var rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Mới đặt - Cần liên hệ", "Đã liên hệ và Thanh toán"], true)
      .build();
    sheet.getRange("H2:H1000").setDataValidation(rule);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

  const copyScript = () => {
    navigator.clipboard.writeText(appsScriptCode).then(() => {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 px-5 sm:px-6 py-4 bg-emerald-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-sm">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base sm:text-lg">Đổ dữ liệu giữ chỗ về Google Sheet</h3>
              <p className="text-xs text-stone-600">Tự động ghi nhận danh sách khách đặt vé vào bảng tính Google</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-200 hover:text-stone-700 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm text-stone-700">
          {statusMsg && (
            <div
              className={`rounded-xl p-3.5 text-xs sm:text-sm font-medium flex items-start gap-2.5 ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border border-rose-200'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <Check className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-4 w-4 text-rose-700 shrink-0 mt-0.5" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* SECTION 1: Google Account Connection */}
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                1. Tài khoản Google kết nối
              </span>
              {currentUser && (
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-100/70 px-2 py-0.5 rounded-full">
                  <Check className="w-3.5 h-3.5" />
                  Đã kết nối
                </span>
              )}
            </div>

            {currentUser ? (
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-3">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || ''}
                      className="h-10 w-10 rounded-full border border-stone-300"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-700 text-white font-bold">
                      {currentUser.email?.[0].toUpperCase() || 'G'}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-stone-900 text-sm">
                      {currentUser.displayName || 'Google User'}
                    </div>
                    <div className="text-xs text-stone-500">{currentUser.email}</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-stone-600 leading-relaxed">
                  Đăng nhập với tài khoản Google (ví dụ <code>lahuy136@gmail.com</code>) để ứng dụng có quyền tạo và ghi dữ liệu trực tiếp vào Google Drive &amp; Sheets của bạn.
                </p>

                {/* Official GSI Styled Button */}
                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-lg border border-stone-300 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-stone-800 shadow-xs hover:bg-stone-50 hover:shadow-sm active:bg-stone-100 transition cursor-pointer disabled:opacity-50"
                >
                  <svg className="h-5 w-5" viewBox="0 0 48 48">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                  <span>{isLoading ? 'Đang kết nối...' : 'Đăng nhập với Google (Sign in with Google)'}</span>
                </button>
              </div>
            )}
          </div>

          {/* SECTION 2: Spreadsheet Management */}
          <div className="rounded-xl border border-stone-200 bg-white p-4 space-y-3.5">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
              2. Bảng tính Google Sheet nhận dữ liệu
            </span>

            {spreadsheetId ? (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-5 w-5 text-emerald-700" />
                    <span className="font-semibold text-emerald-950 text-sm">
                      Chồ Dining — Danh Sách Đặt Chỗ Phiên Chợ Ký Ức
                    </span>
                  </div>
                  <a
                    href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 hover:bg-emerald-800 transition cursor-pointer"
                  >
                    <span>Mở Google Sheet</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="text-xs text-emerald-800 font-mono break-all bg-emerald-100/60 p-2 rounded-md">
                  ID: {spreadsheetId}
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleSyncAllRecent}
                    disabled={isSyncing}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-600 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100/50 transition cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>{isSyncing ? 'Đang đồng bộ...' : `Đồng bộ đơn đặt chỗ hiện tại (${recentBookings.length})`}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCreateNewSheet}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tạo bảng tính mới khác</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-stone-600">
                  Chưa có bảng tính nào được gán. Bạn có thể nhấn nút dưới đây để tạo tự động 1 bảng tính hoàn chỉnh sẵn các cột tiếng Việt:
                </p>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleCreateNewSheet}
                    disabled={isLoading || !currentUser}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 text-white text-xs font-bold px-4 py-2 hover:bg-emerald-800 transition cursor-pointer disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tạo tự động Google Sheet chuẩn cho Chồ Dining</span>
                  </button>
                </div>

                <div className="pt-2">
                  <label className="text-xs text-stone-500 block mb-1">
                    Hoặc dán ID Google Sheet có sẵn của bạn:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputSheetId}
                      onChange={(e) => setInputSheetId(e.target.value)}
                      placeholder="Ví dụ: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                      className="flex-1 rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-mono bg-stone-50 focus:bg-white focus:outline-emerald-700"
                    />
                    <button
                      type="button"
                      onClick={handleSaveSheetId}
                      className="px-3 py-1.5 rounded-lg bg-stone-800 text-white text-xs font-semibold hover:bg-stone-900 transition cursor-pointer"
                    >
                      Lưu ID
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: Public Webhook Mode (For Public Landing on Tenten Hosting) */}
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                3. Tự động nhận đơn khi xuất bản lên Hosting Tenten (Không cần khách đăng nhập)
              </span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Khi khách hàng vãng lai vào website <code>phiencho.cholocale.com</code> đặt chỗ, họ không đăng nhập Google.
              Bạn chỉ cần tạo 1 Webhook Google Apps Script miễn phí theo 3 bước sau:
            </p>

            <ol className="text-xs text-stone-600 space-y-2 list-decimal list-inside pl-1">
              <li>Mở Google Sheet của bạn &rarr; chọn menu <b>Tiện ích mở rộng (Extensions) &gt; Apps Script</b>.</li>
              <li>Dán đoạn mã bên dưới vào và nhấn <b>Triển khai (Deploy) &gt; Tùy chọn triển khai mới (New deployment)</b>.</li>
              <li>Chọn loại <b>Web app</b> &rarr; Mục <i>&ldquo;Ai có quyền truy cập (Who has access)&rdquo;</i> chọn <b>Bất kỳ ai (Anyone)</b> &rarr; Sao chép Webhook URL và dán vào ô bên dưới:</li>
            </ol>

            <div className="relative">
              <pre className="max-h-40 overflow-y-auto rounded-lg bg-stone-900 p-3 font-mono text-[11px] text-stone-200">
                {appsScriptCode}
              </pre>
              <button
                type="button"
                onClick={copyScript}
                className="absolute top-2 right-2 inline-flex items-center gap-1 rounded bg-stone-800 px-2 py-1 text-[10px] font-semibold text-stone-200 hover:bg-stone-700 border border-stone-600 cursor-pointer"
              >
                {copiedScript ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedScript ? 'Đã sao chép' : 'Sao chép Script'}</span>
              </button>
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="Dán Webhook URL: https://script.google.com/macros/s/.../exec"
                className="flex-1 rounded-lg border border-stone-300 px-3 py-1.5 text-xs bg-white focus:outline-emerald-700"
              />
              <button
                type="button"
                onClick={handleSaveWebhook}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition cursor-pointer"
              >
                Lưu Webhook
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-stone-200 bg-stone-50 px-5 sm:px-6 py-3.5 shrink-0">
          <div className="text-xs text-stone-500">
            {spreadsheetId ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" /> Đã sẵn sàng ghi nhận dữ liệu
              </span>
            ) : (
              <span>Chưa kết nối bảng tính</span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-stone-900 px-4 py-2 text-xs font-semibold text-white hover:bg-stone-800 transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
