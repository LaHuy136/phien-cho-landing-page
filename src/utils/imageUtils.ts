/**
 * Utility functions for image compression and URL sanitization
 */

export const compressImageFile = (
  file: File,
  maxWidth = 1200,
  quality = 0.82
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // If not an image, reject
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Downscale while preserving aspect ratio
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        // Draw image smoothly
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG with optimal compression (~80KB - 150KB)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };

      img.onerror = () => {
        // Fallback to raw data url if canvas fails
        resolve(e.target?.result as string);
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Sanitizes URLs to ensure direct image access
 * Converts Google Drive, Dropbox, etc. to direct image streams
 */
export const sanitizeImageUrl = (rawUrl: string): string => {
  if (!rawUrl) return '';
  let url = rawUrl.trim();

  // Convert Google Drive sharing link to direct view URL
  // e.g. https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
  }

  // Convert Google Drive open?id= link
  const driveOpenMatch = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  if (driveOpenMatch && driveOpenMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveOpenMatch[1]}`;
  }

  // Convert Dropbox share links to raw
  if (url.includes('dropbox.com') && url.includes('dl=0')) {
    return url.replace('dl=0', 'raw=1');
  }

  return url;
};
