import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function TaskIllustration() {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons
          name="checkmark-circle"
          size={80}
          color="#3b82f6"
        />
      </View>
      <View style={styles.taskList}>
        <View style={styles.taskRow}>
          <View style={[styles.checkbox, styles.checkboxCompleted]} />
          <View style={styles.taskBar} />
        </View>
        <View style={styles.taskRow}>
          <View style={styles.checkbox} />
          <View style={[styles.taskBar, styles.taskBarShort]} />
        </View>
        <View style={styles.taskRow}>
          <View style={styles.checkbox} />
          <View style={[styles.taskBar, styles.taskBarMedium]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
  },
  iconContainer: {
    marginBottom: 20,
  },
  taskList: {
    alignItems: 'flex-start',
    width: '100%',
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#d1d5db',
    marginRight: 12,
  },
  checkboxCompleted: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  taskBar: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    flex: 1,
  },
  taskBarShort: {
    width: '60%',
  },
  taskBarMedium: {
    width: '80%',
  },
});
