import { Category, categoryLabels } from '@/types/product';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CategoryFilterProps {
  selected: Category | 'all';
  onSelect: (category: Category | 'all') => void;
}

const categories: (Category | 'all')[] = ['all', 'koszulki', 'bluzy', 'spodnie', 'skarpety', 'inne'];

const categoryIcons: Record<Category | 'all', string> = {
  all: '👕',
  koszulki: '👔',
  bluzy: '🧥',
  spodnie: '👖',
  skarpety: '🧦',
  inne: '📦',
};

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((cat) => (
        <motion.button
          key={cat}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(cat)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
            selected === cat
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          )}
        >
          <span>{categoryIcons[cat]}</span>
          <span>{cat === 'all' ? 'Wszystkie' : categoryLabels[cat]}</span>
        </motion.button>
      ))}
    </div>
  );
}
