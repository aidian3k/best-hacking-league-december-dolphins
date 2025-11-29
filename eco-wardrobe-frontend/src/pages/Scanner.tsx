import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { ScannerView } from '@/components/scanner/ScannerView';
import { ProductDetails } from '@/components/scanner/ProductDetails';
import { generateMockScannedProduct, calculateWardrobeStats, mockProducts } from '@/data/mockData';
import { Product } from '@/types/product';
import { useToast } from '@/hooks/use-toast';

type ScannerState = 'idle' | 'scanning' | 'result';

export default function Scanner() {
  const [state, setState] = useState<ScannerState>('idle');
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [showCamera, setShowCamera] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const wardrobeStats = calculateWardrobeStats(mockProducts);

  const handleScan = async () => {
    setState('scanning');
    
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const product = generateMockScannedProduct();
    setScannedProduct(product);
    setState('result');
    setShowCamera(false);
  };

  const handleAddToWardrobe = () => {
    toast({
      title: 'Dodano do szafy!',
      description: `${scannedProduct?.name} został dodany do Twojej szafy.`,
    });
    navigate('/wardrobe');
  };

  const handleScanAgain = () => {
    setScannedProduct(null);
    setState('idle');
    setShowCamera(true);
  };

  const handleClose = () => {
    navigate('/wardrobe');
  };

  return (
    <AppLayout showNav={!showCamera}>
      <AnimatePresence mode="wait">
        {showCamera ? (
          <ScannerView
            key="scanner"
            onScan={handleScan}
            onClose={handleClose}
            isScanning={state === 'scanning'}
          />
        ) : scannedProduct ? (
          <ProductDetails
            key="product"
            product={scannedProduct}
            wardrobeAvgScore={wardrobeStats.avgEcoScore}
            onAddToWardrobe={handleAddToWardrobe}
            onScanAgain={handleScanAgain}
          />
        ) : null}
      </AnimatePresence>
    </AppLayout>
  );
}
