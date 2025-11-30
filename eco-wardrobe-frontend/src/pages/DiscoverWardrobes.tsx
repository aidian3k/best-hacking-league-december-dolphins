import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { EcoScore } from '@/components/ui/EcoScore';
import { useSavedWardrobesQuery, useAddWardrobeMutation, useInfluencerWardrobesQuery } from '@/api/wardrobeShare';
import { calculateWardrobeStats } from '@/services/wardrobeStats';
import { Users, Shirt, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function DiscoverWardrobes() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [shareCode, setShareCode] = useState('');
  const { data: savedWardrobes, isLoading: isLoadingSaved } = useSavedWardrobesQuery();
  const { data: influencerWardrobes, isLoading: isLoadingInfluencers } = useInfluencerWardrobesQuery();
  const addWardrobeMutation = useAddWardrobeMutation();

  const handleAddWardrobe = () => {
    if (!shareCode.trim()) {
      toast({
        title: 'Błąd',
        description: 'Wpisz kod szafy',
        variant: 'destructive',
      });
      return;
    }

    addWardrobeMutation.mutate(shareCode.trim());
    setShareCode('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddWardrobe();
    }
  };

  const formatFollowers = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const renderWardrobeCard = (
    id: string,
    name: string,
    itemCount: number,
    wardrobeEcoScore: number,
    index: number,
    profilePicture?: string | null,
    isInfluencer?: boolean
  ) => (
    <motion.div
      key={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => navigate(`/public-wardrobe/${id}`)}
      className={cn(
        'bg-card rounded-xl p-4 border border-border cursor-pointer',
        'hover:border-primary/30 transition-colors'
      )}
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          {profilePicture ? (
            <img
              src={profilePicture}
              alt={name}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Users className="w-8 h-8 text-primary" />
            </div>
          )}
          {isInfluencer && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
              <BadgeCheck className="w-4 h-4 text-accent-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{name}</h3>
          <div className="flex items-center gap-4 mt-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Shirt className="w-3 h-3" />
              {itemCount} produktów
            </div>
          </div>
        </div>
        <EcoScore score={wardrobeEcoScore} size="sm" animated={false} />
      </div>
    </motion.div>
  );

  return (
    <AppLayout>
      <div className="px-4 pt-4 pb-8 safe-top">
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl">Odkryj szafy</h1>
          <p className="text-muted-foreground text-sm">Obserwuj szafy znajomych</p>
        </div>

        <div>
          <h2 className="font-display font-semibold text-lg mb-4">Obserwowane szafy</h2>
          
          <div className="bg-muted rounded-xl p-4 mb-4">
            <p className="text-muted-foreground text-sm mb-3">
              Wpisz kod szafy znajomego
            </p>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Wpisz kod szafy"
                value={shareCode}
                onChange={(e) => setShareCode(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button
                onClick={handleAddWardrobe}
                disabled={addWardrobeMutation.isPending}
                className="gradient-eco text-primary-foreground"
              >
                {addWardrobeMutation.isPending ? 'Dodawanie...' : 'Dodaj'}
              </Button>
            </div>
          </div>

          {isLoadingSaved ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">Ładowanie obserwowanych szaf...</p>
            </div>
          ) : savedWardrobes && savedWardrobes.length > 0 ? (
            <div className="space-y-3">
              {savedWardrobes.map((wardrobe, index) => {
                const stats = calculateWardrobeStats(wardrobe.products);
                return renderWardrobeCard(
                  wardrobe.user.id,
                  wardrobe.user.name,
                  wardrobe.products.length,
                  stats.avgEcoScore,
                  index,
                  wardrobe.user.profilePicture,
                  wardrobe.user.isInfluencer
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 bg-muted rounded-xl">
              <p className="text-muted-foreground text-sm">Brak obserwowanych szaf</p>
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary to-accent rounded-2xl p-5 mb-6 text-primary-foreground mt-8"
        >
          <h2 className="font-display font-semibold text-lg mb-1">🌿 Eko Liderzy</h2>
          <p className="text-primary-foreground/80 text-sm">
            Poznaj osoby, które dbają o środowisko poprzez świadome wybory modowe
          </p>
        </motion.div>

        {isLoadingInfluencers ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">Ładowanie szaf influencerów...</p>
          </div>
        ) : influencerWardrobes && influencerWardrobes.length > 0 ? (
          <div className="space-y-3">
            {influencerWardrobes.map((wardrobe, index) => {
              const stats = calculateWardrobeStats(wardrobe.products);
              return renderWardrobeCard(
                wardrobe.user.id,
                wardrobe.user.name,
                wardrobe.products.length,
                stats.avgEcoScore,
                index,
                wardrobe.user.profilePicture,
                wardrobe.user.isInfluencer
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 bg-muted rounded-xl">
            <p className="text-muted-foreground text-sm">Brak dostępnych szaf influencerów</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

