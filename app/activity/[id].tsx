import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Play, CircleCheck as CheckCircle, Code } from 'lucide-react-native';
import { useAppContext } from '../../contexts/AppContext';
import { mockTopics } from '../../data/mockData';

export default function ActivityPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { updateProgress, addBadge } = useAppContext();
  
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [showSolution, setShowSolution] = useState(false);

  const topic = mockTopics.find(t => t.id === id);
  const activity = topic?.activity;

  React.useEffect(() => {
    if (activity?.starterCode) {
      setCode(activity.starterCode);
    }
  }, [activity]);

  const handleRunCode = () => {
    // Simulate code execution
    if (code.includes('a[i] * b[i]')) {
      setOutput('Dot product: 10\nGreat job! 🎉');
      updateProgress(75);
      addBadge('Code Ninja');
    } else {
      setOutput('Error: Check your implementation\nTip: Remember to multiply corresponding elements!');
    }
  };

  const handleShowSolution = () => {
    setShowSolution(true);
    if (activity?.solution) {
      setCode(activity.solution);
    }
  };

  const handleComplete = () => {
    updateProgress(100);
    router.back();
  };

  if (!topic || !activity) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Activity not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Practice Activity</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.instructionsCard}>
          <Code size={24} color="#10B981" />
          <Text style={styles.instructionsTitle}>Instructions</Text>
          <Text style={styles.instructionsText}>{activity.instructions}</Text>
        </View>

        <View style={styles.codeEditor}>
          <View style={styles.editorHeader}>
            <Text style={styles.editorTitle}>Code Editor</Text>
            <View style={styles.editorActions}>
              <TouchableOpacity style={styles.runButton} onPress={handleRunCode}>
                <Play size={16} color="#FFFFFF" />
                <Text style={styles.runButtonText}>Run</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <TextInput
            style={styles.codeInput}
            value={code}
            onChangeText={setCode}
            multiline
            placeholder="Write your code here..."
            placeholderTextColor="#9CA3AF"
            textAlignVertical="top"
          />
        </View>

        {output && (
          <View style={styles.outputContainer}>
            <Text style={styles.outputTitle}>Output</Text>
            <View style={styles.outputContent}>
              <Text style={styles.outputText}>{output}</Text>
            </View>
          </View>
        )}

        <View style={styles.actionButtons}>
          {!showSolution && (
            <TouchableOpacity style={styles.hintButton} onPress={handleShowSolution}>
              <Text style={styles.hintButtonText}>Show Solution</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
            <CheckCircle size={20} color="#FFFFFF" />
            <Text style={styles.completeButtonText}>Mark Complete</Text>
          </TouchableOpacity>
        </View>

        {showSolution && (
          <View style={styles.solutionCard}>
            <Text style={styles.solutionTitle}>💡 Solution Explanation</Text>
            <Text style={styles.solutionText}>
              The dot product is calculated by multiplying corresponding elements and summing the results. 
              For vectors [3, 4] and [2, 1]: (3 × 2) + (4 × 1) = 6 + 4 = 10
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
  instructionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  codeEditor: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  editorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  editorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  editorActions: {
    flexDirection: 'row',
    gap: 8,
  },
  runButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  runButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  codeInput: {
    padding: 16,
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#1F2937',
    minHeight: 200,
  },
  outputContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  outputTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
    padding: 16,
    paddingBottom: 8,
  },
  outputContent: {
    padding: 16,
    paddingTop: 0,
  },
  outputText: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  actionButtons: {
    gap: 12,
    marginBottom: 20,
  },
  hintButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  hintButtonText: {
    color: '#F59E0B',
    fontSize: 16,
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  solutionCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  solutionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 12,
  },
  solutionText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
});