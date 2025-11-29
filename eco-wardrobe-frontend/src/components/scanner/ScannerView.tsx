import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScannerViewProps {
  onScan: () => void;
  onClose: () => void;
  isScanning: boolean;
}

export function ScannerView({ onScan, onClose, isScanning }: ScannerViewProps) {
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
        <h2 className="text-primary-foreground font-display font-semibold">Skaner</h2>
        <div className="w-6" />
      </div>

      {/* Camera View Mock */}
      <div className="flex-1 relative flex items-center justify-center p-8">
        <div className="relative w-full max-w-xs aspect-square">
          {/* Scanner Frame */}
          <div className="absolute inset-0 border-2 border-primary-foreground/50 rounded-2xl">
            {/* Corner accents */}
            <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-accent rounded-tl-lg" />
            <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-accent rounded-tr-lg" />
            <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-accent rounded-bl-lg" />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-accent rounded-br-lg" />
          </div>

          {/* Scanning line animation */}
          {isScanning && (
            <div className="absolute inset-4 overflow-hidden rounded-lg">
              <motion.div
                className="h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent"
                animate={{ y: [0, 280, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          )}

          {/* Mock camera preview */}
          <div className="absolute inset-4 bg-foreground/80 rounded-lg flex items-center justify-center">
            {isScanning ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Zap className="w-12 h-12 text-accent" />
              </motion.div>
            ) : (
              <Camera className="w-12 h-12 text-primary-foreground/50" />
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center px-4 pb-4">
        <p className="text-primary-foreground/80 text-sm mb-4">
          {isScanning 
            ? 'Analizowanie produktu...' 
            : 'Skieruj kamerę na kod QR lub metkę produktu'}
        </p>
      </div>

      {/* Scan Button */}
      <div className="p-4 safe-bottom">
        <Button
          onClick={onScan}
          disabled={isScanning}
          size="lg"
          className="w-full h-14 text-lg font-display gradient-eco border-0"
        >
          {isScanning ? 'Skanowanie...' : 'Zeskanuj produkt'}
        </Button>
      </div>
    </motion.div>
  );
}
