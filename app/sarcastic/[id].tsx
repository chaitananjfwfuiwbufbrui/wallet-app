import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Send, Bot, User } from 'lucide-react-native';
import { useAppContext } from '../../contexts/AppContext';
import { apiService } from '../../services/api';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

type SarcasticQuestion = {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
  topic_id: string;
  sarcastic_mode: boolean;
};

export default function SarcasticQuestionsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { updateProgress, addBadge } = useAppContext();
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Alright, let's see if you actually learned anything from that topic. I've got some sarcastic questions for you, and I expect real answers, not just random guesses. Ready?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [sarcasticQuestions, setSarcasticQuestions] = useState<SarcasticQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userId] = useState(id);

  const handleSendMessage = async () => {
    if (!currentInput.trim() || submitting) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: currentInput.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const userAnswer = currentInput.trim();
    setCurrentInput('');
    setSubmitting(true);

    try {
      // Submit answer to backend
      const currentQuestion = sarcasticQuestions[currentQuestionIndex];
      const result = await apiService.evaluateSarcasticAnswer(
        userId as string,
        currentQuestion.id,
        userAnswer
      );
      
      // Add AI response after a short delay
      setTimeout(() => {
        let responseText = '';
        if (result.evaluation_score >= 7) {
          responseText = `${result.feedback} Score: ${result.evaluation_score}/10 ✅`;
        } else {
          responseText = `${result.feedback} Score: ${result.evaluation_score}/10 ❌\n\n${result.explanation || ''}`;
        }
        
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: responseText,
          isUser: false,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiResponse]);

        // Add next question or complete
        setTimeout(() => {
          if (currentQuestionIndex < sarcasticQuestions.length - 1) {
            const nextQuestion: ChatMessage = {
              id: (Date.now() + 2).toString(),
              text: sarcasticQuestions[currentQuestionIndex + 1].question,
              isUser: false,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, nextQuestion]);
            setCurrentQuestionIndex(prev => prev + 1);
          } else {
            // Complete the session
            const completionMessage: ChatMessage = {
              id: (Date.now() + 2).toString(),
              text: "Well, that wasn't completely awful. You've survived my sarcastic interrogation. Now, if you think you're done with this topic, go ahead and mark it as complete! 🎉",
              isUser: false,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, completionMessage]);
            setIsCompleted(true);
            updateProgress(100);
            addBadge('Sarcasm Survivor');
          }
          setSubmitting(false);
        }, 1000);
      }, 1500);
    } catch (err) {
      console.error('Error submitting answer:', err);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        text: 'Oops! Something went wrong. Try again.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setSubmitting(false);
    }
  };

  const handleMarkComplete = async () => {
    try {
      await apiService.markTopicComplete(userId as string, id as string, 4);
      
      // Show success message
      const successMessage: ChatMessage = {
        id: Date.now().toString(),
        text: '✅ Topic marked as complete! You\'ll see this again based on spaced repetition.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, successMessage]);
      
      // Navigate back after a delay
      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (err) {
      console.error('Error marking complete:', err);
    }
  };

  const handleComplete = () => {
    router.back();
  };

  useEffect(() => {
    const fetchSarcasticQuestions = async () => {
      try {
        const data = await apiService.getQuizForTopic(id as string, userId as string, true);
        setSarcasticQuestions(data);
        
        // Add first question after initial greeting
        setTimeout(() => {
          if (data.length > 0) {
            const firstQuestion: ChatMessage = {
              id: '2',
              text: data[0].question,
              isUser: false,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, firstQuestion]);
          }
        }, 2000);
      } catch (err) {
        console.error('Error fetching sarcastic questions:', err);
        const errorMessage: ChatMessage = {
          id: '2',
          text: 'Sorry, I couldn\'t load the sarcastic questions. Please try again later.',
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setLoading(false);
      }
    };

    fetchSarcasticQuestions();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Loading sarcastic questions...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sarcastic Questions</Text>
      </View>

      <KeyboardAvoidingView 
        style={styles.chatContainer} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.messagesContainer} 
          showsVerticalScrollIndicator={false}
          ref={(ref) => {
            if (ref) {
              ref.scrollToEnd({ animated: true });
            }
          }}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.isUser ? styles.userMessage : styles.aiMessage
              ]}
            >
              <View style={styles.messageHeader}>
                {message.isUser ? (
                  <User size={16} color="#3B82F6" />
                ) : (
                  <Bot size={16} color="#F59E0B" />
                )}
                <Text style={styles.messageSender}>
                  {message.isUser ? 'You' : 'Sarcastic AI'}
                </Text>
              </View>
              <Text style={[
                styles.messageText,
                message.isUser ? styles.userMessageText : styles.aiMessageText
              ]}>
                {message.text}
              </Text>
            </View>
          ))}
        </ScrollView>

        {!isCompleted ? (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={currentInput}
              onChangeText={setCurrentInput}
              placeholder="Type your answer..."
              placeholderTextColor="#9CA3AF"
              multiline
              maxLength={500}
            />
            <TouchableOpacity 
              style={[styles.sendButton, (!currentInput.trim() || submitting) && styles.disabledButton]} 
              onPress={handleSendMessage}
              disabled={!currentInput.trim() || submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Send size={20} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.completionContainer}>
            <TouchableOpacity style={styles.completeButton} onPress={handleMarkComplete}>
              <Text style={styles.completeButtonText}>Mark Topic as Complete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.backButton2} onPress={handleComplete}>
              <Text style={styles.backButtonText}>Back to Topics</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4B5563',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    padding: 20,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  aiMessage: {
    alignSelf: 'flex-start',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  messageSender: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    padding: 12,
    borderRadius: 12,
  },
  userMessageText: {
    backgroundColor: '#3B82F6',
    color: '#FFFFFF',
  },
  aiMessageText: {
    backgroundColor: '#FFFFFF',
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 48,
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  completionContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  completeButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton2: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  backButtonText: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '600',
  },
});