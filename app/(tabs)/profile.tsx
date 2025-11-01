import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { apiService } from '../../services/api';
import { useRouter } from 'expo-router';
// Mock icons (replace with actual icon library like react-native-vector-icons)
const Trophy = ({ size, color }: any) => <Text style={{ fontSize: size, color }}>🏆</Text>;
const Target = ({ size, color }: any) => <Text style={{ fontSize: size, color }}>🎯</Text>;
const Clock = ({ size, color }: any) => <Text style={{ fontSize: size, color }}>⏰</Text>;
const Award = ({ size, color }: any) => <Text style={{ fontSize: size, color }}>🏅</Text>;
const Settings = ({ size, color }: any) => <Text style={{ fontSize: size, color }}>⚙️</Text>;
const Bell = ({ size, color }: any) => <Text style={{ fontSize: size, color }}>🔔</Text>;
const Moon = ({ size, color }: any) => <Text style={{ fontSize: size, color }}>🌙</Text>;
const Download = ({ size, color }: any) => <Text style={{ fontSize: size, color }}>📥</Text>;
const LogOut = ({ size, color }: any) => <Text style={{ fontSize: size, color }}>🚪</Text>;

export default function ProfilePage() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [fcmToken, setFcmToken] = useState('');
   const router = useRouter();
  // Mock user progress data (replace with actual data from your backend)
  const [userProgress] = useState({
    level: 5,
    xp: 2450,
    topicsCompleted: 12,
    totalTimeSpent: 45,
    streak: 7,
    badges: ['🔥 Week Warrior', '⭐ Fast Learner', '💎 Consistent', '🎓 Scholar'],
  });

  // 🔹 Request permission for notifications
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) console.log('Authorization status:', authStatus);
    return enabled;
  };

  // 🔹 Get FCM token
  const getFcmToken = async () => {
    try {
      const token = await messaging().getToken();
      console.log('✅ FCM Token:', token);
      setFcmToken(token);
      // TODO: Send token to backend to store with user profile
    } catch (error) {
      console.error('❌ Error getting FCM token:', error);
    }
  };

  useEffect(() => {
    // 1️⃣ Ask permission and get token
    requestUserPermission().then((enabled) => {
      if (enabled) getFcmToken();
      else Alert.alert('Permission Required', 'Please allow notifications.');
    });

    // 2️⃣ Foreground notifications
    const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
      console.log('📩 Foreground notification:', remoteMessage);
      const notif = remoteMessage.notification;
      Alert.alert(
        notif?.title || 'Notification',
        notif?.body || '',
        [{ text: 'OK' }]
      );
    });

    // 3️⃣ Background tap handler
    const unsubscribeOnNotificationOpenedApp = messaging().onNotificationOpenedApp(
      (remoteMessage) => {
        console.log('📨 Notification opened (background):', remoteMessage.notification);
        Alert.alert('Notification Tapped', remoteMessage.notification?.title || '');
      }
    );

    // 4️⃣ Quit-state notification handler
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log('🚀 Notification caused app to open from quit state:', remoteMessage.notification);
          Alert.alert('Opened from Quit', remoteMessage.notification?.title || '');
        }
      });

    // 5️⃣ Background handler
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('🛠 Background message handled:', remoteMessage.notification);
    });

    return () => {
      unsubscribeOnMessage();
      unsubscribeOnNotificationOpenedApp();
    };
  }, []);

  useEffect(() => {
    const sendToken = async () => {
      if (user?.id && fcmToken) {
        try {
          await apiService.savePushToken(user.id, fcmToken);
        } catch (e) {
          console.error(e);
        }
      }
    };
    sendToken();
  }, [user?.id, fcmToken]);

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
               router.replace('/login');
              // Navigation will be handled by your auth flow
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const getDisplayName = () => {
    if (user?.fullName && user.fullName.trim()) return user.fullName;
    const first = user?.firstName?.trim();
    const last = user?.lastName?.trim();
    if (first || last) return [first, last].filter(Boolean).join(' ');
    const email = user?.primaryEmailAddress?.emailAddress;
    if (email) return email.split('@')[0];
    return 'User';
  };

  const getInitials = () => {
    if (user?.fullName && user.fullName.trim()) {
      const names = user.fullName.trim().split(' ');
      if (names.length >= 2) return `${names[0][0]}${names[1][0]}`.toUpperCase();
      return names[0].substring(0, 2).toUpperCase();
    }
    const first = user?.firstName?.trim();
    const last = user?.lastName?.trim();
    if (first || last) return `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase() || 'U';
    const email = user?.primaryEmailAddress?.emailAddress;
    if (email) return email.substring(0, 2).toUpperCase();
    return 'U';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.avatar}>
              {user?.imageUrl ? (
                <Image source={{ uri: user.imageUrl }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>{getInitials()}</Text>
              )}
            </View>
            <Text style={styles.name}>{getDisplayName()}</Text>
            <Text style={styles.email}>{user?.primaryEmailAddress?.emailAddress || ''}</Text>
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

            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
              <LogOut size={20} color="#EF4444" />
              <Text style={styles.signOutText}>Sign Out</Text>
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
    overflow: 'hidden',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
  email: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
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
  signOutButton: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  signOutText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
  },
});