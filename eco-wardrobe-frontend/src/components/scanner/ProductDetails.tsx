import { Product, categoryLabels, ecoRatingLabels } from '@/types/product';
import { EcoScore, EcoScoreBar } from '@/components/ui/EcoScore';
import { motion } from 'framer-motion';
import { 
  Recycle, 
  Wrench, 
  Clock, 
  Leaf, 
  AlertTriangle,
  Droplets,
  ThermometerSun,
  Info,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ProductDetailsProps {
  product: Product;
  wardrobeAvgScore?: number;
  onAddToWardrobe: () => void;
  onScanAgain: () => void;
  isInWardrobe?: boolean;
}

export function ProductDetails({ 
  product, 
  wardrobeAvgScore = 65, 
  onAddToWardrobe, 
  onScanAgain,
  isInWardrobe = false
}: ProductDetailsProps) {
  const [showAllFacts, setShowAllFacts] = useState(false);
  
  const comparison = product.ecoScore > wardrobeAvgScore 
    ? 'better' 
    : product.ecoScore < wardrobeAvgScore 
      ? 'worse' 
      : 'same';

  const isGoodChoice = product.ecoScore >= 60;
  const hasNegativeTraits = product.materials.some(m => !m.isNatural && m.percentage > 30) || 
    product.recyclability === 'none' || 
    !product.repairable ||
    product.environmentalImpact > 6;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-background min-h-screen pb-32"
    >
      {/* GOOD/BAD CHOICE HERO BANNER */}
      <div className={cn(
        'px-4 py-6 text-center',
        isGoodChoice ? 'bg-eco-excellent/20' : 'bg-eco-poor/20'
      )}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="flex flex-col items-center gap-2"
        >
          {isGoodChoice ? (
            <>
              <CheckCircle2 className="w-16 h-16 text-eco-excellent" />
              <h1 className="font-display font-bold text-2xl text-eco-excellent">DOBRY WYBÓR!</h1>
              <p className="text-sm text-eco-excellent/80">Ten produkt jest przyjazny środowisku</p>
            </>
          ) : (
            <>
              <XCircle className="w-16 h-16 text-eco-poor" />
              <h1 className="font-display font-bold text-2xl text-eco-poor">ZŁY WYBÓR</h1>
              <p className="text-sm text-eco-poor/80">Ten produkt ma negatywny wpływ na środowisko</p>
            </>
          )}
        </motion.div>
      </div>

      {/* Product Image & Score */}
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full aspect-[4/3] object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent h-24" />
        <div className="absolute bottom-4 right-4">
          <EcoScore score={product.ecoScore} size="lg" showLabel />
        </div>
        {product.secondHand && (
          <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
            Second-hand {product.previousOwners && `(${product.previousOwners} właścicieli)`}
          </div>
        )}
      </div>

      {/* Negative traits warning */}
      {hasNegativeTraits && !isGoodChoice && (
        <div className="mx-4 -mt-2 mb-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-eco-poor/10 border-2 border-eco-poor/30 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-eco-poor" />
              <h3 className="font-semibold text-eco-poor">Negatywne cechy ekologiczne</h3>
            </div>
            <ul className="space-y-1 text-sm text-eco-poor/90">
              {product.materials.some(m => !m.isNatural && m.percentage > 30) && (
                <li>• Wysoki udział materiałów syntetycznych</li>
              )}
              {product.recyclability === 'none' && (
                <li>• Produkt nie nadaje się do recyklingu</li>
              )}
              {!product.repairable && (
                <li>• Brak możliwości naprawy</li>
              )}
              {product.environmentalImpact > 6 && (
                <li>• Wysoki wpływ środowiskowy ({product.environmentalImpact}/10)</li>
              )}
            </ul>
          </motion.div>
        </div>
      )}

      {/* Product Info */}
      <div className="px-4 -mt-4 relative">
        <div className="bg-card rounded-2xl p-4 shadow-eco border border-border">
          <p className="text-muted-foreground text-sm">{product.brand}</p>
          <h1 className="font-display font-bold text-xl mb-2">{product.name}</h1>
          <span className="text-xs bg-muted px-2 py-1 rounded-full">
            {categoryLabels[product.category]}
          </span>

          {/* Comparison Badge */}
          <div className={cn(
            'mt-4 p-3 rounded-lg flex items-center gap-3',
            comparison === 'better' && 'bg-eco-excellent/10',
            comparison === 'worse' && 'bg-eco-poor/10',
            comparison === 'same' && 'bg-muted'
          )}>
            {comparison === 'better' ? (
              <>
                <Leaf className="w-5 h-5 text-eco-excellent" />
                <span className="text-sm font-medium">
                  Lepszy od średniej Twojej szafy (+{product.ecoScore - wardrobeAvgScore} pkt)
                </span>
              </>
            ) : comparison === 'worse' ? (
              <>
                <AlertTriangle className="w-5 h-5 text-eco-poor" />
                <span className="text-sm font-medium">
                  Gorszy od typowych produktów w Twojej szafie ({wardrobeAvgScore - product.ecoScore} pkt mniej)
                </span>
              </>
            ) : (
              <>
                <Info className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium">
                  Na poziomie średniej Twojej szafy
                </span>
              </>
            )}
          </div>
        </div>

        {/* Materials */}
        <div className="mt-4 bg-card rounded-2xl p-4 shadow-eco border border-border">
          <h2 className="font-display font-semibold mb-3">Skład materiałowy</h2>
          <div className="space-y-3">
            {product.materials.map((material, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'w-2 h-2 rounded-full',
                    material.isNatural ? 'bg-eco-good' : 'bg-muted-foreground'
                  )} />
                  <span className="text-sm">{material.name}</span>
                  {material.isRecycled && (
                    <Recycle className="w-3 h-3 text-accent" />
                  )}
                </div>
                <span className="font-medium">{material.percentage}%</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Materiały naturalne</span>
              <span className="font-medium text-eco-good">
                {product.materials.filter(m => m.isNatural).reduce((sum, m) => sum + m.percentage, 0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Eco Data */}
        <div className="mt-4 bg-card rounded-2xl p-4 shadow-eco border border-border">
          <h2 className="font-display font-semibold mb-3">Dane ekologiczne</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Trwałość</p>
                <p className="font-semibold">{product.durability} mies.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Leaf className="w-5 h-5 text-eco-good" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Wpływ środowiskowy</p>
                <p className="font-semibold">{product.environmentalImpact}/10</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Recycle className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Recykling</p>
                <p className="font-semibold">
                  {product.recyclability === 'full' ? 'Pełny' : product.recyclability === 'partial' ? 'Częściowy' : 'Brak'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Wrench className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Naprawa</p>
                <p className="font-semibold">{product.repairable ? 'Możliwa' : 'Niemożliwa'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Care Instructions */}
        <div className="mt-4 bg-card rounded-2xl p-4 shadow-eco border border-border">
          <h2 className="font-display font-semibold mb-3">Zalecenia pielęgnacji</h2>
          <div className="flex flex-wrap gap-2">
            {product.careInstructions.map((instruction, index) => (
              <span
                key={index}
                className="text-sm bg-muted px-3 py-1.5 rounded-full flex items-center gap-1"
              >
                <Droplets className="w-3 h-3" />
                {instruction}
              </span>
            ))}
          </div>
        </div>

        {/* Facts */}
        <div className="mt-4 bg-card rounded-2xl p-4 shadow-eco border border-border">
          <button 
            onClick={() => setShowAllFacts(!showAllFacts)}
            className="w-full flex items-center justify-between"
          >
            <h2 className="font-display font-semibold">Ciekawostki</h2>
            {showAllFacts ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
          <motion.div
            initial={false}
            animate={{ height: showAllFacts ? 'auto' : '80px' }}
            className="overflow-hidden mt-3"
          >
            <ul className="space-y-2">
              {product.facts.map((fact, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Info className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border safe-bottom">
        <div className="flex gap-3 max-w-lg mx-auto">
          {isInWardrobe ? (
            <>
              <Button
                variant="outline"
                onClick={onScanAgain}
                className="flex-1"
              >
                Wróć do szafy
              </Button>
              <Button
                variant="destructive"
                onClick={onAddToWardrobe}
                className="flex-1"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Usuń z szafy
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={onScanAgain}
                className="flex-1"
              >
                Skanuj ponownie
              </Button>
              <Button
                onClick={onAddToWardrobe}
                className="flex-1 gradient-eco border-0"
              >
                Dodaj do szafy
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
