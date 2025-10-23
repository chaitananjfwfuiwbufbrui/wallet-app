import React, { createContext, useContext, useEffect } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import { setTokenProvider } from '../services/api';

WebBrowser.maybeCompleteAuthSession();

interface User {
  id: string;
  email: string;
  name: string;
  photoUrl?: string;
  clerkId?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isSignedIn: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, signOut: clerkSignOut, getToken: clerkGetToken } = useClerkAuth();
  const { user: clerkUser } = useUser();
  const [user, setUser] = React.useState<User | null>(null);

  // Set up token provider for API calls
  useEffect(() => {
    setTokenProvider(clerkGetToken);
  }, [clerkGetToken]);

  // Sync Clerk user with our user state
  useEffect(() => {
    if (isLoaded && isSignedIn && clerkUser) {
      const mappedUser: User = {
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        name: clerkUser.fullName || clerkUser.firstName || 'User',
        photoUrl: clerkUser.imageUrl,
        clerkId: clerkUser.id,
      };
      setUser(mappedUser);
    } else if (isLoaded && !isSignedIn) {
      setUser(null);
    }
  }, [isLoaded, isSignedIn, clerkUser]);

  const signInWithGoogle = async () => {
    // This will be handled by Clerk's OAuth flow in the login screen
    // This function is kept for compatibility but the actual sign-in
    // happens through Clerk's useOAuth hook
    throw new Error('Use Clerk OAuth flow from login screen');
  };

  const signOut = async () => {
    try {
      await clerkSignOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const getToken = async (): Promise<string | null> => {
    try {
      return await clerkGetToken();
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading: !isLoaded, 
        isSignedIn: isSignedIn || false,
        signInWithGoogle, 
        signOut,
        getToken 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
