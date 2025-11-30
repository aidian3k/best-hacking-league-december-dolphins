import { useState } from 'react';
import { User, Camera, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { base64ToDataUrl, compressImage, cn } from '@/lib/utils';

interface AvatarUploadProps {
  avatarUrl?: string | null;
  onImageChange: (base64: string | null) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AvatarUpload({
  avatarUrl,
  onImageChange,
  size = 'lg',
  className
}: AvatarUploadProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setIsUploading(true);
      try {
        const base64 = await compressImage(file, 400, 400, 0.8);
        setUploadedImage(base64);
        onImageChange(base64);
        console.log(`✅ Awatar skompresowany: ${Math.round((base64.length * 3) / 4 / 1024)}KB`);
      } catch (error) {
        console.error('Błąd przetwarzania obrazu:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    onImageChange(null);
  };

  const imageUrl = uploadedImage ? base64ToDataUrl(uploadedImage) : avatarUrl;

  return (
    <div className={cn('relative', className)}>
      <label htmlFor="avatar-upload" className="cursor-pointer">
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          capture="user"
          onChange={handleImageUpload}
          className="hidden"
          disabled={isUploading}
        />
        <div className={cn(
          'relative rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center overflow-hidden',
          sizeClasses[size],
          'border-2 border-border hover:border-primary/50 transition-colors'
        )}>
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center">
                <Camera className="w-6 h-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
              </div>
            </>
          ) : (
            <>
              {isUploading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <User className={cn('text-primary-foreground', iconSizes[size])} />
                </motion.div>
              ) : (
                <User className={cn('text-primary-foreground', iconSizes[size])} />
              )}
            </>
          )}
        </div>
      </label>
      
      {imageUrl && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveImage();
          }}
          className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 shadow-lg hover:bg-destructive/90 transition-colors"
          aria-label="Usuń zdjęcie"
        >
          <XCircle className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

