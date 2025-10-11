import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Send, Bot, User } from 'lucide-react-native';
import { useAppContext } from '../../contexts/AppContext';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const sarcasticQuestions = [
  "Oh, so you think you understand vectors now? Tell me, what happens when you add two vectors that are pointing in completely opposite directions? Don't overthink it... or do, I'm not your math teacher.",
  "Fascinating! Now explain to me why the dot product of two perpendicular vectors is zero. And please, try to sound like you actually know what you're talking about.",
  "Here's a brain teaser for you: If vector A has magnitude 5 and vector B has magnitude 3, what's the maximum possible magnitude of their sum? Bonus points if you don't just guess randomly.",
  "Let's see if you were paying attention. What's the geometric interpretation of the cross product? And no, 'it makes things perpendicular' isn't a complete answer.",
  "Final question, because I'm getting tired of this conversation: Give me a real-world example where vector operations are actually useful. And 'homework problems' doesn't count."
];

const sarcasticResponses = [
  "Well, well, well... that's actually not terrible. I'm mildly impressed.",
  "Hmm, you're getting warmer. Like a frozen pizza that's been in the oven for 30 seconds.",
  "That's... surprisingly decent. Did you actually study or just get lucky?",
  "Not bad! You might actually survive a real math class. Might.",
  "Okay, I'll admit it. That was a solid answer. Don't let it go to your head though."
];

export default function SarcasticQuestionsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { updateProgress, addBadge } = useAppContext();
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Alright, let's see if you actually learned anything from that topic. I've got some questions for you, and I expect real answers, not just random guesses. Ready?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: currentInput.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');

    // Add AI response after a short delay
    setTimeout(() => {
      const responseText = sarcasticResponses[Math.floor(Math.random() * sarcasticResponses.length)];
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
            text: sarcasticQuestions[currentQuestionIndex + 1],
            isUser: false,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, nextQuestion]);
          setCurrentQuestionIndex(prev => prev + 1);
        } else {
          // Complete the session
          const completionMessage: ChatMessage = {
            id: (Date.now() + 2).toString(),
            text: "Well, that wasn't completely awful. You've survived my sarcastic interrogation. Congratulations, I guess? 🎉",
            isUser: false,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, completionMessage]);
          setIsCompleted(true);
          updateProgress(100);
          addBadge('Sarcasm Survivor');
        }
      }, 1000);
    }, 1500);
  };

  const handleComplete = () => {
    router.back();
  };

  React.useEffect(() => {
    // Add first question after initial greeting
    const timer = setTimeout(() => {
      if (messages.length === 1) {
        const firstQuestion: ChatMessage = {
          id: '2',
          text: sarcasticQuestions[0],
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, firstQuestion]);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

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
              style={[styles.sendButton, !currentInput.trim() && styles.disabledButton]} 
              onPress={handleSendMessage}
              disabled={!currentInput.trim()}
            >
              <Send size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.completionContainer}>
            <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
              <Text style={styles.completeButtonText}>Continue Learning</Text>
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
});