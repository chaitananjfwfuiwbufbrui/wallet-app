import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RotateCcw, CircleCheck as CheckCircle, Clock, ArrowRight } from 'lucide-react-native';
import { useAppContext } from '../../contexts/AppContext';
import { mockRecallItems } from '../../data/mockData';

export default function RecallPage() {
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const { incrementStreak, updateProgress } = useAppContext();

  const todayItems = mockRecallItems.filter(item => 
    item.dueDate.toDateString() === new Date().toDateString()
  );

  const completedToday = todayItems.length - 3; // Mock completed count

  const handleCardFlip = () => {
    setShowAnswer(!showAnswer);
  };

  const handleNext = (difficulty: 'easy' | 'medium' | 'hard') => {
    updateProgress(10);
    if (currentCard < todayItems.length - 1) {
      setCurrentCard(currentCard + 1);
      setShowAnswer(false);
    } else {
      incrementStreak();
    }
  };

  if (todayItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <CheckCircle size={64} color="#10B981" />
          <Text style={styles.emptyTitle}>All caught up! 🎉</Text>
          <Text style={styles.emptySubtitle}>
            No reviews scheduled for today. Great job staying on top of your learning!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentItem = todayItems[currentCard];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Spaced Repetition</Text>
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            {completedToday} of {todayItems.length} completed today
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(completedToday / todayItems.length) * 100}%` }
              ]} 
            />
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.cardCounter}>
          <Text style={styles.counterText}>
            Card {currentCard + 1} of {todayItems.length}
          </Text>
        </View>

        <TouchableOpacity style={styles.flashcard} onPress={handleCardFlip}>
          <View style={styles.cardHeader}>
            <Text style={styles.subjectTag}>{currentItem.subjectName}</Text>
            <View style={styles.difficultyIndicator}>
              {Array.from({ length: 5 }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.difficultyDot,
                    i < currentItem.difficulty && styles.difficultyDotActive
                  ]}
                />
              ))}
            </View>
          </View>

          <View style={styles.cardContent}>
            {!showAnswer ? (
              <View style={styles.questionSide}>
                <Text style={styles.cardTitle}>Review Topic</Text>
                <Text style={styles.questionText}>{currentItem.topicTitle}</Text>
                <View style={styles.flipHint}>
                  <Text style={styles.flipText}>Tap to reveal answer</Text>
                  <RotateCcw size={16} color="#6B7280" />
                </View>
              </View>
            ) : (
              <View style={styles.answerSide}>
                <Text style={styles.cardTitle}>Key Concepts</Text>
                <Text style={styles.answerText}>
                  Vector operations include addition, scalar multiplication, dot product, and cross product. 
                  Each operation has specific geometric and algebraic interpretations that are fundamental 
                  to linear algebra and physics applications.
                </Text>
                
                <View style={styles.difficultyButtons}>
                  <TouchableOpacity 
                    style={[styles.difficultyButton, styles.easyButton]}
                    onPress={() => handleNext('easy')}
                  >
                    <Text style={styles.difficultyButtonText}>Easy</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.difficultyButton, styles.mediumButton]}
                    onPress={() => handleNext('medium')}
                  >
                    <Text style={styles.difficultyButtonText}>Medium</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.difficultyButton, styles.hardButton]}
                    onPress={() => handleNext('hard')}
                  >
                    <Text style={styles.difficultyButtonText}>Hard</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {currentItem.lastReviewed && (
          <View style={styles.lastReviewed}>
            <Clock size={14} color="#6B7280" />
            <Text style={styles.lastReviewedText}>
              Last reviewed {Math.floor((Date.now() - currentItem.lastReviewed.getTime()) / (1000 * 60 * 60 * 24))} days ago
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  progressInfo: {
    gap: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cardCounter: {
    alignItems: 'center',
    marginBottom: 20,
  },
  counterText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  flashcard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    minHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  subjectTag: {
    backgroundColor: '#EEF2FF',
    color: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    fontSize: 12,
    fontWeight: '600',
  },
  difficultyIndicator: {
    flexDirection: 'row',
    gap: 4,
  },
  difficultyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
  },
  difficultyDotActive: {
    backgroundColor: '#F59E0B',
  },
  cardContent: {
    flex: 1,
  },
  questionSide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 16,
    textAlign: 'center',
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 28,
  },
  flipHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flipText: {
    fontSize: 14,
    color: '#6B7280',
  },
  answerSide: {
    flex: 1,
  },
  answerText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 32,
  },
  difficultyButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  difficultyButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  easyButton: {
    backgroundColor: '#DCFCE7',
  },
  mediumButton: {
    backgroundColor: '#FEF3C7',
  },
  hardButton: {
    backgroundColor: '#FEE2E2',
  },
  difficultyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  lastReviewed: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 20,
    marginBottom: 40,
  },
  lastReviewedText: {
    fontSize: 14,
    color: '#6B7280',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});