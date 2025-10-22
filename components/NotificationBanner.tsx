import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  runOnJS,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Bell, X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

interface NotificationBannerProps {
  title: string;
  message: string;
  visible: boolean;
  onDismiss: () => void;
  onPress?: () => void;
  duration?: number;
  type?: 'info' | 'success' | 'warning' | 'error';
}

export function NotificationBanner({
  title,
  message,
  visible,
  onDismiss,
  onPress,
  duration = 5000,
  type = 'info',
}: NotificationBannerProps) {
  const translateY = useSharedValue(-200);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 200,
      });
      opacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      });
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 150,
      });

      if (duration > 0) {
        translateY.value = withDelay(
          duration,
          withSpring(-200, {
            damping: 20,
            stiffness: 200,
          })
        );
        opacity.value = withDelay(
          duration,
          withTiming(0, {
            duration: 300,
            easing: Easing.in(Easing.ease),
          })
        );
        scale.value = withDelay(duration, withSpring(0.9));

        setTimeout(() => {
          runOnJS(onDismiss)();
        }, duration + 300);
      }
    } else {
      translateY.value = withSpring(-200);
      opacity.value = withTiming(0);
      scale.value = withSpring(0.9);
    }
  }, [visible, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          colors: ['#10B981', '#059669'],
          icon: CheckCircle,
          bgColor: '#ECFDF5',
          borderColor: '#A7F3D0',
        };
      case 'warning':
        return {
          colors: ['#F59E0B', '#D97706'],
          icon: AlertTriangle,
          bgColor: '#FFFBEB',
          borderColor: '#FDE68A',
        };
      case 'error':
        return {
          colors: ['#EF4444', '#DC2626'],
          icon: AlertCircle,
          bgColor: '#FEF2F2',
          borderColor: '#FCA5A5',
        };
      default:
        return {
          colors: ['#3B82F6', '#2563EB'],
          icon: Info,
          bgColor: '#EFF6FF',
          borderColor: '#BFDBFE',
        };
    }
  };

  const config = getTypeConfig();
  const IconComponent = config.icon;

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <BlurView intensity={90} tint="light" style={styles.blurContainer}>
        <TouchableOpacity
          style={[styles.content, { backgroundColor: config.bgColor }]}
          onPress={onPress}
          activeOpacity={onPress ? 0.85 : 1}
        >
          <View style={styles.leftAccent}>
            <LinearGradient colors={config.colors} style={styles.accentGradient} />
          </View>

          <View style={styles.iconWrapper}>
            <LinearGradient
              colors={config.colors}
              style={styles.iconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <IconComponent size={22} color="#FFFFFF" strokeWidth={2.5} />
            </LinearGradient>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.message} numberOfLines={2}>
              {message}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onDismiss}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View style={styles.closeButtonCircle}>
              <X size={16} color="#6B7280" strokeWidth={2.5} />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  blurContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingLeft: 8,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  leftAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    overflow: 'hidden',
  },
  accentGradient: {
    flex: 1,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  message: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
  closeButton: {
    padding: 4,
  },
  closeButtonCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
