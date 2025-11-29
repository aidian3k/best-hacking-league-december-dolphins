import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProductDetails } from '@/components/scanner/ProductDetails';
import { mockProducts, calculateWardrobeStats } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const product = mockProducts.find(p => p.id === id);
  const wardrobeStats = calculateWardrobeStats(mockProducts);

  if (!product) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <p className="text-muted-foreground mb-4">Produkt nie został znaleziony</p>
          <Button onClick={() => navigate('/wardrobe')}>
            Wróć do szafy
          </Button>
        </div>
      </AppLayout>
    );
  }

  const handleRemoveFromWardrobe = () => {
    toast({
      title: 'Usunięto z szafy',
      description: `${product.name} został usunięty z Twojej szafy.`,
    });
    navigate('/wardrobe');
  };

  const handleBack = () => {
    navigate('/wardrobe');
  };

  return (
    <AppLayout showNav={false}>
      {/* Back button header */}
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
          onAddToWardrobe={handleRemoveFromWardrobe}
          onScanAgain={handleBack}
          isInWardrobe={true}
        />
      </div>
    </AppLayout>
  );
}
