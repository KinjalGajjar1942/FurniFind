'use client';

import { getAuth, onAuthStateChanged, User, GoogleAuthProvider, signInWithRedirect, signOut, Auth, getRedirectResult } from 'firebase/auth';
import { firebaseApp } from './config';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';


const auth = getAuth(firebaseApp);

interface AuthContextType {
  user: User | null;
  loading: boolean;
  handleLogin: () => Promise<void>;
  handleLogout: () => Promise<void>;
  getFirebaseAuth: () => Auth;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  handleLogin: async () => {},
  handleLogout: async () => {},
  getFirebaseAuth: () => auth,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    getRedirectResult(auth).catch((error) => {
        console.error("Error from redirect result:", error);
        toast({
            variant: "destructive",
            title: "Sign-in Error",
            description: error.message || "An error occurred during sign-in."
        });
    });

    return () => unsubscribe();
  }, [toast]);

  const handleLogin = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error during sign-out:', error);
    }
  }, []);
  
  const getFirebaseAuth = useCallback(() => auth, []);

  const value = { user, loading, handleLogin, handleLogout, getFirebaseAuth };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const getFirebaseAuth = () => auth;