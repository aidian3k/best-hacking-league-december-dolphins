import { Product, categoryLabels } from '@/types/product';
import { EcoScore } from '@/components/ui/EcoScore';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Recycle, Wrench, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
  className?: string;
}

export function ProductCard({ product, onClick, className }: ProductCardProps) {
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
      <div className="relative aspect-square">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />
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
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border cursor-pointer hover:border-primary/30 transition-colors"
    >
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-12 h-12 rounded-lg object-cover"
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{product.name}</p>
        <p className="text-xs text-muted-foreground">{product.brand}</p>
      </div>
      <EcoScore score={product.ecoScore} size="sm" animated={false} />
    </motion.div>
  );
}
