import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Subject } from '../types';

interface SubjectCardProps {
  subject: Subject;
  onPress: () => void;
}

export function SubjectCard({ subject, onPress }: SubjectCardProps) {
  return (
    <TouchableOpacity style={[styles.card, { borderLeftColor: subject.color }]} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.icon}>{subject.icon}</Text>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{subject.name}</Text>
          <Text style={styles.lastAccessed}>{subject.lastAccessed}</Text>
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>{subject.progress}% Complete</Text>
          <Text style={styles.lessonCount}>
            {subject.completedLessons}/{subject.totalLessons} Lessons
          </Text>
        </View>
        
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${subject.progress}%`, backgroundColor: subject.color }
            ]} 
          />
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
  lastAccessed: {
    fontSize: 14,
    color: '#6B7280',
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
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});