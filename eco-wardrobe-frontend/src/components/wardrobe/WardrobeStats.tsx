import { WardrobeStats as WardrobeStatsType } from '@/types/product';
import { EcoScore, EcoScoreBar } from '@/components/ui/EcoScore';
import { motion } from 'framer-motion';
import { Leaf, Recycle, Wrench } from 'lucide-react';

interface WardrobeStatsProps {
  stats: WardrobeStatsType;
}

export function WardrobeStatsCard({ stats }: WardrobeStatsProps) {
  const isEmpty = stats.totalItems === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-5 shadow-eco border border-border"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-lg">Ekologiczność szafy</h3>
          <p className="text-sm text-muted-foreground">{stats.totalItems} produktów</p>
        </div>
        <EcoScore score={stats.avgEcoScore} size="lg" showLabel isEmpty={isEmpty} />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-eco-excellent/20 flex items-center justify-center">
            <Leaf className="w-4 h-4 text-eco-excellent" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Produkty ekologiczne</p>
            <EcoScoreBar score={stats.ecoProductsPercent} isEmpty={isEmpty} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
            <Recycle className="w-4 h-4 text-accent" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Do recyklingu</p>
            <EcoScoreBar score={stats.recyclablePercent} isEmpty={isEmpty} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-eco-good/20 flex items-center justify-center">
            <Wrench className="w-4 h-4 text-eco-good" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Nadające się do naprawy</p>
            <EcoScoreBar score={stats.repairablePercent} isEmpty={isEmpty} />
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-2xl font-display font-bold text-primary">
            {isEmpty ? 'N/A' : `${stats.naturalMaterialsPercent}%`}
          </p>
          <p className="text-xs text-muted-foreground">Materiały naturalne</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-display font-bold text-muted-foreground">
            {isEmpty ? 'N/A' : `${stats.syntheticMaterialsPercent}%`}
          </p>
          <p className="text-xs text-muted-foreground">Materiały syntetyczne</p>
        </div>
      </div>
    </motion.div>
  );
}

export function WardrobeStatsMini({ stats }: WardrobeStatsProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl">
      <EcoScore score={stats.avgEcoScore} size="md" isEmpty={stats.totalItems === 0} />
      <div>
        <p className="font-display font-semibold">Twoja szafa</p>
        <p className="text-sm text-muted-foreground">
          {stats.totalItems} produktów • {stats.ecoProductsPercent}% eko
        </p>
      </div>
    </div>
  );
}
