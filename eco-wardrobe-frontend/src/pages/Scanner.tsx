import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { ScannerView } from '@/components/scanner/ScannerView';
import { ProductDetails } from '@/components/scanner/ProductDetails';
import { calculateWardrobeStats, mockProducts } from '@/data/mockData';
import { Product } from '@/types/product';
import { DigitalProductPassport, convertDPPtoProduct } from '@/types/digitalProductPassport';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { addProductToWardrobe } from '@/api/products';

type ScannerState = 'idle' | 'scanning' | 'result' | 'error';


export default function Scanner() {
  const [state, setState] = useState<ScannerState>('idle');
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [passport, setPassport] = useState<DigitalProductPassport | null>(null);
  const [showCamera, setShowCamera] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();

  const wardrobeStats = calculateWardrobeStats(mockProducts);

  const handleScan = async (url: string) => {
    console.log('Scanned URL:', url);
    setState('scanning');
    setShowCamera(false);

    try {
      // Wykonanie zapytania GET do URL z QR kodu
      console.log('Fetching data from:', url);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received data:', data);

      // Wyciągnięcie DPP z pola 'record'
      let dppData: DigitalProductPassport;

      if (data.record && data.record.productPassport) {
        dppData = data.record.productPassport;
        console.log('Extracted DPP from record:', dppData);
      } else {
        throw new Error('Invalid data structure - missing record.productPassport');
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
        description: error instanceof Error ? error.message : 'Nie udało się pobrać danych produktu',
        variant: 'destructive',
      });

      // Wróć do stanu idle po 2 sekundach
      setTimeout(() => setState('idle'), 2000);
    }
  };

  const handleAddToWardrobe = async (base64image: string | null) => {
    if (!user?.id) {
      toast({
        title: 'Błąd',
        description: 'Musisz być zalogowany, aby dodać produkt do szafy.',
        variant: 'destructive',
      });
      return;
    }

    if (!passport) {
      toast({
        title: 'Błąd',
        description: 'Brak danych produktu do zapisania.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Wywołanie API z userId, passport i opcjonalnie obrazem
      await addProductToWardrobe(user.id, passport, base64image);

      toast({
        title: 'Dodano do szafy!',
        description: `${scannedProduct?.name} został dodany do Twojej szafy.`,
      });
      navigate('/wardrobe');
    } catch (error) {
      console.error('Error adding product to wardrobe:', error);
      toast({
        title: 'Błąd',
        description: error instanceof Error ? error.message : 'Nie udało się dodać produktu do szafy.',
        variant: 'destructive',
      });
    }
  };

  const handleCancelScan = () => {
    // Reset and go back to scanner
    setScannedProduct(null);
    setPassport(null);
    setState('idle');
    setShowCamera(true);

    toast({
      title: 'Skan anulowany',
      description: 'Możesz zeskanować kolejny produkt.',
    });
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
    <AppLayout showNav={false}>
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
            onCancel={handleCancelScan}
          />
        ) : null}
      </AnimatePresence>
    </AppLayout>
  );
}
