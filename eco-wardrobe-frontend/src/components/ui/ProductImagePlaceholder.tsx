import { Shirt } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductImagePlaceholderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const iconSizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-12 h-12',
  lg: 'w-20 h-20',
};

export function ProductImagePlaceholder({ className, size = 'md' }: ProductImagePlaceholderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center bg-muted rounded-lg',
        className
      )}
    >
      <Shirt className={cn('text-muted-foreground', iconSizeClasses[size])} />
    </div>
  );
}

