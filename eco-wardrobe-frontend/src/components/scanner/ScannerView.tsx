import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Zap, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Html5Qrcode } from 'html5-qrcode';

interface ScannerViewProps {
  onScan: (url: string) => void;
  onClose: () => void;
  isScanning: boolean;
}

export function ScannerView({ onScan, onClose, isScanning }: ScannerViewProps) {
  const [error, setError] = useState<string | null>(null);
  const [cameraStarted, setCameraStarted] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const hasScannedRef = useRef(false);
  const qrCodeRegionId = "qr-reader";

  useEffect(() => {
    if (!isScanning) {
      hasScannedRef.current = false;
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isScanning]);

  const startCamera = async () => {
    try {
      const html5QrCode = new Html5Qrcode(qrCodeRegionId);
      scannerRef.current = html5QrCode;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      };

      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          // Automatycznie skanuj gdy wykryto kod QR
          if (decodedText && !isScanning && !hasScannedRef.current) {
            hasScannedRef.current = true;
            stopCamera();
            onScan(decodedText);
          }
        },
        (_errorMessage) => {
          // Ignorujemy błędy skanowania - czekamy na poprawny kod
        }
      );

      setCameraStarted(true);
      setError(null);
    } catch (err: any) {
      console.error("Error starting camera:", err);

      let errorMessage = "Nie można uruchomić kamery.";

      // Sprawdź czy to problem z uprawnieniami
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = "Brak dostępu do kamery. Zezwól na użycie kamery w ustawieniach przeglądarki.";
      }
      // Sprawdź czy to problem z HTTPS
      else if (err.name === 'NotSupportedError' || err.message?.includes('secure')) {
        errorMessage = "Kamera wymaga połączenia HTTPS. Użyj przycisku testowego poniżej.";
      }
      // Sprawdź czy kamera jest zajęta
      else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage = "Kamera jest używana przez inną aplikację.";
      }
      // Brak kamery
      else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage = "Nie znaleziono kamery. Użyj przycisku testowego poniżej.";
      }

      setError(errorMessage);
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current && cameraStarted) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.error("Error stopping camera:", err);
      }
    }
  };

  const handleManualScan = () => {
    // Mock JSON payload do testowania
    hasScannedRef.current = true;
    const mockPayload = {
      "productId": "123456789",
      "gtin": "5901234123457",
      "productName": "Eco Cotton T-Shirt",
      "brand": "EcoFashion",
      "category": "Clothing",
      "description": "Sustainable cotton t-shirt made from 100% organic cotton",
      "materials": [
        {
          "name": "Organic Cotton",
          "percentage": 100,
          "certifications": ["GOTS", "Oeko-Tex Standard 100"]
        }
      ],
      "sustainability": {
        "carbonFootprint": 2.5,
        "waterUsage": 50,
        "recyclability": 90,
        "certifications": ["GOTS", "Fair Trade"]
      },
      "manufacturingInfo": {
        "country": "Portugal",
        "facility": "Green Factory Ltd.",
        "dateManufactured": "2024-01-15"
      }
    };
    onScan(JSON.stringify(mockPayload));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-foreground z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 safe-top">
        <button onClick={onClose} className="text-primary-foreground">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-primary-foreground font-display font-semibold">Skaner QR</h2>
        <div className="w-6" />
      </div>

      {/* Camera View */}
      <div className="flex-1 relative flex items-center justify-center p-8">
        <div className="relative w-full max-w-xs">
          {/* QR Reader Container */}
          <div id={qrCodeRegionId} className="w-full" />

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-foreground/95 rounded-lg p-6">
              <AlertCircle className="w-16 h-16 text-destructive mb-4" />
              <p className="text-primary-foreground text-sm text-center mb-4 max-w-xs">
                {error}
              </p>
              <Button
                onClick={handleManualScan}
                disabled={isScanning}
                size="lg"
                className="w-full gradient-eco border-0"
              >
                Użyj testowego produktu
              </Button>
            </div>
          )}

          {isScanning && (
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/90 rounded-lg">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Zap className="w-12 h-12 text-accent" />
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center px-4 pb-4">
        <p className="text-primary-foreground/80 text-sm mb-4">
          {isScanning
            ? 'Analizowanie produktu...'
            : error
              ? 'Lub użyj przycisku testowego poniżej'
              : cameraStarted
                ? 'Skieruj kamerę na kod QR produktu'
                : 'Uruchamianie kamery...'}
        </p>
      </div>

      {/* Manual Scan Button for Testing */}
      {!error && (
        <div className="p-4 safe-bottom space-y-2">
          <Button
            onClick={handleManualScan}
            disabled={isScanning}
            size="lg"
            variant="outline"
            className="w-full h-14 text-lg font-display"
          >
            Użyj testowego produktu
          </Button>
        </div>
      )}
    </motion.div>
  );
}

