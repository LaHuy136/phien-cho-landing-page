/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Google Workspace Scopes
export const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
];

const provider = new GoogleAuthProvider();
SCOPES.forEach((scope) => provider.addScope(scope));

// In-memory token cache (never stored in localStorage)
let isSigningIn = false;
let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user && cachedAccessToken) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else {
      if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Không lấy được access token từ Google');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logoutGoogle = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

export interface BookingRecord {
  name: string;
  phone: string;
  adultCount: number;
  childCount: number;
  totalPrice: number;
  bizInfo?: string;
  createdAt?: string;
}

const STORAGE_KEY_SHEET_ID = 'cho_connected_sheet_id_v1';
const STORAGE_KEY_WEBHOOK_URL = 'cho_sheets_webhook_url_v1';

export const getSavedSpreadsheetId = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEY_SHEET_ID);
  } catch {
    return null;
  }
};

export const saveSpreadsheetId = (id: string) => {
  try {
    localStorage.setItem(STORAGE_KEY_SHEET_ID, id);
  } catch (e) {
    console.warn('Could not save spreadsheet ID', e);
  }
};

export const getSavedWebhookUrl = (): string => {
  try {
    return localStorage.getItem(STORAGE_KEY_WEBHOOK_URL) || '';
  } catch {
    return '';
  }
};

export const saveWebhookUrl = (url: string) => {
  try {
    localStorage.setItem(STORAGE_KEY_WEBHOOK_URL, url.trim());
  } catch (e) {
    console.warn('Could not save webhook url', e);
  }
};

/**
 * Creates a designated Google Spreadsheet in the user's Google Drive
 * with predefined headers and Vietnamese columns.
 */
export const createBookingSpreadsheet = async (
  accessToken: string,
  title = 'Chồ Dining — Danh Sách Đặt Chỗ Phiên Chợ Ký Ức'
): Promise<{ id: string; url: string }> => {
  const payload = {
    properties: {
      title,
    },
    sheets: [
      {
        properties: {
          title: 'Khách_Đặt_Chỗ',
          gridProperties: {
            frozenRowCount: 1,
          },
        },
        data: [
          {
            startRow: 0,
            startColumn: 0,
            rowData: [
              {
                values: [
                  { userEnteredValue: { stringValue: 'Thời gian đặt' } },
                  { userEnteredValue: { stringValue: 'Họ và tên khách' } },
                  { userEnteredValue: { stringValue: 'Số điện thoại' } },
                  { userEnteredValue: { stringValue: 'Vé người lớn' } },
                  { userEnteredValue: { stringValue: 'Vé trẻ em (6-12t)' } },
                  { userEnteredValue: { stringValue: 'Tạm tính (VND)' } },
                  { userEnteredValue: { stringValue: 'Yêu cầu tiệc / Ghi chú' } },
                  { userEnteredValue: { stringValue: 'Trạng thái xử lý' } },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message || 'Không thể tạo Google Sheet');
  }

  const data = await response.json();
  const id = data.spreadsheetId;
  const url = `https://docs.google.com/spreadsheets/d/${id}/edit`;
  saveSpreadsheetId(id);
  return { id, url };
};

/**
 * Appends a new booking row to the Google Spreadsheet.
 */
export const appendBookingToSheet = async (
  accessToken: string,
  spreadsheetId: string,
  booking: BookingRecord
): Promise<boolean> => {
  const timestamp =
    booking.createdAt ||
    new Date().toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

  const rowValues = [
    timestamp,
    booking.name,
    booking.phone,
    booking.adultCount,
    booking.childCount,
    booking.totalPrice,
    booking.bizInfo || 'Khách lẻ',
    'Mới đặt - Cần liên hệ',
  ];

  // First verify sheet tab name or use the first available range
  const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A:H:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const response = await fetch(appendUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      range: 'A:H',
      majorDimension: 'ROWS',
      values: [rowValues],
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message || 'Không thể ghi dữ liệu vào Google Sheet');
  }

  return true;
};

/**
 * Sends booking to Google Apps Script Webhook (for public visitors when owner is not online)
 */
export const sendBookingToWebhook = async (
  webhookUrl: string,
  booking: BookingRecord
): Promise<boolean> => {
  if (!webhookUrl) return false;

  const timestamp =
    booking.createdAt ||
    new Date().toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

  const payload = {
    timestamp,
    name: booking.name,
    phone: booking.phone,
    adultCount: booking.adultCount,
    childCount: booking.childCount,
    totalPrice: booking.totalPrice,
    bizInfo: booking.bizInfo || '',
  };

  // Google Apps Script requires mode: no-cors or redirect handling
  await fetch(webhookUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return true;
};
