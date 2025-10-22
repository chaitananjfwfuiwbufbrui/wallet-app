import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, RotateCcw, CheckCircle, Clock } from 'lucide-react-native';
import { useAppContext } from '../../contexts/AppContext';
import { apiService } from '../../services/api';

interface Flashcard {
  front: string;
  back: string;
}

export default function FlashcardsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { incrementStreak, updateProgress } = useAppContext();
  
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completedCards, setCompletedCards] = useState<number[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId] = useState(id); // Using topic id as user id for now

  useEffect(() => {
    fetchFlashcards();
  }, [id]);

  const fetchFlashcards = async () => {
    try {
      setLoading(true);
      const data = await apiService.getFlashcards(id as string);
      if (data && data.flashcards && data.flashcards.length > 0) {
        setFlashcards(data.flashcards);
        setError(null);
      } else {
        setError('No flashcards available for this topic');
      }
    } catch (err) {
      console.error('Error fetching flashcards:', err);
      setError('Failed to load flashcards');
    } finally {
      setLoading(false);
    }
  };

  const currentFlashcard = flashcards[currentCard];

  const handleCardFlip = () => {
    setShowAnswer(!showAnswer);
  };

  const handleNext = async (difficulty: 'easy' | 'medium' | 'hard') => {
    if (!completedCards.includes(currentCard)) {
      setCompletedCards(prev => [...prev, currentCard]);
      updateProgress(20);
    }

    if (currentCard < flashcards.length - 1) {
      setCurrentCard(currentCard + 1);
      setShowAnswer(false);
    } else {
      // Mark topic as complete with quality rating
      const qualityMap = { easy: 5, medium: 3, hard: 1 };
      try {
        await apiService.markTopicComplete(userId as string, id as string, qualityMap[difficulty]);
      } catch (err) {
        console.error('Error marking topic complete:', err);
      }
      incrementStreak();
      router.back();
    }
  };

  const handlePrevious = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setShowAnswer(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading flashcards...</Text>
      </SafeAreaView>
    );
  }

  if (error || flashcards.length === 0) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error || 'No flashcards available'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchFlashcards}>
          <RotateCcw size={20} color="#3B82F6" />
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButtonAlt} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Flashcards</Text>
      </View>

      <View style={styles.progressInfo}>
        <Text style={styles.progressText}>
          Card {currentCard + 1} of {flashcards.length}
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentCard + 1) / flashcards.length) * 100}%` }
            ]} 
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.flashcard} onPress={handleCardFlip}>
          <View style={styles.cardContent}>
            {!showAnswer ? (
              <View style={styles.questionSide}>
                <Text style={styles.cardLabel}>Question</Text>
                <Text style={styles.questionText}>{currentFlashcard.front}</Text>
                <View style={styles.flipHint}>
                  <Text style={styles.flipText}>Tap to reveal answer</Text>
                  <RotateCcw size={16} color="#6B7280" />
                </View>
              </View>
            ) : (
              <View style={styles.answerSide}>
                <Text style={styles.cardLabel}>Answer</Text>
                <Text style={styles.answerText}>{currentFlashcard.back}</Text>
                
                <View style={styles.difficultyButtons}>
                  <TouchableOpacity 
                    style={[styles.difficultyButton, styles.easyButton]}
                    onPress={() => handleNext('easy')}
                  >
                    <CheckCircle size={16} color="#10B981" />
                    <Text style={styles.easyButtonText}>Easy</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.difficultyButton, styles.mediumButton]}
                    onPress={() => handleNext('medium')}
                  >
                    <Clock size={16} color="#F59E0B" />
                    <Text style={styles.mediumButtonText}>Medium</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.difficultyButton, styles.hardButton]}
                    onPress={() => handleNext('hard')}
                  >
                    <Text style={styles.hardButtonText}>Hard</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.navigationButtons}>
          <TouchableOpacity 
            style={[styles.navButton, currentCard === 0 && styles.disabledButton]}
            onPress={handlePrevious}
            disabled={currentCard === 0}
          >
            <Text style={[styles.navButtonText, currentCard === 0 && styles.disabledText]}>
              Previous
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => handleNext('medium')}
          >
            <Text style={styles.navButtonText}>
              {currentCard === flashcards.length - 1 ? 'Complete' : 'Skip'}
            </Text>
          </TouchableOpacity>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  progressInfo: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
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
  flashcard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    minHeight: 300,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  cardContent: {
    flex: 1,
  },
  questionSide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  answerSide: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
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
  answerText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 32,
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
  difficultyButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  difficultyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 6,
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
  easyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  mediumButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
  },
  hardButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 40,
  },
  navButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  disabledButton: {
    backgroundColor: '#F9FAFB',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  disabledText: {
    color: '#9CA3AF',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4B5563',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  backButtonAlt: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});