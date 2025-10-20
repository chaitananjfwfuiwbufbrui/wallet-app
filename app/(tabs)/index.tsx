import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Play, Plus } from 'lucide-react-native';
import { ApiSubjectCard } from '../../components/ApiSubjectCard';
import { SearchBar } from '../../components/SearchBar';
import { ProgressSummary } from '../../components/ProgressSummary';
import { CreateSubjectModal } from '../../components/CreateSubjectModal';
import { useAppContext } from '../../contexts/AppContext';
import { useSubjects } from '../../hooks/useApi';
import { ApiSubject } from '../../services/api';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { userProgress, setCurrentSubject, lastViewedTopic } = useAppContext();
  const { subjects, loading, error } = useSubjects();
  const router = useRouter();

  const filteredSubjects = subjects.filter(subject =>
    subject.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubjectPress = (subjectId: string) => {
    setCurrentSubject(subjectId);
    router.push(`/subject/${subjectId}`);
  };

  const handleContinueLearning = () => {
    if (lastViewedTopic) {
      router.push(`/topic/${lastViewedTopic}`);
    }
  };

  const handleCreateSubject = () => {
    setShowCreateModal(false);
    window.location.reload();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading subjects...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.greeting}>Welcome back! 👋</Text>
            <Text style={styles.subtitle}>Ready to continue your learning journey?</Text>
          </View>

          <ProgressSummary progress={userProgress} />

          {lastViewedTopic && (
            <TouchableOpacity style={styles.continueButton} onPress={handleContinueLearning}>
              <Play size={20} color="#FFFFFF" />
              <Text style={styles.continueText}>Continue Learning</Text>
            </TouchableOpacity>
          )}

          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Subjects</Text>
            <Text style={styles.sectionCount}>{filteredSubjects.length} subjects</Text>
          </View>

          {filteredSubjects.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No subjects yet</Text>
              <Text style={styles.emptyStateText}>
                Create your first subject to start learning
              </Text>
            </View>
          ) : (
            filteredSubjects.map((subject) => (
              <ApiSubjectCard
                key={subject.id}
                subject={subject}
                onPress={() => handleSubjectPress(subject.id)}
              />
            ))
          )}
        </View>
      </ScrollView>
      
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => setShowCreateModal(true)}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <CreateSubjectModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateSubject={handleCreateSubject}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  continueButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  sectionCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});