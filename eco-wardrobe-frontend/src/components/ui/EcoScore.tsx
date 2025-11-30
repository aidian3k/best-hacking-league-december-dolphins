import { cn } from '@/lib/utils';
import { EcoRating, ecoRatingLabels } from '@/types/product';
import { motion } from 'framer-motion';

interface EcoScoreProps {
  score: number;
  rating?: EcoRating;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
  isEmpty?: boolean;
}

const sizeClasses = {
  sm: 'w-12 h-12 text-sm',
  md: 'w-16 h-16 text-lg',
  lg: 'w-24 h-24 text-2xl',
};

const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-eco-excellent border-eco-excellent bg-eco-excellent/10';
  if (score >= 60) return 'text-eco-good border-eco-good bg-eco-good/10';
  if (score >= 40) return 'text-eco-medium border-eco-medium bg-eco-medium/10';
  if (score >= 20) return 'text-eco-poor border-eco-poor bg-eco-poor/10';
  return 'text-eco-bad border-eco-bad bg-eco-bad/10';
};

const getRatingFromScore = (score: number): EcoRating => {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'medium';
  if (score >= 20) return 'poor';
  return 'bad';
};

export function EcoScore({ 
  score, 
  rating, 
  size = 'md', 
  showLabel = false,
  animated = true,
  className,
  isEmpty = false
}: EcoScoreProps) {
  const displayRating = rating || getRatingFromScore(score);
  const colorClass = isEmpty ? 'text-muted-foreground border-border bg-muted/30' : getScoreColor(score);

  const content = (
    <div
      className={cn(
        'rounded-full border-2 flex items-center justify-center font-display font-bold',
        sizeClasses[size],
        colorClass,
        className
      )}
    >
      {isEmpty ? 'N/A' : `${score}%`}
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-1">
      {animated ? (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          {content}
        </motion.div>
      ) : (
        content
      )}
      {showLabel && (
        <span className={cn('text-xs font-medium', isEmpty ? 'text-muted-foreground' : colorClass.split(' ')[0])}>
          {isEmpty ? 'Brak danych' : ecoRatingLabels[displayRating]}
        </span>
      )}
    </div>
  );
}

interface EcoScoreBarProps {
  score: number;
  showValue?: boolean;
  className?: string;
  isEmpty?: boolean;
}

export function EcoScoreBar({ score, showValue = true, className, isEmpty = false }: EcoScoreBarProps) {
  const getBarColor = (score: number): string => {
    if (score >= 80) return 'bg-eco-excellent';
    if (score >= 60) return 'bg-eco-good';
    if (score >= 40) return 'bg-eco-medium';
    if (score >= 20) return 'bg-eco-poor';
    return 'bg-eco-bad';
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        {!isEmpty && (
          <motion.div
            className={cn('h-full rounded-full', getBarColor(score))}
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        )}
      </div>
      {showValue && (
        <span className={cn(
          'text-sm font-semibold font-display min-w-[2.5rem]',
          isEmpty && 'text-muted-foreground'
        )}>
          {isEmpty ? 'N/A' : score}
        </span>
      )}
    </div>
  );
}
