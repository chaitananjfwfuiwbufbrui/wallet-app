import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Filter } from 'lucide-react-native';
import { ApiLessonCard } from '../../components/ApiLessonCard';
import { useAppContext } from '../../contexts/AppContext';
import { useSubjects, useLessons } from '../../hooks/useApi';

export default function SubjectPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { setCurrentLesson } = useAppContext();
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'completed' | 'new'>('all');

  const { subjects } = useSubjects();
  const { lessons, loading, error } = useLessons(id || null);
  
  const subject = subjects.find(s => s.id === id);

  const filteredLessons = lessons.filter(lesson => {
    // For now, all lessons are considered "new" since we don't have completion data
    if (filter === 'completed') return false;
    if (filter === 'new') return true;
    return true;
  });

  const handleLessonPress = (lessonId: string) => {
    setCurrentLesson(lessonId);
    router.push(`/lesson/${lessonId}`);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading lessons...</Text>
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

  if (!subject) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Subject not found</Text>
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
          <Text style={styles.breadcrumbCurrent}>{subject.title}</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.subjectInfo}>
          <Text style={styles.subjectIcon}>📚</Text>
          <Text style={styles.subjectTitle}>{subject.title}</Text>
          <Text style={styles.subjectProgress}>
            0 of {lessons.length} lessons completed
          </Text>
        </View>

        <View style={styles.filterTabs}>
          {(['all', 'new', 'completed'] as const).map((filterOption) => (
            <TouchableOpacity
              key={filterOption}
              style={[
                styles.filterTab,
                filter === filterOption && styles.activeFilterTab
              ]}
              onPress={() => setFilter(filterOption)}
            >
              <Text style={[
                styles.filterTabText,
                filter === filterOption && styles.activeFilterTabText
              ]}>
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.lessonsContainer}>
          {filteredLessons.map((lesson) => (
            <ApiLessonCard
              key={lesson.id}
              lesson={lesson}
              onPress={() => handleLessonPress(lesson.id)}
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
  filterButton: {
    marginLeft: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  subjectInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  subjectIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  subjectTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  subjectProgress: {
    fontSize: 16,
    color: '#6B7280',
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeFilterTab: {
    backgroundColor: '#3B82F6',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeFilterTabText: {
    color: '#FFFFFF',
  },
  lessonsContainer: {
    paddingBottom: 40,
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