import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProductDetails } from '@/components/scanner/ProductDetails';
import { useProductsQuery } from '@/api/products';
import { useSavedWardrobesQuery, useInfluencerWardrobesQuery } from '@/api/wardrobeShare';
import { calculateWardrobeStats, emptyWardrobeStats } from '@/services/wardrobeStats';
import { ArrowLeft } from 'lucide-react';
import { useMemo } from 'react';

export default function PublicProductDetail() {
  const { influencerId, productId } = useParams<{ influencerId: string; productId: string }>();
  const navigate = useNavigate();
  const { data: products, isLoading } = useProductsQuery(influencerId || null);
  const { data: savedWardrobes } = useSavedWardrobesQuery();
  const { data: influencerWardrobes } = useInfluencerWardrobesQuery();

  const wardrobeUser = useMemo(() => {
    if (!influencerId) return null;
    
    if (savedWardrobes) {
      const wardrobe = savedWardrobes.find(w => w.user.id === influencerId);
      if (wardrobe) return wardrobe.user;
    }
    
    if (influencerWardrobes) {
      const wardrobe = influencerWardrobes.find(w => w.user.id === influencerId);
      if (wardrobe) return wardrobe.user;
    }
    
    return null;
  }, [savedWardrobes, influencerWardrobes, influencerId]);

  const user = useMemo(() => {
    if (wardrobeUser) {
      return {
        id: wardrobeUser.id,
        name: wardrobeUser.name,
      };
    }
    return null;
  }, [wardrobeUser]);

  const product = useMemo(() => {
    if (!products || !productId) return null;
    return products.find(p => p.id === productId) || null;
  }, [products, productId]);

  const wardrobeStats = useMemo(() => {
    if (!products) {
      return emptyWardrobeStats;
    }
    return calculateWardrobeStats(products);
  }, [products]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <p className="text-muted-foreground">Ładowanie produktu...</p>
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <p className="text-muted-foreground mb-4">Nie znaleziono szafy</p>
        </div>
      </AppLayout>
    );
  }

  if (!products || products.length === 0) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <p className="text-muted-foreground mb-4">Szafa jest pusta</p>
        </div>
      </AppLayout>
    );
  }

  if (!product) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <p className="text-muted-foreground mb-4">Produkt nie został znaleziony</p>
        </div>
      </AppLayout>
    );
  }

  const handleBack = () => {
    navigate(`/public-wardrobe/${influencerId}`);
  };

  return (
    <AppLayout showNav={false}>
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border safe-top">
        <div className="flex items-center p-4">
          <button onClick={handleBack} className="text-foreground">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="font-display font-semibold ml-4">Szczegóły produktu</h2>
        </div>
      </div>
      
      <div className="pt-16">
        <ProductDetails
          product={product}
          wardrobeAvgScore={wardrobeStats.avgEcoScore}
          onAddToWardrobe={handleBack}
          onScanAgain={handleBack}
          isPublic={true}
          influencerName={user.name}
        />
      </div>
    </AppLayout>
  );
}

