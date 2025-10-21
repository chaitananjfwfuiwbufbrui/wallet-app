import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, RefreshCw, Trophy } from 'lucide-react-native';
import { useAppContext } from '../../contexts/AppContext';

type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
  topic_id: string;
  sarcastic_mode: boolean;
};

export default function QuizPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { updateProgress, addBadge } = useAppContext();
  
  const [userAnswers, setUserAnswers] = useState<{[key: number]: string}>({});
  const [showResults, setShowResults] = useState(false);
  const [quizData, setQuizData] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [batchResult, setBatchResult] = useState<any>(null);
  const [userId] = useState(id); // Using topic id as user id for now

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/quiz/topic/${id}?user_id=${id}&sarcastic=false`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          }
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch quiz data');
        }
        
        const data = await response.json();
        setQuizData(data);
      } catch (err) {
        console.error('Error fetching quiz:', err);
        setError('Failed to load quiz. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const currentQuiz = quizData[currentQuestion];

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResults) return;
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion]: currentQuiz.options[answerIndex]
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmitAll = async () => {
    // Check if all questions are answered
    if (Object.keys(userAnswers).length !== quizData.length) {
      setError('Please answer all questions before submitting.');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Prepare batch submission
      const answers = quizData.map((quiz, index) => ({
        quiz_id: quiz.id,
        user_answer: userAnswers[index]
      }));

      const response = await fetch('http://localhost:8000/quiz/submit-batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          topic_id: id,
          answers: answers
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }
      
      const result = await response.json();
      setBatchResult(result);
      setShowResults(true);
      
      updateProgress(result.score_percentage);
      if (result.score_percentage >= 70) {
        addBadge('Quiz Master');
      }
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError('Failed to submit quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isAnswered = (questionIndex: number) => {
    return userAnswers.hasOwnProperty(questionIndex);
  };

  const getSelectedIndex = (questionIndex: number) => {
    const answer = userAnswers[questionIndex];
    if (!answer) return null;
    return quizData[questionIndex]?.options.indexOf(answer) ?? null;
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Loading quiz...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => window.location.reload()}>
          <RefreshCw size={20} color="#8B5CF6" />
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!quizData.length) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text>No quiz questions available</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            Question {currentQuestion + 1} of {quizData.length}
          </Text>
          <Text style={styles.answeredText}>
            Answered: {Object.keys(userAnswers).length}/{quizData.length}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.quizContainer}>
          <View style={styles.questionCard}>
            <Text style={styles.questionText}>{currentQuiz.question}</Text>
          </View>

          <View style={styles.optionsContainer}>
            {currentQuiz.options.map((option, index) => {
              const selectedIndex = getSelectedIndex(currentQuestion);
              const isSelected = selectedIndex === index;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    isSelected && styles.selectedOption,
                  ]}
                  onPress={() => handleAnswerSelect(index)}
                  disabled={showResults}
                >
                  <View style={[
                    styles.optionNumber,
                    isSelected && styles.selectedOptionNumber,
                  ]}>
                    <Text style={[
                      styles.optionNumberText,
                      isSelected && styles.selectedOptionNumberText,
                    ]}>
                      {String.fromCharCode(65 + index)}
                    </Text>
                  </View>
                  <Text style={[
                    styles.optionText,
                    isSelected && styles.selectedOptionText,
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.navigationButtons}>
            <TouchableOpacity
              style={[
                styles.navButton,
                currentQuestion === 0 && styles.disabledButton
              ]}
              onPress={handlePreviousQuestion}
              disabled={currentQuestion === 0}
            >
              <Text style={styles.navButtonText}>Previous</Text>
            </TouchableOpacity>
            
            {currentQuestion < quizData.length - 1 ? (
              <TouchableOpacity
                style={styles.navButton}
                onPress={handleNextQuestion}
              >
                <Text style={styles.navButtonText}>Next</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (Object.keys(userAnswers).length !== quizData.length || submitting) && styles.disabledButton
                ]}
                onPress={handleSubmitAll}
                disabled={Object.keys(userAnswers).length !== quizData.length || submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitButtonText}>Submit All</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Results Modal */}
      <Modal
        visible={showResults}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowResults(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Trophy size={48} color="#F59E0B" />
              <Text style={styles.modalTitle}>Quiz Complete!</Text>
            </View>
            
            {batchResult && (
              <View style={styles.scoreDetails}>
                <Text style={styles.scoreLabel}>Your Score</Text>
                <Text style={styles.scoreValue}>
                  {batchResult.correct_answers}/{batchResult.total_questions}
                </Text>
                <Text style={styles.percentageText}>
                  {batchResult.score_percentage}%
                </Text>
                
                <View style={styles.divider} />
                
                <Text style={styles.resultMessage}>
                  {batchResult.score_percentage >= 80
                    ? 'Excellent work! 🎉'
                    : batchResult.score_percentage >= 60
                    ? 'Good job! Keep practicing! 👍'
                    : 'Keep learning! You can do better! 💪'}
                </Text>
              </View>
            )}
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.sarcasticButton}
                onPress={() => {
                  setShowResults(false);
                  router.push(`/sarcastic/${id}`);
                }}
              >
                <Text style={styles.sarcasticButtonText}>Try Sarcastic Questions</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.backToTopicsButton}
                onPress={() => {
                  setShowResults(false);
                  router.back();
                }}
              >
                <Text style={styles.backToTopicsButtonText}>Back to Topics</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
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
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F59E0B',
    marginLeft: 4,
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
  questionText: {
    fontSize: 18,
    color: '#1F2937',
    lineHeight: 26,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedOption: {
    borderColor: '#8B5CF6',
    backgroundColor: '#F5F3FF',
  },
  correctOption: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  incorrectOption: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
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
  correctOptionNumber: {
    backgroundColor: '#10B981',
  },
  incorrectOptionNumber: {
    backgroundColor: '#EF4444',
  },
  optionNumberText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
  },
  correctOptionText: {
    color: '#065F46',
  },
  incorrectOptionText: {
    color: '#991B1B',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 24,
  },
  selectedOptionText: {
    color: '#7C3AED',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop: 16,
  },
  feedbackCard: {
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
  feedbackTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  feedbackText: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    textAlign: 'center',
  },
  resultActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  retryButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  continueButton: {
    backgroundColor: '#8B5CF6',
  },
  retryButtonText: {
    color: '#4B5563',
    marginLeft: 8,
    fontWeight: '600',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  answeredText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  selectedOptionNumber: {
    backgroundColor: '#8B5CF6',
  },
  selectedOptionNumberText: {
    color: '#FFFFFF',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
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
  navButtonText: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
  },
  scoreDetails: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1F2937',
  },
  percentageText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#8B5CF6',
    marginTop: 8,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 20,
  },
  resultMessage: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 24,
  },
  modalActions: {
    gap: 12,
  },
  sarcasticButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  sarcasticButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backToTopicsButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  backToTopicsButtonText: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '600',
  },
});
