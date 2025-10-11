import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RotateCcw, CircleCheck as CheckCircle, Clock, ArrowRight, Calendar, BookOpen, Zap, HelpCircle, MessageSquare, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAppContext } from '../../contexts/AppContext';
import { mockRecallItems } from '../../data/mockData';

export default function RecallPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const { incrementStreak, updateProgress } = useAppContext();
  const router = useRouter();

  // Group items by date
  const groupedItems = mockRecallItems.reduce((groups, item) => {
    const dateKey = item.dueDate.toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(item);
    return groups;
  }, {} as Record<string, typeof mockRecallItems>);

  const sortedDates = Object.keys(groupedItems).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  const handleTopicPress = (topicId: string) => {
    setSelectedTopic(topicId);
    setShowOptionsModal(true);
  };

  const handleOptionSelect = (option: 'flashcards' | 'exercise' | 'quiz' | 'sarcastic') => {
    setShowOptionsModal(false);
    
    switch (option) {
      case 'flashcards':
        router.push(`/flashcards/${selectedTopic}`);
        break;
      case 'exercise':
        router.push(`/activity/${selectedTopic}`);
        break;
      case 'quiz':
        router.push(`/quiz/${selectedTopic}`);
        break;
      case 'sarcastic':
        router.push(`/sarcastic/${selectedTopic}`);
        break;
    }
  };

  const isOverdue = (date: Date) => {
    return date < new Date() && date.toDateString() !== new Date().toDateString();
  };

  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  if (sortedDates.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <CheckCircle size={64} color="#10B981" />
          <Text style={styles.emptyTitle}>All caught up! 🎉</Text>
          <Text style={styles.emptySubtitle}>
            No reviews scheduled. Great job staying on top of your learning!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recall Schedule</Text>
        <Text style={styles.subtitle}>Review topics to strengthen your memory</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {sortedDates.map((dateString) => {
          const date = new Date(dateString);
          const items = groupedItems[dateString];
          
          return (
            <View key={dateString} style={styles.dateSection}>
              <View style={styles.dateHeader}>
                <Calendar size={16} color="#6B7280" />
                <Text style={[
                  styles.dateTitle,
                  isOverdue(date) && styles.overdueDate,
                  isToday(date) && styles.todayDate
                ]}>
                  {formatDate(dateString)}
                </Text>
                <Text style={styles.itemCount}>{items.length} topics</Text>
              </View>
              
              {items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.topicCard,
                    isOverdue(date) && styles.overdueCard,
                    isToday(date) && styles.todayCard
                  ]}
                  onPress={() => handleTopicPress(item.topicId)}
                >
                  <View style={styles.topicInfo}>
                    <Text style={styles.topicTitle}>{item.topicTitle}</Text>
                    <Text style={styles.subjectName}>{item.subjectName}</Text>
                    
                    <View style={styles.topicMeta}>
                      <View style={styles.difficultyIndicator}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <View
                            key={i}
                            style={[
                              styles.difficultyDot,
                              i < item.difficulty && styles.difficultyDotActive
                            ]}
                          />
                        ))}
                      </View>
                      
                      {item.lastReviewed && (
                        <View style={styles.lastReviewedInfo}>
                          <Clock size={12} color="#6B7280" />
                          <Text style={styles.lastReviewedText}>
                            {Math.floor((Date.now() - item.lastReviewed.getTime()) / (1000 * 60 * 60 * 24))}d ago
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  
                  <ArrowRight size={20} color="#9CA3AF" />
                </TouchableOpacity>
              ))}
            </View>
          );
        })}
      </ScrollView>

      <Modal
        visible={showOptionsModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowOptionsModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowOptionsModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Choose Review Method</Text>
            <View style={{ width: 24 }} />
          </View>
          
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => handleOptionSelect('flashcards')}
            >
              <RotateCcw size={32} color="#3B82F6" />
              <Text style={styles.optionTitle}>Flashcards</Text>
              <Text style={styles.optionDescription}>
                Quick review with flip cards
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => handleOptionSelect('exercise')}
            >
              <BookOpen size={32} color="#10B981" />
              <Text style={styles.optionTitle}>Exercise</Text>
              <Text style={styles.optionDescription}>
                Practice with coding problems
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => handleOptionSelect('quiz')}
            >
              <HelpCircle size={32} color="#8B5CF6" />
              <Text style={styles.optionTitle}>Quiz</Text>
              <Text style={styles.optionDescription}>
                Test your knowledge
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => handleOptionSelect('sarcastic')}
            >
              <MessageSquare size={32} color="#F59E0B" />
              <Text style={styles.optionTitle}>Sarcastic Questions</Text>
              <Text style={styles.optionDescription}>
                Chat-based review with attitude
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dateSection: {
    marginBottom: 24,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  dateTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  overdueDate: {
    color: '#EF4444',
  },
  todayDate: {
    color: '#3B82F6',
  },
  itemCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  topicCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  overdueCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  todayCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  topicInfo: {
    flex: 1,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  subjectName: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  topicMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  difficultyIndicator: {
    flexDirection: 'row',
    gap: 3,
  },
  difficultyDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
  },
  difficultyDotActive: {
    backgroundColor: '#F59E0B',
  },
  lastReviewedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lastReviewedText: {
    fontSize: 12,
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  optionsContainer: {
    padding: 20,
    gap: 16,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
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