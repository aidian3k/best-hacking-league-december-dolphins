import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProductCard } from '@/components/wardrobe/ProductCard';
import { CategoryFilter } from '@/components/wardrobe/CategoryFilter';
import { WardrobeStatsMini } from '@/components/wardrobe/WardrobeStats';
import { useProductsQuery } from '@/api/products';
import { useShareWardrobeMutation } from '@/api/wardrobeShare';
import { useUser } from '@/contexts/UserContext';
import { calculateWardrobeStats, emptyWardrobeStats } from '@/services/wardrobeStats';
import { Category } from '@/types/product';
import { ScanLine, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Wardrobe() {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const { user } = useUser();
  const { data: products, isLoading } = useProductsQuery(user?.id || null);
  const navigate = useNavigate();
  const shareWardrobeMutation = useShareWardrobeMutation();

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (selectedCategory === 'all') return products;
    return products.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory]);

  const stats = useMemo(() => {
    if (!products) {
      return emptyWardrobeStats;
    }
    return calculateWardrobeStats(products);
  }, [products]);

  const handleShare = () => {
    shareWardrobeMutation.mutate();
  };

  return (
    <AppLayout>
      <div className="px-4 pt-4 safe-top">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-display font-bold text-2xl">Twoja Szafa</h1>
            <p className="text-muted-foreground text-sm">Zarządzaj swoją garderobą</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleShare}
              className="rounded-full"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <WardrobeStatsMini stats={stats} />
        </motion.div>

        {/* Quick Actions */}
        <div className="mb-6">
          <Button
            onClick={() => navigate('/scanner')}
            className="w-full gradient-eco border-0"
          >
            <ScanLine className="w-4 h-4 mr-2" />
            Skanuj produkt
          </Button>
        </div>

        {/* Category Filter */}
        <div className="mb-4">
          <CategoryFilter
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        {/* Category Stats */}
        {selectedCategory !== 'all' && stats.categoryStats[selectedCategory] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-3 bg-muted rounded-lg"
          >
            <p className="text-sm">
              <span className="font-semibold">{stats.categoryStats[selectedCategory].count}</span> produktów • 
              Średnia ekologiczność: <span className="font-semibold">{stats.categoryStats[selectedCategory].avgEcoScore}</span>
            </p>
          </motion.div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Ładowanie produktów...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 pb-4">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard
                    product={product}
                    onClick={() => navigate(`/product/${product.id}`)}
                  />
                </motion.div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Brak produktów w tej kategorii</p>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
