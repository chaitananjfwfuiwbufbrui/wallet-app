import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, BookOpen, Play, Image as ImageIcon, Bookmark } from 'lucide-react-native';
import { mockTopics } from '../../data/mockData';

export default function TopicPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'text' | 'video' | 'comic'>('text');
  const [isBookmarked, setIsBookmarked] = useState(false);

  const topic = mockTopics.find(t => t.id === id);

  const handleQuizPress = () => {
    router.push(`/quiz/${id}`);
  };

  const handleActivityPress = () => {
    router.push(`/activity/${id}`);
  };

  if (!topic) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Topic not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{topic.title}</Text>
        <TouchableOpacity 
          style={styles.bookmarkButton} 
          onPress={() => setIsBookmarked(!isBookmarked)}
        >
          <Bookmark 
            size={24} 
            color={isBookmarked ? "#F59E0B" : "#6B7280"}
            fill={isBookmarked ? "#F59E0B" : "none"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'text' && styles.activeTab]}
          onPress={() => setActiveTab('text')}
        >
          <BookOpen size={16} color={activeTab === 'text' ? '#FFFFFF' : '#6B7280'} />
          <Text style={[styles.tabText, activeTab === 'text' && styles.activeTabText]}>
            Text
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'video' && styles.activeTab]}
          onPress={() => setActiveTab('video')}
        >
          <Play size={16} color={activeTab === 'video' ? '#FFFFFF' : '#6B7280'} />
          <Text style={[styles.tabText, activeTab === 'video' && styles.activeTabText]}>
            Video
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'comic' && styles.activeTab]}
          onPress={() => setActiveTab('comic')}
        >
          <ImageIcon size={16} color={activeTab === 'comic' ? '#FFFFFF' : '#6B7280'} />
          <Text style={[styles.tabText, activeTab === 'comic' && styles.activeTabText]}>
            Comic
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'text' && (
          <View style={styles.textContent}>
            <Text style={styles.markdown}>{topic.content.text}</Text>
          </View>
        )}

        {activeTab === 'video' && (
          <View style={styles.videoContent}>
            <View style={styles.videoPlaceholder}>
              <Play size={48} color="#FFFFFF" />
              <Text style={styles.videoTitle}>Vector Operations Explained</Text>
              <Text style={styles.videoDuration}>12:34</Text>
            </View>
            <Text style={styles.videoDescription}>
              Watch this comprehensive video explanation of vector operations, including practical 
              examples and visual demonstrations of addition, scalar multiplication, and dot products.
            </Text>
          </View>
        )}

        {activeTab === 'comic' && (
          <View style={styles.comicContent}>
            {topic.content.comicPanels?.map((panel, index) => (
              <View key={panel.id} style={styles.comicPanel}>
                <View style={styles.panelImagePlaceholder}>
                  <Text style={styles.panelNumber}>Panel {index + 1}</Text>
                  <ImageIcon size={32} color="#6B7280" />
                </View>
                <Text style={styles.panelCaption}>{panel.caption}</Text>
                {panel.dialogue && (
                  <View style={styles.speechBubble}>
                    <Text style={styles.dialogue}>"{panel.dialogue}"</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.quizButton} onPress={handleQuizPress}>
            <Text style={styles.buttonText}>Take Sarcastic Quiz</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.activityButton} onPress={handleActivityPress}>
            <Text style={styles.buttonText}>Practice Activity</Text>
          </TouchableOpacity>
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
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  bookmarkButton: {
    marginLeft: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#3B82F6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  textContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  markdown: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
  },
  videoContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  videoPlaceholder: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    marginBottom: 16,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  videoDuration: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  videoDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
  },
  comicContent: {
    gap: 20,
    marginBottom: 20,
  },
  comicPanel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  panelImagePlaceholder: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    marginBottom: 16,
  },
  panelNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  panelCaption: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  speechBubble: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 12,
    alignSelf: 'center',
    maxWidth: '80%',
  },
  dialogue: {
    fontSize: 14,
    color: '#3B82F6',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  actionButtons: {
    gap: 12,
    paddingBottom: 40,
  },
  quizButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  activityButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});