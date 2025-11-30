import { BottomNav } from './BottomNav';
import { ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export function AppLayout({ children, showNav = true }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <main className={showNav ? 'pb-24 mt-8' : 'pt-8'}>
        {children}
      </main>
      {showNav && <BottomNav />}
    </div>
  );
}
