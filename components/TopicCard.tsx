import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, CircleCheck as CheckCircle } from 'lucide-react-native';
import { Topic } from '../types';

interface TopicCardProps {
  topic: Topic;
  onPress: () => void;
}

export function TopicCard({ topic, onPress }: TopicCardProps) {
  const isCompleted = topic.completion === 100;

  return (
    <TouchableOpacity style={[styles.card, isCompleted && styles.completedCard]} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, isCompleted && styles.completedTitle]}>
            {topic.title}
          </Text>
          <View style={styles.metadata}>
            <Clock size={14} color="#6B7280" />
            <Text style={styles.time}>{topic.estimatedTime}</Text>
          </View>
        </View>
        
        <View style={styles.statusContainer}>
          {isCompleted ? (
            <CheckCircle size={24} color="#10B981" />
          ) : (
            <View style={styles.progressCircle}>
              <Text style={styles.progressText}>{topic.completion}%</Text>
            </View>
          )}
        </View>
      </View>

      {!isCompleted && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${topic.completion}%` }
              ]} 
            />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  completedCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  completedTitle: {
    color: '#059669',
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  time: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusContainer: {
    marginLeft: 12,
  },
  progressCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#3B82F6',
  },
  progressContainer: {
    marginTop: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
});