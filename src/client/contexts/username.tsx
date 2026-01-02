import { createContext, useContext, useState, ReactNode } from 'react';

interface UsernameContextType {
  username: string;
  setUsername: (username: string) => void;
}

const UsernameContext = createContext<UsernameContextType | null>(null);

const STORAGE_KEY = 'devcard-username';

export function UsernameProvider({ children }: { children: ReactNode }) {
  const [username, setUsernameState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY) || '';
    }
    return '';
  });

  const setUsername = (newUsername: string) => {
    setUsernameState(newUsername);
    if (newUsername) {
      localStorage.setItem(STORAGE_KEY, newUsername);
    }
  };

  return (
    <UsernameContext.Provider value={{ username, setUsername }}>
      {children}
    </UsernameContext.Provider>
  );
}

export function useUsername() {
  const context = useContext(UsernameContext);
  if (!context) {
    throw new Error('useUsername must be used within a UsernameProvider');
  }
  return context;
}
