import {categoryLabels, Product} from '@/types/product';
import {EcoScore} from '@/components/ui/EcoScore';
import {motion} from 'framer-motion';
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Droplets,
  Factory,
  Info,
  Leaf,
  MapPin,
  Recycle,
  ThermometerSun,
  Trash2,
  Wrench,
  X,
  XCircle,
  Zap
} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {useState} from 'react';
import {base64ToDataUrl, cn, compressImage, getProductImageUrl} from '@/lib/utils';

interface ProductDetailsProps {
  product: Product;
  wardrobeAvgScore?: number;
  onAddToWardrobe: (base64image: string) => void;
  onScanAgain: () => void;
  onCancel?: () => void;
  isInWardrobe?: boolean;
  isPublic?: boolean;
  influencerName?: string;
}

export function ProductDetails({ 
  product,
  wardrobeAvgScore = 65,
  onAddToWardrobe, 
  onScanAgain,
  onCancel,
  isInWardrobe = false,
  isPublic = false,
  influencerName
}: ProductDetailsProps) {
  const passport = product.passport;
  const [showAllFacts, setShowAllFacts] = useState(false);
  const [showSupplyChain, setShowSupplyChain] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const productImageUrl = getProductImageUrl(product);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setIsUploading(true);
      try {
        // Compress image before storing - max 600px, quality 0.7 to reduce payload size
        const base64 = await compressImage(file, 600, 600, 0.7);
        setUploadedImage(base64);
        console.log(`✅ Obraz skompresowany: ${Math.round((base64.length * 3) / 4 / 1024)}KB`);
      } catch (error) {
        console.error('Błąd przetwarzania obrazu:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

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
      className="bg-background min-h-screen pb-32]"
    >
      {/* Cancel button (X) in top-right corner */}
      {onCancel && (
        <button
          onClick={onCancel}
          className="fixed top-4 right-4 z-50 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg hover:bg-muted transition-colors safe-top"
          aria-label="Anuluj"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      )}

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
        {(uploadedImage || (productImageUrl && !productImageUrl.includes('placeholder'))) ? (
          <>
            <img
              src={uploadedImage ? base64ToDataUrl(uploadedImage) : productImageUrl}
              alt={product.name}
              className="w-full aspect-[4/3] object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent h-24" />
            {uploadedImage && !isPublic && (
              <button
                onClick={() => setUploadedImage(null)}
                className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm text-foreground px-3 py-1.5 rounded-full text-xs font-medium shadow-lg hover:bg-background transition-colors flex items-center gap-1.5"
              >
                <XCircle className="w-3.5 h-3.5" />
                Usuń zdjęcie
              </button>
            )}
          </>
        ) : (
          <div className="w-full aspect-[4/3] bg-gradient-to-br from-muted via-muted/50 to-background border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 sm:gap-3 max-h-[300px] sm:max-h-[400px]">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-accent/20 flex items-center justify-center">
              {isUploading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Leaf className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-accent" />
                </motion.div>
              ) : (
                <Leaf className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-accent" />
              )}
            </div>
            <div className="text-center px-6 sm:px-8">
              <p className="font-medium text-foreground mb-1 text-xs sm:text-sm md:text-base">Brak zdjęcia produktu</p>
              {!isPublic && (
                <p className="text-xs sm:text-sm text-muted-foreground">Dodaj własne zdjęcie z galerii lub aparatu</p>
              )}
            </div>
            {!isPublic && (
              <label htmlFor="image-upload" className="cursor-pointer">
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploading}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-xs sm:text-sm pointer-events-none"
                  disabled={isUploading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 sm:w-4 sm:h-4">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  {isUploading ? 'Wczytywanie...' : 'Dodaj zdjęcie'}
                </Button>
              </label>
            )}
          </div>
        )}
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
                  {isPublic 
                    ? `Lepszy od średniej szafy ${influencerName} (+${product.ecoScore - wardrobeAvgScore} pkt)`
                    : `Lepszy od średniej Twojej szafy (+${product.ecoScore - wardrobeAvgScore} pkt)`
                  }
                </span>
              </>
            ) : comparison === 'worse' ? (
              <>
                <AlertTriangle className="w-5 h-5 text-eco-poor" />
                <span className="text-sm font-medium">
                  {isPublic
                    ? `Gorszy od typowych produktów w szafie ${influencerName} (${wardrobeAvgScore - product.ecoScore} pkt mniej)`
                    : `Gorszy od typowych produktów w Twojej szafie (${wardrobeAvgScore - product.ecoScore} pkt mniej)`
                  }
                </span>
              </>
            ) : (
              <>
                <Info className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {isPublic
                    ? `Na poziomie średniej szafy ${influencerName}`
                    : 'Na poziomie średniej Twojej szafy'
                  }
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

        {/* Digital Product Passport - Environmental Impact */}
        {passport && (
          <>
            <div className="mt-4 bg-card rounded-2xl p-4 shadow-eco border border-border">
              <h2 className="font-display font-semibold mb-3">Wpływ środowiskowy</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-orange-500" />
                    <span className="text-sm">Ślad węglowy</span>
                  </div>
                  <span className="font-semibold">{passport.environmentalImpact.carbonFootprint_kgCO2e.toFixed(1)} kg CO₂e</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-blue-500" />
                    <span className="text-sm">Zużycie wody</span>
                  </div>
                  <span className="font-semibold">{passport.environmentalImpact.waterUsage_liters} L</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <ThermometerSun className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm">Energia</span>
                  </div>
                  <span className="font-semibold">{passport.environmentalImpact.energy_kWh.toFixed(1)} kWh</span>
                </div>
                {passport.environmentalImpact.recycledContentPercentage > 0 && (
                  <div className="flex items-center justify-between p-3 bg-eco-excellent/10 rounded-lg border border-eco-excellent/30">
                    <div className="flex items-center gap-2">
                      <Recycle className="w-5 h-5 text-eco-excellent" />
                      <span className="text-sm">Materiały z recyklingu</span>
                    </div>
                    <span className="font-semibold text-eco-excellent">
                      {passport.environmentalImpact.recycledContentPercentage}%
                    </span>
                  </div>
                )}
                {passport.environmentalImpact.hazardousSubstances.length > 0 && (
                  <div className="p-3 bg-eco-poor/10 rounded-lg border border-eco-poor/30">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-eco-poor" />
                      <span className="text-sm font-semibold text-eco-poor">Substancje niebezpieczne</span>
                    </div>
                    <ul className="text-xs text-eco-poor/80 ml-7">
                      {passport.environmentalImpact.hazardousSubstances.map((substance, i) => (
                        <li key={i}>• {substance}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Manufacturing Info */}
            <div className="mt-4 bg-card rounded-2xl p-4 shadow-eco border border-border">
              <h2 className="font-display font-semibold mb-3">Produkcja</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Factory className="w-5 h-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{passport.manufacturing.producer.name}</p>
                    <p className="text-xs text-muted-foreground">{passport.manufacturing.producer.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1">Miejsca produkcji</p>
                    {passport.manufacturing.productionSites.map((site, i) => (
                      <div key={i} className="text-xs text-muted-foreground mb-1">
                        • {site.country} - {site.processes.join(', ')}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Certifications */}
            {passport.materialComposition.some(m => m.certifications.length > 0) && (
              <div className="mt-4 bg-card rounded-2xl p-4 shadow-eco border border-border">
                <h2 className="font-display font-semibold mb-3">Certyfikaty</h2>
                <div className="flex flex-wrap gap-2">
                  {passport.materialComposition
                    .flatMap(m => m.certifications)
                    .filter((cert, i, arr) => arr.indexOf(cert) === i)
                    .map((cert, i) => (
                      <span key={i} className="bg-eco-excellent/10 border border-eco-excellent/30 text-eco-excellent px-3 py-1.5 rounded-full text-sm flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        {cert}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/* Supply Chain */}
            <div className="mt-4 bg-card rounded-2xl p-4 shadow-eco border border-border">
              <button
                onClick={() => setShowSupplyChain(!showSupplyChain)}
                className="w-full flex items-center justify-between"
              >
                <h2 className="font-display font-semibold">Łańcuch dostaw</h2>
                {showSupplyChain ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
              <motion.div
                initial={false}
                animate={{ height: showSupplyChain ? 'auto' : '0px' }}
                className="overflow-hidden"
              >
                <div className="mt-3 space-y-0">
                  {passport.supplyChainTraceability.chain.map((item, i) => (
                    <div key={i} className="relative pl-6 pb-4 last:pb-0">
                      {i < passport.supplyChainTraceability.chain.length - 1 && (
                        <div className="absolute left-[7px] top-2 bottom-0 w-0.5 bg-accent/30" />
                      )}
                      <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-accent border-2 border-background shadow-sm" />
                      <p className="text-sm font-medium mb-0.5">{item.stage}</p>
                      <p className="text-xs text-muted-foreground">{item.supplier} • {item.country}</p>
                      {item.certificate && (
                        <p className="text-xs text-eco-excellent mt-1">✓ {item.certificate}</p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* End of Life */}
            {passport.endOfLife.takeBackPrograms.length > 0 && (
              <div className="mt-4 bg-card rounded-2xl p-4 shadow-eco border border-border">
                <h2 className="font-display font-semibold mb-3">Program zwrotu</h2>
                {passport.endOfLife.takeBackPrograms.map((program, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-eco-excellent/10 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{program.programName}</p>
                      <p className="text-xs text-muted-foreground">{program.url}</p>
                    </div>
                    <Recycle className="w-5 h-5 text-eco-excellent" />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-5 p-4 bg-background border-t border-border safe-bottom">
        <div className="flex gap-3 max-w-lg mx-auto mb-3">
          {isPublic ? (
            <Button
              variant="outline"
              onClick={onScanAgain}
              className="flex-1"
            >
              Wróć do szafy
            </Button>
          ) : isInWardrobe ? (
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
                onClick={() => onAddToWardrobe(null)}
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
                onClick={() => onAddToWardrobe(uploadedImage)}
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
