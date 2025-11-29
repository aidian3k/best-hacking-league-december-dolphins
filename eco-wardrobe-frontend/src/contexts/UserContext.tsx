import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types/user';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const clearUser = () => {
    setUser(null);
  };

  const value: UserContextType = {
    user,
    setUser,
    clearUser,
    isAuthenticated: user !== null,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

