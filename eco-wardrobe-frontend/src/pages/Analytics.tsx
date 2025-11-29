import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { EcoScore, EcoScoreBar } from '@/components/ui/EcoScore';
import { useProductsQuery } from '@/api/products';
import { useUser } from '@/contexts/UserContext';
import { calculateWardrobeStats, emptyWardrobeStats } from '@/services/wardrobeStats';
import { categoryLabels, Category } from '@/types/product';
import { 
  Leaf, 
  Recycle, 
  Wrench, 
  Clock, 
  TrendingUp,
  PieChart,
  BarChart3
} from 'lucide-react';
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const COLORS = {
  natural: 'hsl(145 60% 40%)',
  synthetic: 'hsl(215 20% 65%)',
};

export default function Analytics() {
  const { user } = useUser();
  const { data: products, isLoading } = useProductsQuery(user?.id || null);

  const stats = useMemo(() => {
    if (!products) {
      return emptyWardrobeStats;
    }
    return calculateWardrobeStats(products);
  }, [products]);

  const materialData = [
    { name: 'Naturalne', value: stats.naturalMaterialsPercent, color: COLORS.natural },
    { name: 'Syntetyczne', value: stats.syntheticMaterialsPercent, color: COLORS.synthetic },
  ];

  const categoryData = Object.entries(stats.categoryStats)
    .filter(([_, data]) => data.count > 0)
    .map(([cat, data]) => ({
      name: categoryLabels[cat as Category],
      count: data.count,
      ecoScore: data.avgEcoScore,
    }));

  if (isLoading) {
    return (
      <AppLayout>
        <div className="px-4 pt-4 pb-8 safe-top">
          <div className="mb-6">
            <h1 className="font-display font-bold text-2xl">Analiza szafy</h1>
            <p className="text-muted-foreground text-sm">Szczegółowe statystyki ekologiczne</p>
          </div>
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-muted-foreground">Ładowanie danych...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="px-4 pt-4 pb-8 safe-top">
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl">Analiza szafy</h1>
          <p className="text-muted-foreground text-sm">Szczegółowe statystyki ekologiczne</p>
        </div>

        {/* Main Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-semibold text-lg mb-1">Globalny wynik</h2>
              <p className="text-muted-foreground text-sm">
                {stats.totalItems} produktów w szafie
              </p>
            </div>
            <EcoScore score={stats.avgEcoScore} size="lg" showLabel />
          </div>
        </motion.div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-xl p-4 border border-border"
          >
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="w-4 h-4 text-eco-excellent" />
              <span className="text-sm text-muted-foreground">Eko produkty</span>
            </div>
            <p className="font-display font-bold text-2xl">{stats.ecoProductsPercent}%</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-card rounded-xl p-4 border border-border"
          >
            <div className="flex items-center gap-2 mb-2">
              <Recycle className="w-4 h-4 text-accent" />
              <span className="text-sm text-muted-foreground">Do recyklingu</span>
            </div>
            <p className="font-display font-bold text-2xl">{stats.recyclablePercent}%</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-xl p-4 border border-border"
          >
            <div className="flex items-center gap-2 mb-2">
              <Wrench className="w-4 h-4 text-eco-good" />
              <span className="text-sm text-muted-foreground">Naprawialne</span>
            </div>
            <p className="font-display font-bold text-2xl">{stats.repairablePercent}%</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-card rounded-xl p-4 border border-border"
          >
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Śr. trwałość</span>
            </div>
            <p className="font-display font-bold text-2xl">{stats.avgDurability} mies.</p>
          </motion.div>
        </div>

        {/* Materials Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl p-4 border border-border mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-primary" />
            <h3 className="font-display font-semibold">Skład materiałowy</h3>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-32 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={materialData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    dataKey="value"
                  >
                    {materialData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </RechartsPie>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3">
              {materialData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Category Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-card rounded-xl p-4 border border-border mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="font-display font-semibold">Ekologiczność kategorii</h3>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={80}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-card border border-border rounded-lg p-2 shadow-lg">
                          <p className="font-semibold">{data.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Wynik: {data.ecoScore} | {data.count} szt.
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="ecoScore" 
                  fill="hsl(155 45% 25%)" 
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-xl p-4 border border-border"
        >
          <h3 className="font-display font-semibold mb-4">Szczegóły kategorii</h3>
          <div className="space-y-4">
            {categoryData.map((cat) => (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{cat.name}</span>
                  <span className="text-sm text-muted-foreground">{cat.count} szt.</span>
                </div>
                <EcoScoreBar score={cat.ecoScore} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
