import { cn } from '@/lib/utils';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shirt, BarChart3, ScanLine, Users, Settings } from 'lucide-react';

const navItems = [
  { path: '/wardrobe', label: 'Szafa', icon: Shirt },
  { path: '/analytics', label: 'Analiza', icon: BarChart3 },
  { path: '/scanner', label: 'Skanuj', icon: ScanLine, isMain: true },
  { path: '/influencers', label: 'Odkryj', icon: Users },
  { path: '/settings', label: 'Profil', icon: Settings },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-bottom z-50">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2 px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          if (item.isMain) {
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="relative -mt-6"
              >
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'w-14 h-14 rounded-full gradient-eco flex items-center justify-center shadow-eco-lg',
                    isActive && 'animate-pulse-eco'
                  )}
                >
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </motion.div>
              </button>
            );
          }

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors',
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-2 w-1 h-1 rounded-full bg-primary"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
