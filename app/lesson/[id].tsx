import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Play } from 'lucide-react-native';
import { ApiTopicCard } from '../../components/ApiTopicCard';
import { useSubjects, useLessons, useTopics } from '../../hooks/useApi';

export default function LessonPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { subjects } = useSubjects();
  const { lessons } = useLessons(null); // We'll need to get all lessons to find the current one
  const { topics, loading, error } = useTopics(id || null);
  
  // Find the lesson and subject
  const lesson = lessons.find(l => l.id === id);
  const subject = lesson ? subjects.find(s => s.id === lesson.subject_id) : null;

  const handleTopicPress = (topicId: string) => {
    router.push(`/topic/${topicId}`);
  };

  const handleStartFromBeginning = () => {
    if (topics.length > 0) {
      router.push(`/topic/${topics[0].id}`);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading topics...</Text>
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

  if (!lesson || !subject) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Lesson not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.breadcrumbs}>
          <Text style={styles.breadcrumbText}>Home</Text>
          <Text style={styles.breadcrumbSeparator}> > </Text>
          <Text style={styles.breadcrumbText}>{subject.title}</Text>
          <Text style={styles.breadcrumbSeparator}> > </Text>
          <Text style={styles.breadcrumbCurrent}>{lesson.title}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.lessonInfo}>
          <Text style={styles.lessonTitle}>{lesson.title}</Text>
          <Text style={styles.lessonDescription}>{lesson.description}</Text>
          
          <View style={styles.lessonMeta}>
            <Text style={styles.metaText}>{topics.length} Topics</Text>
            <Text style={styles.metaSeparator}>•</Text>
            <Text style={styles.metaText}>2-3h</Text>
            <Text style={styles.metaSeparator}>•</Text>
            <Text style={styles.metaText}>Beginner</Text>
          </View>

          <TouchableOpacity style={styles.startButton} onPress={handleStartFromBeginning}>
            <Play size={20} color="#FFFFFF" />
            <Text style={styles.startButtonText}>Start from Beginning</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.topicsSection}>
          <Text style={styles.sectionTitle}>Topics</Text>
          {topics.map((topic) => (
            <ApiTopicCard
              key={topic.id}
              topic={topic}
              onPress={() => handleTopicPress(topic.id)}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  backButton: {
    marginRight: 16,
  },
  breadcrumbs: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  breadcrumbText: {
    fontSize: 14,
    color: '#6B7280',
  },
  breadcrumbSeparator: {
    fontSize: 14,
    color: '#6B7280',
  },
  breadcrumbCurrent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  lessonInfo: {
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
  lessonTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  lessonDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 16,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  metaText: {
    fontSize: 14,
    color: '#6B7280',
  },
  metaSeparator: {
    fontSize: 14,
    color: '#6B7280',
    marginHorizontal: 8,
  },
  startButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  topicsSection: {
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
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
});