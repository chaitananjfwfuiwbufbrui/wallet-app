import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
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
  
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [quizData, setQuizData] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [totalScore, setTotalScore] = useState<any>(null);
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
    fetchTotalScore();
  }, [id]);

  const currentQuiz = quizData[currentQuestion];

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResults) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = async () => {
    if (selectedAnswer === null || !currentQuiz) return;
    
    setSubmitting(true);
    
    try {
      // Submit answer to backend
      const response = await fetch('http://localhost:8000/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quiz_id: currentQuiz.id,
          user_answer: currentQuiz.options[selectedAnswer],
          user_id: userId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit answer');
      }
      
      const result = await response.json();
      const isCorrect = result.is_correct;
      const pointsEarned = isCorrect ? 8 : 3;
      
      setScore(prev => prev + pointsEarned);
      setShowResults(true);
      setAnsweredCorrectly(isCorrect);
      
      updateProgress(isCorrect ? 50 : 20);
      if (isCorrect && pointsEarned >= 7) {
        addBadge('Quiz Master');
      }
      
      // Fetch updated score
      await fetchTotalScore();
    } catch (err) {
      console.error('Error submitting answer:', err);
      setError('Failed to submit answer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const fetchTotalScore = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/quiz/score/${userId}/${id}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      );
      
      if (response.ok) {
        const scoreData = await response.json();
        setTotalScore(scoreData);
      }
    } catch (err) {
      console.error('Error fetching score:', err);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResults(false);
      setAnsweredCorrectly(null);
    } else {
      // Quiz completed
      router.push(`/activity/${id}`);
    }
  };

  const handleRetry = () => {
    setSelectedAnswer(null);
    setShowResults(false);
    setAnsweredCorrectly(null);
  };

  const getFeedback = () => {
    if (answeredCorrectly === null) return '';
    return answeredCorrectly 
      ? 'Correct! Well done! 🎉' 
      : `Incorrect. The correct answer is: ${currentQuiz?.correct_answer}`;
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
          {totalScore && (
            <View style={styles.scoreContainer}>
              <Trophy size={16} color="#F59E0B" />
              <Text style={styles.scoreText}>
                Score: {totalScore.total_score}/{totalScore.total_questions} ({totalScore.percentage}%)
              </Text>
            </View>
          )}
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
              const isSelected = selectedAnswer === index;
              const isCorrect = option === currentQuiz.correct_answer;
              const showCorrect = showResults && isCorrect;
              const showIncorrect = showResults && isSelected && !isCorrect;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    isSelected && styles.selectedOption,
                    showCorrect && styles.correctOption,
                    showIncorrect && styles.incorrectOption,
                  ]}
                  onPress={() => handleAnswerSelect(index)}
                  disabled={showResults}
                >
                  <View style={[
                    styles.optionNumber,
                    showCorrect && styles.correctOptionNumber,
                    showIncorrect && styles.incorrectOptionNumber,
                  ]}>
                    <Text style={[
                      styles.optionNumberText,
                      showCorrect && styles.correctOptionText,
                      showIncorrect && styles.incorrectOptionText,
                    ]}>
                      {String.fromCharCode(65 + index)}
                    </Text>
                  </View>
                  <Text style={[
                    styles.optionText,
                    isSelected && styles.selectedOptionText,
                    showCorrect && styles.correctOptionText,
                    showIncorrect && styles.incorrectOptionText,
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {!showResults ? (
            <TouchableOpacity
              style={[
                styles.submitButton,
                (selectedAnswer === null || submitting) && styles.disabledButton
              ]}
              onPress={handleSubmit}
              disabled={selectedAnswer === null || submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {currentQuestion === quizData.length - 1 ? 'Finish Quiz' : 'Submit Answer'}
                </Text>
              )}
            </TouchableOpacity>
          ) : (
            <View style={styles.resultsContainer}>
              <View style={styles.feedbackCard}>
                <Text style={styles.feedbackTitle}>
                  {answeredCorrectly ? 'Correct! 🎉' : 'Incorrect'}
                </Text>
                <Text style={styles.feedbackText}>{getFeedback()}</Text>
              </View>

              <View style={styles.resultActions}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.retryButton]} 
                  onPress={handleRetry}
                >
                  <RefreshCw size={20} color="#8B5CF6" />
                  <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.continueButton]} 
                  onPress={handleNextQuestion}
                >
                  <Text style={styles.continueButtonText}>
                    {currentQuestion < quizData.length - 1 ? 'Next Question' : 'Finish'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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
});
