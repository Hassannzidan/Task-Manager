import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Task } from "../types/Task";

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onSelect: (taskId: string) => void;
  index: number;
  isSelectionMode: boolean;
}

const { width } = Dimensions.get("window");

/**
 * Enhanced task item component with selection support and modern styling
 * Supports long press for selection mode and displays task description
 */
const TaskItem = ({
  task,
  onToggle,
  onDelete,
  onSelect,
  index,
  isSelectionMode,
}: TaskItemProps) => {
  const slideAnim = useRef(new Animated.Value(width)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const checkAnim = useRef(new Animated.Value(0)).current;
  const selectionIndicatorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideAnim, opacityAnim, scaleAnim, index]);

  useEffect(() => {
    // Animate checkbox when selection mode changes
    Animated.spring(checkAnim, {
      toValue: isSelectionMode ? 1 : 0,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();

    // Animate selection indicator
    Animated.spring(selectionIndicatorAnim, {
      toValue: isSelectionMode ? 1 : 0,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [isSelectionMode, checkAnim, selectionIndicatorAnim]);

  const handleToggle = () => {
    if (isSelectionMode) {
      onSelect(task.id);
    } else {
      onToggle(task.id);
    }
  };

  const handleLongPress = () => {
    if (!isSelectionMode) {
      onSelect(task.id);
    }
  };

  const handleDelete = () => {
    onDelete(task.id);
  };

  const isSelected = task.selected || false;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateX: slideAnim }, { scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      {/* Selection Mode Indicator */}
      {isSelectionMode && (
        <Animated.View
          style={[
            styles.selectionModeIndicator,
            {
              opacity: selectionIndicatorAnim,
              transform: [{ scale: selectionIndicatorAnim }],
            },
          ]}
        />
      )}

      {/* Selection Checkbox or Task Toggle */}
      <Pressable
        style={styles.toggleButton}
        onPress={handleToggle}
        onLongPress={handleLongPress}
        delayLongPress={500}
        accessible={true}
        accessibilityRole="checkbox"
        accessibilityLabel={`Task: ${task.text}`}
        accessibilityState={{ checked: task.completed || isSelected }}
      >
        {isSelectionMode ? (
          <Animated.View
            style={[
              styles.selectionCheckbox,
              isSelected && styles.selectionCheckboxSelected,
              {
                transform: [{ scale: checkAnim }],
              },
            ]}
          >
            {isSelected && (
              <Ionicons name="checkmark" size={16} color="#ffffff" />
            )}
          </Animated.View>
        ) : (
          <View
            style={[
              styles.checkbox,
              task.completed && styles.checkboxCompleted,
            ]}
            accessible={true}
            accessibilityLabel={`${task.text}${
              task.description ? ". " + task.description : ""
            }`}
          >
            {task.completed && (
              <Ionicons name="checkmark" size={16} color="#ffffff" />
            )}
          </View>
        )}
      </Pressable>

      {/* Task Content */}
      <View style={styles.textContainer}>
        <Text
          style={[styles.taskText, task.completed && styles.taskTextCompleted]}
          numberOfLines={2}
        >
          {task.text}
        </Text>

        {task.description && (
          <Text
            style={[
              styles.taskDescription,
              task.completed && styles.taskDescriptionCompleted,
            ]}
            numberOfLines={2}
          >
            {task.description}
          </Text>
        )}
      </View>

      {/* Delete Button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Delete task: ${task.text}`}
      >
        <Ionicons name="trash-outline" size={20} color="#ef4444" />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default TaskItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    position: "relative",
  },
  selectionModeIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(139, 92, 246, 0.05)",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(139, 92, 246, 0.2)",
  },
  toggleButton: {
    marginRight: 16,
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  checkboxCompleted: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  selectionCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  selectionCheckboxSelected: {
    backgroundColor: "#8b5cf6",
    borderColor: "#8b5cf6",
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  taskText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    lineHeight: 22,
    marginBottom: 4,
  },
  taskTextCompleted: {
    textDecorationLine: "line-through",
    color: "#9ca3af",
  },
  taskDescription: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 18,
  },
  taskDescriptionCompleted: {
    color: "#cbd5e1",
  },
  deleteButton: {
    padding: 8,
    marginTop: 2,
  },
});
