
'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth, User } from 'firebase/auth';
import { FirebaseStorage } from 'firebase/storage';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener'
import { initializeFirebase } from '@/firebase';

interface FirebaseProviderProps {
  children: ReactNode;
}

// Internal state for user authentication
interface UserAuthState {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// Combined state for the Firebase context
export interface FirebaseContextState {
  areServicesAvailable: boolean; // True if core services (app, firestore, auth instance) are provided
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null; // The Auth service instance
  storage: FirebaseStorage | null;
  // User authentication state
  user: User | null;
  isUserLoading: boolean; // True during initial auth check
  userError: Error | null; // Error from auth listener
}

// Return type for useFirebase()
export interface FirebaseServicesAndUser {
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  storage: FirebaseStorage | null;
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// Return type for useUser() - specific to user auth state
export interface UserHookResult { 
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// React Context
export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

/**
 * FirebaseProvider manages and provides Firebase services and user authentication state.
 */
export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children
}) => {
  const [userAuthState, setUserAuthState] = useState<UserAuthState>({
    user: null,
    isUserLoading: true, // Start loading until first auth event
    userError: null,
  });

  const { firebaseApp, firestore, auth, storage } = useMemo(() => {
    return initializeFirebase();
  }, []);

  // Effect to subscribe to Firebase auth state changes
  useEffect(() => {
    if (!auth) {
        setUserAuthState({ user: null, isUserLoading: false, userError: null });
        return;
    }
    const unsubscribe = auth.onAuthStateChanged(
      (user) => setUserAuthState({ user, isUserLoading: false, userError: null }),
      (error) => setUserAuthState({ user: null, isUserLoading: false, userError: error })
    );

    return () => unsubscribe();
  }, [auth]);

  // Memoize the context value
  const contextValue = useMemo((): FirebaseContextState => {
    const servicesAvailable = !!(firebaseApp && firestore && auth && storage);
    return {
      areServicesAvailable: servicesAvailable,
      firebaseApp: servicesAvailable ? firebaseApp : null,
      firestore: servicesAvailable ? firestore : null,
      auth: servicesAvailable ? auth : null,
      storage: servicesAvailable ? storage : null,
      user: userAuthState.user,
      isUserLoading: userAuthState.isUserLoading,
      userError: userAuthState.userError,
    };
  }, [firebaseApp, firestore, auth, storage, userAuthState]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

/**
 * Hook to access core Firebase services and user authentication state.
 * Throws error if core services are not available or used outside provider.
 */
export const useFirebase = (): Partial<FirebaseServicesAndUser> => {
  const context = useContext(FirebaseContext);

  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }
  
  return context as FirebaseServicesAndUser;
};

/** Hook to access Firebase Auth instance. */
export const useAuth = (): Auth | null => {
  const { auth } = useFirebase();
  if (!auth) {
    if (typeof window !== 'undefined') {
      console.warn("Auth not initialized yet");
    }
    return null;
  }
  return auth;
};

/** Hook to access Firestore instance. */
export const useFirestore = (): Firestore | null => {
  const { firestore } = useFirebase();
  if (!firestore) {
    if (typeof window !== 'undefined') {
      console.warn("Firestore not initialized yet");
    }
    return null;
  }
  return firestore;
};

/** Hook to access Firebase App instance. */
export const useFirebaseApp = (): FirebaseApp | null => {
  const { firebaseApp } = useFirebase();
  if (!firebaseApp) {
    if (typeof window !== 'undefined') {
      console.warn("FirebaseApp not initialized yet");
    }
    return null;
  }
  return firebaseApp;
};

/** Hook to access Firebase Storage instance. */
export const useStorage = (): FirebaseStorage | null => {
    const { storage } = useFirebase();
    if (!storage) {
       if (typeof window !== 'undefined') {
          console.warn("Firebase Storage not initialized yet");
       }
       return null;
    }
    return storage;
}

type MemoFirebase <T> = T & {__memo?: boolean};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T | (MemoFirebase<T>) {
  const memoized = useMemo(factory, deps);
  
  if(typeof memoized !== 'object' || memoized === null) return memoized;
  (memoized as MemoFirebase<T>).__memo = true;
  
  return memoized;
}

/**
 * Hook specifically for accessing the authenticated user's state.
 * This provides the User object, loading status, and any auth errors.
 * @returns {UserHookResult} Object with user, isUserLoading, userError.
 */
export const useUser = (): UserHookResult => {
  const context = useContext(FirebaseContext);
   if (context === undefined) {
    throw new Error('useUser must be used within a FirebaseProvider.');
  }
  const { user, isUserLoading, userError } = context;
  return { user, isUserLoading, userError };
};
