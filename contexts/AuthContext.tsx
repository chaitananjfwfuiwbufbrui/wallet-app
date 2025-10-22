import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  photoUrl?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      // For now, create a mock user
      // In production, integrate with Google Sign-In
      const mockUser: User = {
        id: 'user_' + Date.now(),
        email: 'user@example.com',
        name: 'Demo User',
      };
      
      setUser(mockUser);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
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
