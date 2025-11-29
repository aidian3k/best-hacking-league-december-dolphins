import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { EcoScore } from '@/components/ui/EcoScore';
import { mockInfluencers } from '@/data/mockData';
import { BadgeCheck, Users, Shirt } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Influencers() {
  const navigate = useNavigate();

  const formatFollowers = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  return (
    <AppLayout>
      <div className="px-4 pt-4 pb-8 safe-top">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl">Odkryj szafy</h1>
          <p className="text-muted-foreground text-sm">Inspiruj się ekologicznymi influencerami</p>
        </div>

        {/* Featured Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary to-accent rounded-2xl p-5 mb-6 text-primary-foreground"
        >
          <h2 className="font-display font-semibold text-lg mb-1">🌿 Eko Liderzy</h2>
          <p className="text-primary-foreground/80 text-sm">
            Poznaj osoby, które dbają o środowisko poprzez świadome wybory modowe
          </p>
        </motion.div>

        {/* Influencers List */}
        <div className="space-y-3">
          {mockInfluencers.map((influencer, index) => (
            <motion.div
              key={influencer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/public-wardrobe/${influencer.id}`)}
              className={cn(
                'bg-card rounded-xl p-4 border border-border cursor-pointer',
                'hover:border-primary/30 transition-colors'
              )}
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={influencer.avatarUrl}
                    alt={influencer.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  {influencer.verified && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                      <BadgeCheck className="w-4 h-4 text-accent-foreground" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{influencer.name}</h3>
                  <p className="text-sm text-muted-foreground">{influencer.handle}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="w-3 h-3" />
                      {formatFollowers(influencer.followers)}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Shirt className="w-3 h-3" />
                      {influencer.itemCount} produktów
                    </div>
                  </div>
                </div>

                {/* Eco Score */}
                <EcoScore score={influencer.wardrobeEcoScore} size="sm" animated={false} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Friend's Wardrobe Section */}
        <div className="mt-8">
          <h2 className="font-display font-semibold text-lg mb-4">Szafa znajomego</h2>
          <div className="bg-muted rounded-xl p-6 text-center">
            <p className="text-muted-foreground text-sm mb-3">
              Wpisz link lub kod szafy znajomego
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="np. ekoszafa.app/u/jan123"
                className="flex-1 px-4 py-2 rounded-lg bg-card border border-border text-sm"
              />
              <button className="px-4 py-2 gradient-eco text-primary-foreground rounded-lg text-sm font-medium">
                Otwórz
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
