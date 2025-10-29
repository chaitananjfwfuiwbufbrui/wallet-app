import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';

export default function App() {
  const [notification, setNotification] = useState<any>(null);
  const [fcmToken, setFcmToken] = useState('');

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
      // Optionally: send token to backend
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
      setNotification({
        title: notif?.title || 'No Title',
        body: notif?.body || '',
        image: (notif as any)?.android?.imageUrl || (notif as any)?.imageUrl || null,
      });
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

  

  // 📱 UI rendering
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>🔥 Firebase Cloud Messaging Demo</Text>

      <Text style={styles.label}>Your FCM Token:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tokenContainer}>
        <Text style={styles.token}>{fcmToken || 'Fetching token...'}</Text>
      </ScrollView>

      {notification ? (
        <View style={styles.card}>
          {notification.image ? (
            <Image source={{ uri: notification.image }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Text style={{ color: '#888' }}>🖼 No Image</Text>
            </View>
          )}
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{notification.title}</Text>
            <Text style={styles.cardBody}>{notification.body}</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.noNotif}>No new notifications yet</Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => Alert.alert('Token copied (simulate sending to backend)!')}
      >
        <Text style={styles.buttonText}>📤 Send Token to Backend</Text>
      </TouchableOpacity>

      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 20, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700', color: '#111827', marginVertical: 10 },
  label: { fontSize: 14, color: '#6B7280', marginTop: 10 },
  tokenContainer: {
    maxWidth: '100%',
    backgroundColor: '#E5E7EB',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  token: { fontSize: 12, color: '#374151' },
  noNotif: { marginTop: 30, color: '#9CA3AF', fontSize: 14 },
  card: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
    marginVertical: 20,
  },
  image: { width: '100%', height: 180 },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  cardContent: { padding: 15 },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#111827' },
  cardBody: { fontSize: 14, color: '#4B5563', marginTop: 6 },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: { color: '#FFF', fontWeight: '600' },
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