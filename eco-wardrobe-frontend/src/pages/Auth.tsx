import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Leaf, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLoginMutation, useRegisterMutation } from '@/api/auth';
import { useUser } from '@/contexts/UserContext';

type AuthMode = 'login' | 'register';

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser } = useUser();

  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let user;
      
      if (mode === 'login') {
        user = await loginMutation.mutateAsync({ email, password });
      } else {
        user = await registerMutation.mutateAsync({
          email,
          password,
          name,
        });
      }

      setUser(user);
      
      toast({
        title: mode === 'login' ? 'Zalogowano!' : 'Konto utworzone!',
        description: `Witaj ${user.name} w EkoSzafie!`,
      });

      navigate('/wardrobe');
    } catch (error) {
      toast({
        title: 'Błąd',
        description: mode === 'login' 
          ? 'Nie udało się zalogować. Sprawdź dane.' 
          : 'Nie udało się utworzyć konta. Spróbuj ponownie.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="gradient-eco pt-12 pb-16 px-4 text-center relative overflow-hidden">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="w-20 h-20 mx-auto mb-6 bg-primary-foreground/20 rounded-full flex items-center justify-center"
        >
          <Leaf className="w-10 h-10 text-primary-foreground" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-display font-bold text-3xl text-primary-foreground mb-2"
        >
          EkoSzafa
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-primary-foreground/80"
        >
          Twoja ekologiczna garderoba
        </motion.p>

        <div className="absolute top-10 left-10 w-20 h-20 bg-primary-foreground/10 rounded-full blur-2xl" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex-1 -mt-8 px-4"
      >
        <div className="bg-card rounded-2xl shadow-eco-lg border border-border p-6 max-w-md mx-auto">
          <div className="flex bg-muted rounded-xl p-1 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                mode === 'login' 
                  ? 'bg-card text-foreground shadow-sm' 
                  : 'text-muted-foreground'
              }`}
            >
              Logowanie
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                mode === 'register' 
                  ? 'bg-card text-foreground shadow-sm' 
                  : 'text-muted-foreground'
              }`}
            >
              Rejestracja
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === 'register' && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <Label htmlFor="name">Imię i nazwisko</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Jan Kowalski"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                      required={mode === 'register'}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="jan@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Hasło</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 gradient-eco border-0 font-display text-base"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Leaf className="w-5 h-5" />
                </motion.div>
              ) : (
                <>
                  {mode === 'login' ? 'Zaloguj się' : 'Utwórz konto'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <Button
              variant="ghost"
              onClick={() => {
                setUser({
                  id: '550e8400-e29b-41d4-a716-446655440000',
                  email: 'demo@example.com',
                  name: 'Demo Użytkownik',
                });
                navigate('/wardrobe');
              }}
              className="w-full text-muted-foreground"
            >
              Wejdź bez logowania (demo)
            </Button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 max-w-md mx-auto pb-8">
          {[
            { icon: '📱', label: 'Skanuj' },
            { icon: '🌿', label: 'Analizuj' },
            { icon: '♻️', label: 'Oszczędzaj' },
          ].map((feature, i) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="text-center"
            >
              <div className="text-2xl mb-1">{feature.icon}</div>
              <p className="text-xs text-muted-foreground">{feature.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
