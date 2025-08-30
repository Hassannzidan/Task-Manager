import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from "../styles/global";

export default function DemoInfo() {
  return (
    <ScrollView
      style={styles.container}
      accessible
      accessibilityLabel="Demo information about the Task Manager app"
    >
      <Text style={styles.title} accessibilityRole="header">
        Task Manager App Demo
      </Text>

      <View style={styles.section} accessibilityRole="list">
        <Text style={styles.sectionTitle} accessibilityRole="header">Features</Text>
        <Text style={styles.feature}>✓ Welcome screen with animations</Text>
        <Text style={styles.feature} >
          ✓ Task management (add, complete, delete)
        </Text>
        <Text style={styles.feature}>✓ Smooth animations and transitions</Text>
        <Text style={styles.feature}>✓ Modern, responsive UI design</Text>
        <Text style={styles.feature}>✓ TypeScript for type safety</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Project Structure</Text>
        <Text style={styles.structure}>src/</Text>
        <Text style={styles.structure}>├── components/</Text>
        <Text style={styles.structure}>│ ├── CustomButton.tsx</Text>
        <Text style={styles.structure}>│ ├── TaskInput.tsx</Text>
        <Text style={styles.structure}>│ ├── TaskItem.tsx</Text>
        <Text style={styles.structure}>│ └── TaskIllustration.tsx</Text>
        <Text style={styles.structure}>├── screens/</Text>
        <Text style={styles.structure}>│ ├── WelcomeScreen.tsx</Text>
        <Text style={styles.structure}>│ └── TaskManagerScreen.tsx</Text>
        <Text style={styles.structure}>├── types/</Text>
        <Text style={styles.structure}>│ └── Task.ts</Text>
        <Text style={styles.structure}>└── styles/</Text>
        <Text style={styles.structure}> └── global.ts</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How to Run</Text>
        <Text style={styles.instruction}>1. npm install</Text>
        <Text style={styles.instruction}>2. npm start</Text>
        <Text style={styles.instruction}>
          3. Press &apos;i&apos; for iOS or &apos;a&apos; for Android
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
  title: {
    ...Typography.h1,
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl,
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.small,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  feature: {
    ...Typography.body2,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  structure: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontFamily: "monospace",
    marginBottom: Spacing.xs,
  },
  instruction: {
    ...Typography.body2,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
});
