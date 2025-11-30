import { Product, categoryLabels } from '@/types/product';
import { EcoScore } from '@/components/ui/EcoScore';
import { ProductImagePlaceholder } from '@/components/ui/ProductImagePlaceholder';
import { cn, getProductImageUrl } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Recycle, Wrench, Heart } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
  className?: string;
}

export function ProductCard({ product, onClick, className }: ProductCardProps) {
  const imageUrl = getProductImageUrl(product);
  const hasValidImage = imageUrl && imageUrl !== '/api/placeholder/400/300';
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'bg-card rounded-xl overflow-hidden shadow-eco cursor-pointer',
        'border border-border hover:border-primary/30 transition-colors',
        className
      )}
    >
      <div className="relative aspect-square bg-muted">
        {hasValidImage && !imageError ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error(`❌ Błąd ładowania obrazu dla "${product.name}":`, {
                src: imageUrl?.substring(0, 100),
                error: e
              });
              setImageError(true);
            }}
            onLoad={() => {
              console.log(`✅ Obraz załadowany pomyślnie dla "${product.name}"`);
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ProductImagePlaceholder size="lg" className="w-full h-full rounded-none" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <EcoScore score={product.ecoScore} size="sm" animated={false} />
        </div>
        {product.secondHand && (
          <div className="absolute top-2 left-2 bg-accent text-accent-foreground text-xs font-medium px-2 py-1 rounded-full">
            Second-hand
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
        <h3 className="font-medium text-sm truncate">{product.name}</h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {categoryLabels[product.category]}
          </span>
          <div className="flex items-center gap-1">
            {product.recyclability !== 'none' && (
              <Recycle className="w-3 h-3 text-eco-good" />
            )}
            {product.repairable && (
              <Wrench className="w-3 h-3 text-accent" />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface ProductCardMiniProps {
  product: Product;
  onClick?: () => void;
}

export function ProductCardMini({ product, onClick }: ProductCardMiniProps) {
  const imageUrl = getProductImageUrl(product);
  const hasValidImage = imageUrl && imageUrl !== '/api/placeholder/400/300';
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border cursor-pointer hover:border-primary/30 transition-colors"
    >
      {hasValidImage && !imageError ? (
        <img
          src={imageUrl}
          alt={product.name}
          className="w-12 h-12 rounded-lg object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <ProductImagePlaceholder size="sm" className="w-12 h-12" />
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{product.name}</p>
        <p className="text-xs text-muted-foreground">{product.brand}</p>
      </div>
      <EcoScore score={product.ecoScore} size="sm" animated={false} />
    </motion.div>
  );
}
