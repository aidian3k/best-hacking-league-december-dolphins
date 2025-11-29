import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { ScannerView } from '@/components/scanner/ScannerView';
import { ProductDetails } from '@/components/scanner/ProductDetails';
import { calculateWardrobeStats, mockProducts } from '@/data/mockData';
import { mockPassports } from '@/data/mockPassports';
import { Product } from '@/types/product';
import { DigitalProductPassport, convertDPPtoProduct } from '@/types/digitalProductPassport';
import { useToast } from '@/hooks/use-toast';

type ScannerState = 'idle' | 'scanning' | 'result' | 'error';

// Używamy mock paszportów z osobnego pliku
const mockDPP: DigitalProductPassport = mockPassports['123456789'];

export default function Scanner() {
  const [state, setState] = useState<ScannerState>('idle');
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [passport, setPassport] = useState<DigitalProductPassport | null>(null);
  const [showCamera, setShowCamera] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const wardrobeStats = calculateWardrobeStats(mockProducts);

  const handleScan = async (url: string) => {
    setState('scanning');
    setShowCamera(false);

    try {
      // Próba pobrania danych z URL
      let dppData: DigitalProductPassport;

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch');
        dppData = await response.json();
      } catch (error) {
        // Jeśli nie udało się pobrać, użyj mock data
        console.log('Using mock data for testing');
        dppData = mockDPP;
      }

      // Konwersja DPP na Product
      const { product } = convertDPPtoProduct(dppData);

      setScannedProduct(product);
      setPassport(dppData);
      setState('result');
    } catch (error) {
      console.error('Error scanning product:', error);
      setState('error');
      setShowCamera(true);

      toast({
        title: 'Błąd skanowania',
        description: 'Nie udało się przetworzyć danych produktu',
        variant: 'destructive',
      });

      // Wróć do stanu idle po 2 sekundach
      setTimeout(() => setState('idle'), 2000);
    }
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
    setPassport(null);
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
            passport={passport || undefined}
            wardrobeAvgScore={wardrobeStats.avgEcoScore}
            onAddToWardrobe={handleAddToWardrobe}
            onScanAgain={handleScanAgain}
          />
        ) : null}
      </AnimatePresence>
    </AppLayout>
  );
}
