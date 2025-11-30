import { useState } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { mockUserProfile, mockBadges } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  User, 
  AlertCircle, 
  Heart, 
  Award, 
  LogOut, 
  ChevronRight,
  Plus,
  X,
  Leaf
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useModifyPreferencesMutation } from '@/api/user';

export default function Settings() {
  const { user } = useUser();
  const [allergies, setAllergies] = useState<string[]>(mockUserProfile.allergies);
  const [preferences, setPreferences] = useState<string[]>(mockUserProfile.preferences);
  const [newAllergy, setNewAllergy] = useState('');
  const [newPreference, setNewPreference] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const modifyPreferencesMutation = useModifyPreferencesMutation();

  // Helper function to update preferences on backend
  const updatePreferencesOnBackend = async (updatedAllergies: string[], updatedPreferences: string[]) => {
    if (!user?.id) {
      toast({
        title: 'Błąd',
        description: 'Musisz być zalogowany',
        variant: 'destructive'
      });
      return;
    }

    try {
      await modifyPreferencesMutation.mutateAsync({
        userId: user.id,
        preferences: {
          allergies: updatedAllergies,
          preferredMaterials: updatedPreferences,
        },
      });
    } catch (error) {
      toast({
        title: 'Błąd',
        description: 'Nie udało się zaktualizować preferencji',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const addAllergy = async () => {
    if (newAllergy.trim()) {
      const updatedAllergies = [...allergies, newAllergy.trim()];
      setAllergies(updatedAllergies);
      setNewAllergy('');

      try {
        await updatePreferencesOnBackend(updatedAllergies, preferences);
        toast({ title: 'Dodano alergię' });
      } catch (error) {
        // Rollback on error
        setAllergies(allergies);
      }
    }
  };

  const removeAllergy = async (index: number) => {
    const updatedAllergies = allergies.filter((_, i) => i !== index);
    setAllergies(updatedAllergies);

    try {
      await updatePreferencesOnBackend(updatedAllergies, preferences);
      toast({ title: 'Usunięto alergię' });
    } catch (error) {
      // Rollback on error
      setAllergies(allergies);
    }
  };

  const addPreference = async () => {
    if (newPreference.trim()) {
      const updatedPreferences = [...preferences, newPreference.trim()];
      setPreferences(updatedPreferences);
      setNewPreference('');

      try {
        await updatePreferencesOnBackend(allergies, updatedPreferences);
        toast({ title: 'Dodano preferencję' });
      } catch (error) {
        // Rollback on error
        setPreferences(preferences);
      }
    }
  };

  const removePreference = async (index: number) => {
    const updatedPreferences = preferences.filter((_, i) => i !== index);
    setPreferences(updatedPreferences);

    try {
      await updatePreferencesOnBackend(allergies, updatedPreferences);
      toast({ title: 'Usunięto preferencję' });
    } catch (error) {
      // Rollback on error
      setPreferences(preferences);
    }
  };

  const handleLogout = () => {
    toast({ title: 'Wylogowano' });
    navigate('/');
  };

  return (
    <AppLayout>
      <div className="px-4 pt-4 pb-8 safe-top">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl">Profil</h1>
          <p className="text-muted-foreground text-sm">Zarządzaj swoim kontem</p>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl p-4 border border-border mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              {mockUserProfile.avatarUrl ? (
                <img
                  src={mockUserProfile.avatarUrl}
                  alt={mockUserProfile.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-primary-foreground" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-lg">{mockUserProfile.name}</h2>
              <p className="text-sm text-muted-foreground">
                Członek od {mockUserProfile.joinedAt.toLocaleDateString('pl-PL')}
              </p>
            </div>
            <div className="text-center">
              <p className="font-display font-bold text-2xl text-primary">{mockUserProfile.ecoPoints}</p>
              <p className="text-xs text-muted-foreground">punktów</p>
            </div>
          </div>
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl p-4 border border-border mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-primary" />
            <h3 className="font-display font-semibold">Twoje odznaki</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {mockBadges.map((badge) => (
              <div
                key={badge.id}
                className="flex items-center gap-2 bg-muted px-3 py-2 rounded-lg"
              >
                <span className="text-xl">{badge.icon}</span>
                <div>
                  <p className="text-sm font-medium">{badge.name}</p>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Allergies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-xl p-4 border border-border mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <h3 className="font-display font-semibold">Alergie materiałowe</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Produkty z tymi materiałami będą oznaczone ostrzeżeniem
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {allergies.map((allergy, index) => (
              <span
                key={index}
                className="flex items-center gap-1 bg-destructive/10 text-destructive px-3 py-1 rounded-full text-sm"
              >
                {allergy}
                <button onClick={() => removeAllergy(index)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="np. Lateks, Nikiel..."
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
              className="flex-1"
            />
            <Button onClick={addAllergy} size="icon" variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl p-4 border border-border mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-eco-good" />
            <h3 className="font-display font-semibold">Preferowane materiały</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Produkty z tymi materiałami będą podświetlone
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {preferences.map((pref, index) => (
              <span
                key={index}
                className="flex items-center gap-1 bg-eco-good/10 text-eco-good px-3 py-1 rounded-full text-sm"
              >
                {pref}
                <button onClick={() => removePreference(index)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="np. Len, Tencel..."
              value={newPreference}
              onChange={(e) => setNewPreference(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addPreference()}
              className="flex-1"
            />
            <Button onClick={addPreference} size="icon" variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-2"
        >
          <button className="w-full flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-3">
              <Leaf className="w-5 h-5 text-primary" />
              <span className="font-medium">O projekcie EkoSzafa</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:border-destructive/30 transition-colors text-destructive"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Wyloguj się</span>
            </div>
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </AppLayout>
  );
}
