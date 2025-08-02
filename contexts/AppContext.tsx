import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserProgress } from '../types';
import { mockUserProgress } from '../data/mockData';

interface AppContextType {
  userProgress: UserProgress;
  updateProgress: (xp: number) => void;
  incrementStreak: () => void;
  addBadge: (badge: string) => void;
  currentSubject: string | null;
  setCurrentSubject: (id: string | null) => void;
  currentLesson: string | null;
  setCurrentLesson: (id: string | null) => void;
  lastViewedTopic: string | null;
  setLastViewedTopic: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userProgress, setUserProgress] = useState<UserProgress>(mockUserProgress);
  const [currentSubject, setCurrentSubject] = useState<string | null>(null);
  const [currentLesson, setCurrentLesson] = useState<string | null>(null);
  const [lastViewedTopic, setLastViewedTopic] = useState<string | null>('1');

  const updateProgress = (xp: number) => {
    setUserProgress(prev => ({
      ...prev,
      xp: prev.xp + xp,
      level: Math.floor((prev.xp + xp) / 500) + 1
    }));
  };

  const incrementStreak = () => {
    setUserProgress(prev => ({
      ...prev,
      streak: prev.streak + 1
    }));
  };

  const addBadge = (badge: string) => {
    setUserProgress(prev => ({
      ...prev,
      badges: prev.badges.includes(badge) ? prev.badges : [...prev.badges, badge]
    }));
  };

  return (
    <AppContext.Provider value={{
      userProgress,
      updateProgress,
      incrementStreak,
      addBadge,
      currentSubject,
      setCurrentSubject,
      currentLesson,
      setCurrentLesson,
      lastViewedTopic,
      setLastViewedTopic
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}