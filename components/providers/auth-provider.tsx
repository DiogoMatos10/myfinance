'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, Unsubscribe } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase/config';
import { getUserData, UserData } from '@/lib/firebase/auth';

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    const startListener = async () => {
      try {
        const auth = getFirebaseAuth();
        unsubscribe = onAuthStateChanged(auth, async currentUser => {
          setUser(currentUser);

          if (currentUser) {
            const data = await getUserData(currentUser.uid);
            setUserData(data);
          } else {
            setUserData(null);
          }

          setLoading(false);
        });
      } catch (error) {
        console.error('Firebase auth initialization failed:', error);
        setUser(null);
        setUserData(null);
        setLoading(false);
      }
    };

    startListener();

    return () => unsubscribe?.();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
