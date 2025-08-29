import { Ionicons } from '@expo/vector-icons';
import React, { useState, useRef } from 'react';
import {
    Animated,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface TaskInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onAddTask: () => void;
  placeholder?: string;
}

export default function TaskInput({
  value,
  onChangeText,
  onAddTask,
  placeholder = 'Add a new task...',
}: TaskInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleAddTask = () => {
    if (value.trim()) {
      onAddTask();
      inputRef.current?.blur();
    }
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#e2e8f0', '#3b82f6'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.inputContainer,
          {
            borderColor: borderColor,
            borderWidth: isFocused ? 2 : 1,
          },
        ]}
      >
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          onFocus={handleFocus}
          onBlur={handleBlur}
          returnKeyType="done"
          onSubmitEditing={handleAddTask}
        />
        <TouchableOpacity
          style={[
            styles.addButton,
            { opacity: value.trim() ? 1 : 0.5 },
          ]}
          onPress={handleAddTask}
          disabled={!value.trim()}
          activeOpacity={0.7}
        >
          <Ionicons
            name="add"
            size={24}
            color="#ffffff"
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1e293b',
  },
  addButton: {
    backgroundColor: '#10b981',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
});
