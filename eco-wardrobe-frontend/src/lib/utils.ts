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

export function base64ToDataUrl(base64: string, mimeType?: string): string {
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
