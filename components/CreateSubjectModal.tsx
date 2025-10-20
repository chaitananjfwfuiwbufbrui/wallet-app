import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Modal, Alert, ActivityIndicator } from 'react-native';
import { X, Plus, Camera, Type, Trash2, CheckCircle, RefreshCw } from 'lucide-react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { apiService, CourseGenerationResponse } from '../services/api';

interface CreateSubjectModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateSubject: () => void;
}

const SUBJECT_COLORS = [
  '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', 
  '#EF4444', '#06B6D4', '#8B5A2B', '#EC4899'
];

const SUBJECT_ICONS = ['📚', '💻', '🔬', '🎨', '🏃‍♂️', '🌍', '🎵', '🍳'];

export function CreateSubjectModal({ visible, onClose, onCreateSubject }: CreateSubjectModalProps) {
  const [mode, setMode] = useState<'input' | 'preview'>('input');
  const [subjectTopic, setSubjectTopic] = useState('');
  const [userId] = useState('3fa85f64-5717-4562-b3fc-2c963f66afa6');
  const [loading, setLoading] = useState(false);
  const [courseData, setCourseData] = useState<CourseGenerationResponse | null>(null);

  const resetForm = () => {
    setSubjectTopic('');
    setMode('input');
    setCourseData(null);
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleGenerateCourse = async () => {
    if (!subjectTopic.trim()) {
      Alert.alert('Error', 'Please enter a subject topic');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.generateCourse(subjectTopic.trim(), userId);
      setCourseData(response);
      setMode('preview');
    } catch (error) {
      Alert.alert('Error', 'Failed to generate course. Please try again.');
      console.error('Course generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!courseData) return;

    setLoading(true);
    try {
      await apiService.approveCourseTemplate(courseData.template_id, userId);
      Alert.alert('Success', 'Course created successfully!');
      onCreateSubject();
      handleClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to approve course. Please try again.');
      console.error('Course approval error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!subjectTopic.trim()) return;

    setLoading(true);
    try {
      const response = await apiService.regenerateCourse(subjectTopic.trim(), userId);
      setCourseData(response);
    } catch (error) {
      Alert.alert('Error', 'Failed to regenerate course. Please try again.');
      console.error('Course regeneration error:', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.title}>Create New Subject</Text>
          <View style={{ width: 24 }} />
        </View>


        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {mode === 'input' ? (
            <View style={styles.inputForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>What do you want to learn?</Text>
                <TextInput
                  style={styles.textInput}
                  value={subjectTopic}
                  onChangeText={setSubjectTopic}
                  placeholder="e.g., Linear Algebra, Machine Learning, React Native"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  editable={!loading}
                />
              </View>

              <Text style={styles.helperText}>
                Enter a topic and we'll generate a complete course curriculum with lessons for you to review.
              </Text>
            </View>
          ) : courseData ? (
            <View style={styles.previewForm}>
              <View style={styles.curriculumHeader}>
                <Text style={styles.curriculumTitle}>{courseData.curriculum.course_title}</Text>
                <Text style={styles.curriculumMessage}>{courseData.message}</Text>
              </View>

              <View style={styles.objectivesSection}>
                <Text style={styles.sectionTitle}>Learning Objectives</Text>
                {courseData.curriculum.learning_objectives.map((objective, index) => (
                  <View key={index} style={styles.objectiveItem}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.objectiveText}>{objective}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.lessonsSection}>
                <Text style={styles.sectionTitle}>Course Lessons ({courseData.curriculum.lessons.length})</Text>
                {courseData.curriculum.lessons.map((lesson, index) => (
                  <View key={index} style={styles.lessonCard}>
                    <View style={styles.lessonHeader}>
                      <Text style={styles.lessonTitle}>{index + 1}. {lesson.lesson_title}</Text>
                      <View style={[styles.difficultyBadge, { backgroundColor: lesson.difficulty_level === 'Beginner' ? '#10B981' : lesson.difficulty_level === 'Intermediate' ? '#F59E0B' : '#EF4444' }]}>
                        <Text style={styles.difficultyText}>{lesson.difficulty_level}</Text>
                      </View>
                    </View>
                    <Text style={styles.lessonDescription}>{lesson.brief_description}</Text>
                    <View style={styles.goalsSection}>
                      {lesson.learning_goals.map((goal, goalIndex) => (
                        <Text key={goalIndex} style={styles.goalText}>• {goal}</Text>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </ScrollView>

        {loading ? (
          <View style={styles.footer}>
            <View style={styles.loadingFooter}>
              <ActivityIndicator size="small" color="#3B82F6" />
              <Text style={styles.loadingText}>Processing...</Text>
            </View>
          </View>
        ) : mode === 'input' ? (
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.generateButton, !subjectTopic.trim() && styles.disabledButton]}
              onPress={handleGenerateCourse}
              disabled={!subjectTopic.trim()}
            >
              <Text style={styles.generateButtonText}>Generate Course</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.footer}>
            <TouchableOpacity style={styles.regenerateButton} onPress={handleRegenerate}>
              <RefreshCw size={16} color="#6B7280" />
              <Text style={styles.regenerateButtonText}>Regenerate</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.approveButton}
              onPress={handleApprove}
            >
              <CheckCircle size={16} color="#FFFFFF" />
              <Text style={styles.approveButtonText}>Approve</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
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
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputForm: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  previewForm: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  helperText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginTop: 8,
  },
  curriculumHeader: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  curriculumTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  curriculumMessage: {
    fontSize: 14,
    color: '#6B7280',
  },
  objectivesSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  objectiveItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bulletPoint: {
    color: '#3B82F6',
    marginRight: 8,
    fontSize: 16,
  },
  objectiveText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  lessonsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
  },
  lessonCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  lessonTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  lessonDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  goalsSection: {
    marginTop: 4,
  },
  goalText: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  generateButton: {
    flex: 2,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  regenerateButton: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  regenerateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  approveButton: {
    flex: 2,
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  approveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingFooter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
});