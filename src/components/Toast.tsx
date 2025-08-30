import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export type ToastType = 'success' | 'completion' | 'deletion';

interface ToastProps {
  visible: boolean;
  message: string;
  type: ToastType;
  onHide: () => void;
}

/**
 * Toast notification component for user feedback
 * Shows success messages, task completion, and deletion confirmations
 */
export default function Toast({
  visible,
  message,
  type,
  onHide,
}: ToastProps) {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Slide in from top
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Slide out to top
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: -100,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onHide();
      });
    }
  }, [visible, slideAnim, opacityAnim, onHide]);

  const getToastStyle = () => {
    switch (type) {
      case 'success':
        return { backgroundColor: '#10b981', icon: 'checkmark-circle' };
      case 'completion':
        return { backgroundColor: '#8b5cf6', icon: 'trophy' };
      case 'deletion':
        return { backgroundColor: '#ef4444', icon: 'trash' };
      default:
        return { backgroundColor: '#3b82f6', icon: 'information-circle' };
    }
  };

  const { backgroundColor, icon } = getToastStyle();

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <View style={[styles.toast, { backgroundColor }]}>
        <Ionicons name={icon as any} size={20} color="#ffffff" />
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  message: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
