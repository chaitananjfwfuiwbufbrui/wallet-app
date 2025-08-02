import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, RefreshCw, Trophy } from 'lucide-react-native';
import { useAppContext } from '../../contexts/AppContext';
import { mockTopics } from '../../data/mockData';

export default function QuizPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { updateProgress, addBadge } = useAppContext();
  
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const topic = mockTopics.find(t => t.id === id);
  const quiz = topic?.quiz;

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null || !quiz) return;
    
    const isCorrect = selectedAnswer === quiz.correctAnswer;
    const newScore = isCorrect ? 8 : 3;
    setScore(newScore);
    setShowResults(true);
    
    updateProgress(isCorrect ? 50 : 20);
    if (isCorrect && newScore >= 7) {
      addBadge('Quiz Master');
    }
  };

  const handleRetry = () => {
    setSelectedAnswer(null);
    setShowResults(false);
    setScore(0);
  };

  const handleContinue = () => {
    router.push(`/activity/${id}`);
  };

  if (!topic || !quiz) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Quiz not found</Text>
      </SafeAreaView>
    );
  }

  const getFeedback = () => {
    if (selectedAnswer === quiz.correctAnswer) {
      return quiz.sarcasticFeedback.correct;
    } else {
      return quiz.sarcasticFeedback.incorrect[0];
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sarcastic Quiz</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!showResults ? (
          <View style={styles.quizContainer}>
            <View style={styles.questionCard}>
              <Text style={styles.questionTitle}>Question</Text>
              <Text style={styles.questionText}>{quiz.question}</Text>
            </View>

            <View style={styles.optionsContainer}>
              {quiz.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    selectedAnswer === index && styles.selectedOption
                  ]}
                  onPress={() => handleAnswerSelect(index)}
                >
                  <View style={styles.optionNumber}>
                    <Text style={styles.optionNumberText}>{String.fromCharCode(65 + index)}</Text>
                  </View>
                  <Text style={[
                    styles.optionText,
                    selectedAnswer === index && styles.selectedOptionText
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                selectedAnswer === null && styles.disabledButton
              ]}
              onPress={handleSubmit}
              disabled={selectedAnswer === null}
            >
              <Text style={styles.submitButtonText}>Submit Answer</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.resultsContainer}>
            <View style={styles.scoreCard}>
              <Trophy size={48} color="#F59E0B" />
              <Text style={styles.scoreTitle}>Your Score</Text>
              <Text style={styles.scoreNumber}>{score}/10</Text>
              
              <View style={[
                styles.scoreBadge,
                score >= 7 ? styles.goodScore : styles.poorScore
              ]}>
                <Text style={styles.scoreBadgeText}>
                  {score >= 7 ? 'Well Done!' : 'Keep Trying!'}
                </Text>
              </View>
            </View>

            <View style={styles.feedbackCard}>
              <Text style={styles.feedbackTitle}>Sarcastic Feedback</Text>
              <Text style={styles.feedbackText}>{getFeedback()}</Text>
            </View>

            <View style={styles.resultActions}>
              <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
                <RefreshCw size={20} color="#8B5CF6" />
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                <Text style={styles.continueButtonText}>Continue to Activity</Text>
              </TouchableOpacity>
            </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  quizContainer: {
    paddingBottom: 40,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B5CF6',
    marginBottom: 16,
    textAlign: 'center',
  },
  questionText: {
    fontSize: 18,
    lineHeight: 26,
    color: '#1F2937',
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 32,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedOption: {
    borderColor: '#3B82F6',
    backgroundColor: '#EEF2FF',
  },
  optionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 22,
  },
  selectedOptionText: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    paddingBottom: 40,
  },
  scoreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  scoreBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  goodScore: {
    backgroundColor: '#DCFCE7',
  },
  poorScore: {
    backgroundColor: '#FEE2E2',
  },
  scoreBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  feedbackCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B5CF6',
    marginBottom: 12,
  },
  feedbackText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
    fontStyle: 'italic',
  },
  resultActions: {
    gap: 12,
  },
  retryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  retryButtonText: {
    color: '#8B5CF6',
    fontSize: 16,
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});