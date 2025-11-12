'use client';

import { getAuth, onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, signOut, Auth } from 'firebase/auth';
import { firebaseApp } from './config';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
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
