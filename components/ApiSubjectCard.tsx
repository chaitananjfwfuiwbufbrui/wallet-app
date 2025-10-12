import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ApiSubject } from '../services/api';

interface ApiSubjectCardProps {
  subject: ApiSubject;
  onPress: () => void;
}

export function ApiSubjectCard({ subject, onPress }: ApiSubjectCardProps) {
  // Generate a color based on subject ID for consistency
  const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'];
  const colorIndex = subject.id.charCodeAt(0) % colors.length;
  const color = colors[colorIndex];

  // Generate an icon based on subject title
  const getIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('math')) return '📐';
    if (lowerTitle.includes('string') || lowerTitle.includes('programming')) return '💻';
    if (lowerTitle.includes('science')) return '🔬';
    if (lowerTitle.includes('art')) return '🎨';
    if (lowerTitle.includes('language')) return '🗣️';
    return '📚';
  };

  return (
    <TouchableOpacity style={[styles.card, { borderLeftColor: color }]} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.icon}>{getIcon(subject.title)}</Text>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{subject.title}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {subject.description}
          </Text>
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>Ready to start</Text>
          <Text style={styles.lessonCount}>Tap to explore</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 32,
    marginRight: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  progressContainer: {
    gap: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  lessonCount: {
    fontSize: 14,
    color: '#6B7280',
  },
});