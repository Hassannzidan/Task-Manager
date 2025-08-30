import React, { useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export default function CustomButton({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
}: CustomButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled }}
    >
      <Animated.View
        style={[
          styles.button,
          style,
          { transform: [{ scale: scaleAnim }] },
          disabled && styles.disabled,
        ]}
      >
        <Text style={[styles.buttonText, textStyle, disabled && styles.disabledText]}>
          {title}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#9ca3af',
  },
});
