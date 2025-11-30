import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64String = result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = error => reject(error);
  });
}

/**
 * Compresses an image file to reduce size before upload
 * @param file - The image file to compress
 * @param maxWidth - Maximum width in pixels (default: 800)
 * @param maxHeight - Maximum height in pixels (default: 800)
 * @param quality - Image quality 0-1 (default: 0.8)
 * @returns Promise with compressed base64 string (without data URL prefix)
 */
export function compressImage(
  file: File,
  maxWidth: number = 800,
  maxHeight: number = 800,
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        // Create canvas and compress
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to JPEG with quality compression
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        const base64String = compressedDataUrl.split(',')[1];

        console.log(`📦 Kompresja obrazu: ${Math.round(file.size / 1024)}KB → ${Math.round((base64String.length * 3) / 4 / 1024)}KB`);

        resolve(base64String);
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export function base64ToDataUrl(base64: string, mimeType?: string): string {
  // If already a data URL, return as is
  if (base64.startsWith('data:')) {
    return base64;
  }

  // Remove any whitespace from base64 string
  const cleanBase64 = base64.replace(/\s/g, '');

  // Auto-detect image type from base64 signature
  if (!mimeType) {
    if (cleanBase64.startsWith('iVBOR')) {
      mimeType = 'image/png';
    } else if (cleanBase64.startsWith('R0lGOD')) {
      mimeType = 'image/gif';
    } else if (cleanBase64.startsWith('UklGR')) {
      mimeType = 'image/webp';
    } else if (cleanBase64.startsWith('/9j/')) {
      mimeType = 'image/jpeg';
    } else {
      // Default to JPEG for unknown formats
      mimeType = 'image/jpeg';
    }
  }

  return `data:${mimeType};base64,${cleanBase64}`;
}

export function getProductImageUrl(product: { image?: string; imageUrl?: string }): string | undefined {
  if (product.image) {
    try {
      const dataUrl = base64ToDataUrl(product.image);
      console.log(`🖼️ Creating image URL - Base64 prefix: ${product.image.substring(0, 20)}... → ${dataUrl.substring(0, 50)}...`);
      return dataUrl;
    } catch (error) {
      console.warn('Błąd tworzenia URL obrazu:', error);
      return product.imageUrl;
    }
  }
  return product.imageUrl;
}

export function getUserAvatarUrl(user: { profilePicture?: string | null }): string | undefined {
  if (user.profilePicture) {
    try {
      return base64ToDataUrl(user.profilePicture);
    } catch (error) {
      console.warn('Błąd tworzenia URL awatara:', error);
      return undefined;
    }
  }
  return undefined;
}

/**
 * Converts byte array to base64 string
 * Processes in chunks to avoid call stack size exceeded errors with large images
 */
export function byteArrayToBase64(byteArray: number[]): string {
  const bytes = new Uint8Array(byteArray);
  const chunkSize = 0x8000; // 32KB chunks
  let binary = '';

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }

  return btoa(binary);
}

/**
 * Converts base64 string to byte array (number[])
 */
export function base64ToByteArray(base64: string): number[] {
  const binaryString = atob(base64);
  return Array.from(binaryString, char => char.charCodeAt(0));
}

/**
 * Converts backend image (string | number[] | null) to base64 string
 * Handles both string (already base64) and byte array formats
 */
export function convertBackendImageToBase64(image: string | number[] | null | undefined): string | null {
  if (!image) {
    return null;
  }

  try {
    if (typeof image === 'string') {
      return image;
    } else if (Array.isArray(image) && image.length > 0) {
      return byteArrayToBase64(image);
    }
  } catch (error) {
    console.warn('Błąd konwersji obrazu z backendu:', error);
  }

  return null;
}
