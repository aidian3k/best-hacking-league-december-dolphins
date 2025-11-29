import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProductCard } from '@/components/wardrobe/ProductCard';
import { CategoryFilter } from '@/components/wardrobe/CategoryFilter';
import { EcoScore } from '@/components/ui/EcoScore';
import { useProductsQuery } from '@/api/products';
import { mockInfluencers } from '@/data/mockData';
import { calculateWardrobeStats, emptyWardrobeStats } from '@/services/wardrobeStats';
import { Category } from '@/types/product';
import { ArrowLeft, BadgeCheck, Users, Shirt, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function PublicWardrobe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');

  const influencer = mockInfluencers.find(i => i.id === id);
  const { data: products, isLoading } = useProductsQuery(id || null);

  const stats = useMemo(() => {
    if (!products) {
      return emptyWardrobeStats;
    }
    return calculateWardrobeStats(products);
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return products;
    return products.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory]);

  const formatFollowers = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const handleShare = () => {
    toast({
      title: 'Link skopiowany!',
      description: 'Możesz teraz udostępnić tę szafę.',
    });
  };

  if (!influencer) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">Nie znaleziono szafy</p>
        </div>
      </AppLayout>
    );
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">Ładowanie szafy...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="px-4 pt-4 pb-8 safe-top">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/influencers')}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-display font-bold text-xl">Szafa publiczna</h1>
          </div>
          <Button variant="outline" size="icon" onClick={handleShare} className="rounded-full">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-5 mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={influencer.avatarUrl}
                alt={influencer.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-background"
              />
              {influencer.verified && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-accent rounded-full flex items-center justify-center border-2 border-background">
                  <BadgeCheck className="w-4 h-4 text-accent-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="font-display font-bold text-lg">{influencer.name}</h2>
              <p className="text-sm text-muted-foreground">{influencer.handle}</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{formatFollowers(influencer.followers)}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Shirt className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{influencer.itemCount}</span>
                </div>
              </div>
            </div>
            <EcoScore score={influencer.wardrobeEcoScore} size="lg" showLabel />
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <div className="bg-card rounded-xl p-3 text-center border border-border">
            <p className="font-display font-bold text-xl text-eco-excellent">{stats.ecoProductsPercent}%</p>
            <p className="text-xs text-muted-foreground">Eko produkty</p>
          </div>
          <div className="bg-card rounded-xl p-3 text-center border border-border">
            <p className="font-display font-bold text-xl text-accent">{stats.recyclablePercent}%</p>
            <p className="text-xs text-muted-foreground">Recykling</p>
          </div>
          <div className="bg-card rounded-xl p-3 text-center border border-border">
            <p className="font-display font-bold text-xl text-primary">{stats.naturalMaterialsPercent}%</p>
            <p className="text-xs text-muted-foreground">Naturalne</p>
          </div>
        </motion.div>

        {/* Category Filter */}
        <div className="mb-4">
          <CategoryFilter
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Brak produktów w tej kategorii</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.05 }}
              >
                <ProductCard
                  product={product}
                  onClick={() => navigate(`/public-wardrobe/${id}/product/${product.id}`)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
