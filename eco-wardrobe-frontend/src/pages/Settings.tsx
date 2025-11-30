import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { AvatarUpload } from '@/components/ui/AvatarUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  LogOut, 
  ChevronRight,
  Leaf,
  AlertCircle,
  Heart,
  Plus,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useUploadUserPhotoMutation, useModifyPreferencesMutation } from '@/api/user';
import { getUserAvatarUrl, base64ToDataUrl } from '@/lib/utils';
import { User } from '@/types/user';

export default function Settings() {
  const { user, setUser } = useUser();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [newAllergy, setNewAllergy] = useState('');
  const [newPreference, setNewPreference] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const uploadPhotoMutation = useUploadUserPhotoMutation();

  const allergies = useMemo(() => user?.preferences?.allergies || [], [user]);
  const preferences = useMemo(() => user?.preferences?.preferredMaterials || [], [user]);

  const userAvatarUrl = useMemo(() => {
    if (!user) return undefined;
    return getUserAvatarUrl(user);
  }, [user]);

  const displayAvatarUrl = useMemo(() => {
    if (uploadedImage) {
      return base64ToDataUrl(uploadedImage);
    }
    return userAvatarUrl;
  }, [uploadedImage, userAvatarUrl]);

  const handleAvatarChange = async (base64: string | null) => {
    setUploadedImage(base64);
    
    if (!user?.id) {
      return;
    }

    if (base64 === null) {
      setUser({
        ...user,
        profilePicture: null
      });
      return;
    }

    try {
      const base64WithoutPrefix = base64.includes(',') ? base64.split(',')[1] : base64;
      const updatedUser = await uploadPhotoMutation.mutateAsync({
        userId: user.id,
        imageBase64: base64WithoutPrefix
      });
      setUser(updatedUser);
      setUploadedImage(null);
      toast({
        title: 'Zdjęcie wgrane',
        description: 'Zdjęcie profilowe zostało zaktualizowane.',
      });
    } catch (error) {
      console.error('Błąd wgrywania zdjęcia:', error);
      toast({
        title: 'Błąd',
        description: error instanceof Error ? error.message : 'Nie udało się wgrać zdjęcia profilowego.',
        variant: 'destructive',
      });
      setUploadedImage(null);
    }
  };

  const modifyPreferencesMutation = useModifyPreferencesMutation();

  const updatePreferencesOnBackend = async (currentUser: User, updatedAllergies: string[], updatedPreferences: string[]) => {
    if (!currentUser?.id) {
      toast({
        title: 'Błąd',
        description: 'Musisz być zalogowany',
        variant: 'destructive'
      });
      throw new Error('User not logged in');
    }

    const response = await modifyPreferencesMutation.mutateAsync({
      userId: currentUser.id,
      preferences: {
        allergies: updatedAllergies,
        preferredMaterials: updatedPreferences,
      },
    });

    const updatedPreferencesData = {
      allergies: response.preference?.allergies?.map(a => a.name) || [],
      preferredMaterials: response.preference?.preferredMaterials?.map(pm => pm.material) || [],
    };

    setUser({
      ...currentUser,
      preferences: updatedPreferencesData
    });
  };

  const addAllergy = async () => {
    if (!newAllergy.trim() || !user) return;

    const allergyToAdd = newAllergy.trim();
    const currentAllergies = user.preferences?.allergies || [];
    const currentPreferences = user.preferences?.preferredMaterials || [];
    const updatedAllergies = [...currentAllergies, allergyToAdd];
    
    const updatedUser = {
      ...user,
      preferences: {
        ...user.preferences,
        allergies: updatedAllergies
      }
    };

    setNewAllergy('');

    try {
      await updatePreferencesOnBackend(updatedUser, updatedAllergies, currentPreferences);
      toast({ title: 'Dodano alergię' });
    } catch (error) {
      setUser({
        ...user,
        preferences: {
          ...user.preferences,
          allergies: currentAllergies
        }
      });
      toast({
        title: 'Błąd',
        description: 'Nie udało się dodać alergii',
        variant: 'destructive'
      });
    }
  };

  const removeAllergy = async (index: number) => {
    if (!user) return;

    const currentAllergies = user.preferences?.allergies || [];
    const currentPreferences = user.preferences?.preferredMaterials || [];
    const updatedAllergies = currentAllergies.filter((_, i) => i !== index);
    
    const updatedUser = {
      ...user,
      preferences: {
        ...user.preferences,
        allergies: updatedAllergies
      }
    };
    
    try {
      await updatePreferencesOnBackend(updatedUser, updatedAllergies, currentPreferences);
      toast({ title: 'Usunięto alergię' });
    } catch (error) {
      setUser({
        ...user,
        preferences: {
          ...user.preferences,
          allergies: currentAllergies
        }
      });
      toast({
        title: 'Błąd',
        description: 'Nie udało się usunąć alergii',
        variant: 'destructive'
      });
    }
  };

  const addPreference = async () => {
    if (!newPreference.trim() || !user) return;

    const preferenceToAdd = newPreference.trim();
    const currentAllergies = user.preferences?.allergies || [];
    const currentPreferences = user.preferences?.preferredMaterials || [];
    const updatedPreferences = [...currentPreferences, preferenceToAdd];
    
    const updatedUser = {
      ...user,
      preferences: {
        ...user.preferences,
        preferredMaterials: updatedPreferences
      }
    };
    
    setNewPreference('');

    try {
      await updatePreferencesOnBackend(updatedUser, currentAllergies, updatedPreferences);
      toast({ title: 'Dodano preferencję' });
    } catch (error) {
      setUser({
        ...user,
        preferences: {
          ...user.preferences,
          preferredMaterials: currentPreferences
        }
      });
      toast({
        title: 'Błąd',
        description: 'Nie udało się dodać preferencji',
        variant: 'destructive'
      });
    }
  };

  const removePreference = async (index: number) => {
    if (!user) return;

    const currentAllergies = user.preferences?.allergies || [];
    const currentPreferences = user.preferences?.preferredMaterials || [];
    const updatedPreferences = currentPreferences.filter((_, i) => i !== index);
    
    const updatedUser = {
      ...user,
      preferences: {
        ...user.preferences,
        preferredMaterials: updatedPreferences
      }
    };
    
    try {
      await updatePreferencesOnBackend(updatedUser, currentAllergies, updatedPreferences);
      toast({ title: 'Usunięto preferencję' });
    } catch (error) {
      setUser({
        ...user,
        preferences: {
          ...user.preferences,
          preferredMaterials: currentPreferences
        }
      });
      toast({
        title: 'Błąd',
        description: 'Nie udało się usunąć preferencji',
        variant: 'destructive'
      });
    }
  };

  const handleLogout = () => {
    toast({ title: 'Wylogowano' });
    navigate('/');
  };

  if (!user) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <p className="text-muted-foreground">Musisz być zalogowany, aby zobaczyć profil</p>
        </div>
      </AppLayout>
    );
  }

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
            <AvatarUpload
              avatarUrl={displayAvatarUrl}
              onImageChange={handleAvatarChange}
              size="sm"
            />
            <div className="flex-1">
              <h2 className="font-semibold text-lg">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {user.isInfluencer && (
                <span className="inline-block mt-1 text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                  Eko Lider
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Allergies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
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
          transition={{ delay: 0.15 }}
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
          transition={{ delay: 0.2 }}
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
