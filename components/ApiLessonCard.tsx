import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, BookOpen, ChartBar as BarChart3 } from 'lucide-react-native';
import { ApiLesson } from '../services/api';

interface ApiLessonCardProps {
  lesson: ApiLesson;
  onPress: () => void;
}

export function ApiLessonCard({ lesson, onPress }: ApiLessonCardProps) {
  // Simulate difficulty based on lesson order
  const getDifficulty = (order: number) => {
    if (order <= 1) return { level: 'Beginner', color: '#10B981' };
    if (order <= 3) return { level: 'Intermediate', color: '#F59E0B' };
    return { level: 'Advanced', color: '#EF4444' };
  };

  const difficulty = getDifficulty(lesson.order);
  
  // Simulate estimated time based on lesson order
  const estimatedTime = `${2 + lesson.order}h`;
  
  // Simulate topic count
  const topicCount = Math.max(3, 5 - lesson.order);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{lesson.title}</Text>
          <Text style={styles.description}>{lesson.description}</Text>
        </View>
        <View style={[styles.difficultyBadge, { backgroundColor: difficulty.color }]}>
          <Text style={styles.difficultyText}>{difficulty.level}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <BookOpen size={16} color="#6B7280" />
          <Text style={styles.statText}>{topicCount} Topics</Text>
        </View>
        <View style={styles.stat}>
          <Clock size={16} color="#6B7280" />
          <Text style={styles.statText}>{estimatedTime}</Text>
        </View>
        <View style={styles.stat}>
          <BarChart3 size={16} color="#6B7280" />
          <Text style={styles.statText}>0%</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '0%' }]} />
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
});