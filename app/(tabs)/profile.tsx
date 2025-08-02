import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Trophy, Clock, Target, Award, Moon, Bell, Download } from 'lucide-react-native';
import { useAppContext } from '../../contexts/AppContext';

export default function ProfilePage() {
  const { userProgress } = useAppContext();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>JD</Text>
            </View>
            <Text style={styles.name}>John Doe</Text>
            <Text style={styles.level}>Level {userProgress.level} Learner</Text>
          </View>

          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Your Stats</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Trophy size={24} color="#F59E0B" />
                <Text style={styles.statNumber}>{userProgress.xp}</Text>
                <Text style={styles.statLabel}>Total XP</Text>
              </View>
              
              <View style={styles.statCard}>
                <Target size={24} color="#8B5CF6" />
                <Text style={styles.statNumber}>{userProgress.topicsCompleted}</Text>
                <Text style={styles.statLabel}>Topics Mastered</Text>
              </View>
              
              <View style={styles.statCard}>
                <Clock size={24} color="#10B981" />
                <Text style={styles.statNumber}>{userProgress.totalTimeSpent}h</Text>
                <Text style={styles.statLabel}>Time Spent</Text>
              </View>
              
              <View style={styles.statCard}>
                <Award size={24} color="#EF4444" />
                <Text style={styles.statNumber}>{userProgress.streak}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
            </View>
          </View>

          <View style={styles.badgesSection}>
            <Text style={styles.sectionTitle}>Badges Earned</Text>
            <View style={styles.badgesGrid}>
              {userProgress.badges.map((badge, index) => (
                <View key={index} style={styles.badge}>
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Settings</Text>
            
            <TouchableOpacity style={styles.settingItem}>
              <Settings size={20} color="#6B7280" />
              <Text style={styles.settingText}>Content Preferences</Text>
              <Text style={styles.settingValue}>Text</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <Bell size={20} color="#6B7280" />
              <Text style={styles.settingText}>Notifications</Text>
              <Text style={styles.settingValue}>On</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <Moon size={20} color="#6B7280" />
              <Text style={styles.settingText}>Dark Mode</Text>
              <Text style={styles.settingValue}>Off</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <Download size={20} color="#6B7280" />
              <Text style={styles.settingText}>Offline Content</Text>
              <Text style={styles.settingValue}>Sync</Text>
            </TouchableOpacity>
          </View>
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
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  level: {
    fontSize: 16,
    color: '#6B7280',
  },
  statsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  badgesSection: {
    marginBottom: 32,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
  },
  settingsSection: {
    marginBottom: 32,
  },
  settingItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
  },
  settingValue: {
    fontSize: 14,
    color: '#6B7280',
  },
});