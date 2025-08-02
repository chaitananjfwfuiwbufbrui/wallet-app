import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Play } from 'lucide-react-native';
import { SubjectCard } from '../../components/SubjectCard';
import { SearchBar } from '../../components/SearchBar';
import { ProgressSummary } from '../../components/ProgressSummary';
import { useAppContext } from '../../contexts/AppContext';
import { mockSubjects } from '../../data/mockData';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { userProgress, setCurrentSubject, lastViewedTopic } = useAppContext();
  const router = useRouter();

  const filteredSubjects = mockSubjects.filter(subject =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase())
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

          {filteredSubjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onPress={() => handleSubjectPress(subject.id)}
            />
          ))}
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
});