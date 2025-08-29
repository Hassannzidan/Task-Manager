import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  size?: number;
  disabled?: boolean;
}

/**
 * Modern floating action button with gradient background and shadow
 * Used for primary actions like adding new tasks
 */
export default function FloatingActionButton({
  onPress,
  icon = 'add',
  size = 56,
  disabled = false,
}: FloatingActionButtonProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <TouchableOpacity
        style={[styles.button, { width: size, height: size, borderRadius: size / 2 }]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#8B5CF6', '#A855F7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, { borderRadius: size / 2 }]}
        >
          <Ionicons
            name={icon}
            size={size * 0.4}
            color="#ffffff"
          />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    zIndex: 1000,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
});
