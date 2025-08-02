import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Flame, Trophy, Zap } from 'lucide-react-native';
import { UserProgress } from '../types';

interface ProgressSummaryProps {
  progress: UserProgress;
}

export function ProgressSummary({ progress }: ProgressSummaryProps) {
  return (
    <View style={styles.container}>
      <View style={styles.statCard}>
        <Flame size={20} color="#F59E0B" />
        <Text style={styles.statNumber}>{progress.streak}</Text>
        <Text style={styles.statLabel}>Day Streak</Text>
      </View>
      
      <View style={styles.statCard}>
        <Zap size={20} color="#8B5CF6" />
        <Text style={styles.statNumber}>{progress.xp}</Text>
        <Text style={styles.statLabel}>XP Points</Text>
      </View>
      
      <View style={styles.statCard}>
        <Trophy size={20} color="#10B981" />
        <Text style={styles.statNumber}>{progress.level}</Text>
        <Text style={styles.statLabel}>Level</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});