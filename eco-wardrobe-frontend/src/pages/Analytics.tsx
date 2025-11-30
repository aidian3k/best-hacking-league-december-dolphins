import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { EcoScore, EcoScoreBar } from '@/components/ui/EcoScore';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  BarChart3,
  Info,
  ChevronDown,
  ChevronUp
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
  Tooltip as RechartsTooltip,
} from 'recharts';

const COLORS = {
  natural: 'hsl(145 60% 40%)',
  synthetic: 'hsl(215 20% 65%)',
};

export default function Analytics() {
  const { user } = useUser();
  const { data: products, isLoading } = useProductsQuery(user?.id || null);
  const [expandedNatural, setExpandedNatural] = useState(false);
  const [expandedSynthetic, setExpandedSynthetic] = useState(false);

  const stats = useMemo(() => {
    if (!products) {
      return emptyWardrobeStats;
    }
    return calculateWardrobeStats(products);
  }, [products]);

  const materialBreakdown = useMemo(() => {
    if (!products) return { natural: [], synthetic: [] };

    const naturalMaterials: Record<string, number> = {};
    const syntheticMaterials: Record<string, number> = {};
    let totalNatural = 0;
    let totalSynthetic = 0;

    products.forEach(product => {
      product.materials.forEach(material => {
        if (material.isNatural) {
          naturalMaterials[material.name] = (naturalMaterials[material.name] || 0) + material.percentage;
          totalNatural += material.percentage;
        } else {
          syntheticMaterials[material.name] = (syntheticMaterials[material.name] || 0) + material.percentage;
          totalSynthetic += material.percentage;
        }
      });
    });

    const natural = Object.entries(naturalMaterials)
      .map(([name, value]) => ({
        name,
        percentage: totalNatural > 0 ? Math.round((value / totalNatural) * 100) : 0,
      }))
      .sort((a, b) => b.percentage - a.percentage);

    const synthetic = Object.entries(syntheticMaterials)
      .map(([name, value]) => ({
        name,
        percentage: totalSynthetic > 0 ? Math.round((value / totalSynthetic) * 100) : 0,
      }))
      .sort((a, b) => b.percentage - a.percentage);

    return { natural, synthetic };
  }, [products]);

  const ecoProductsCount = useMemo(() => {
    if (!products) return { count: 0, total: 0 };
    const count = products.filter(p => p.ecoScore >= 60).length;
    return { count, total: products.length };
  }, [products]);

  const recyclableCount = useMemo(() => {
    if (!products) return { count: 0, total: 0 };
    const count = products.filter(p => p.recyclability !== 'none').length;
    return { count, total: products.length };
  }, [products]);

  const repairableCount = useMemo(() => {
    if (!products) return { count: 0, total: 0 };
    const count = products.filter(p => p.repairable).length;
    return { count, total: products.length };
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
            <div className="flex items-center gap-2">
              <EcoScore score={stats.avgEcoScore} size="lg" showLabel isEmpty={stats.totalItems === 0} />
              <span className="text-xs text-muted-foreground">/100</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <TooltipProvider>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-xl p-4 border border-border"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 mb-2 cursor-help">
                    <Leaf className="w-4 h-4 text-eco-excellent" />
                    <span className="text-sm text-muted-foreground">Eko produkty</span>
                    <Info className="w-3 h-3 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Produkty z wynikiem ekologicznym ≥ 60 punktów</p>
                </TooltipContent>
              </Tooltip>
              <p className="font-display font-bold text-xl">
                {stats.ecoProductsPercent}%
                <span className="text-xs font-normal text-muted-foreground ml-1">
                  ({ecoProductsCount.count}/{ecoProductsCount.total})
                </span>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-card rounded-xl p-4 border border-border"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 mb-2 cursor-help">
                    <Recycle className="w-4 h-4 text-accent" />
                    <span className="text-sm text-muted-foreground">Do recyklingu</span>
                    <Info className="w-3 h-3 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Produkty nadające się do recyklingu (pełny lub częściowy)</p>
                </TooltipContent>
              </Tooltip>
              <p className="font-display font-bold text-xl">
                {stats.recyclablePercent}%
                <span className="text-xs font-normal text-muted-foreground ml-1">
                  ({recyclableCount.count}/{recyclableCount.total})
                </span>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-xl p-4 border border-border"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 mb-2 cursor-help">
                    <Wrench className="w-4 h-4 text-eco-good" />
                    <span className="text-sm text-muted-foreground">Naprawialne</span>
                    <Info className="w-3 h-3 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Produkty, które można naprawić</p>
                </TooltipContent>
              </Tooltip>
              <p className="font-display font-bold text-xl">
                {stats.repairablePercent}%
                <span className="text-xs font-normal text-muted-foreground ml-1">
                  ({repairableCount.count}/{repairableCount.total})
                </span>
              </p>
            </motion.div>
          </TooltipProvider>

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
            <p className="font-display font-bold text-xl">{stats.avgDurability} mies.</p>
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
              {materialData.map((item) => {
                const isNatural = item.name === 'Naturalne';
                const materials = isNatural ? materialBreakdown.natural : materialBreakdown.synthetic;
                const isExpanded = isNatural ? expandedNatural : expandedSynthetic;
                const setIsExpanded = isNatural ? setExpandedNatural : setExpandedSynthetic;

                return (
                  <div key={item.name}>
                    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
                      <div className="flex items-center justify-between">
                        <CollapsibleTrigger asChild>
                          <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm">{item.name}</span>
                            {isExpanded ? (
                              <ChevronUp className="w-3 h-3 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-3 h-3 text-muted-foreground" />
                            )}
                          </button>
                        </CollapsibleTrigger>
                        <span className="font-semibold">{item.value}%</span>
                      </div>
                      <CollapsibleContent className="mt-2 ml-5 space-y-1">
                        {materials.length > 0 ? (
                          materials.map((mat) => (
                            <div key={mat.name} className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{mat.name}</span>
                              <span>{mat.percentage}%</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">Brak materiałów</span>
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-xl p-4 border border-border"
        >
          <h3 className="font-display font-semibold mb-4">Ekologiczność kategorii</h3>
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
