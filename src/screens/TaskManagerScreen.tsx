import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AddTaskModal from '../components/AddTaskModal';
import BulkActionBar from '../components/BulkActionBar';
import ConfirmationDialog from '../components/ConfirmationDialog';
import FloatingActionButton from '../components/FloatingActionButton';
import TaskItem, { TaskItemRef } from '../components/TaskItem';
import Toast, { ToastType } from '../components/Toast';
import { Task } from '../types/Task';
import soundManager from '../utils/soundUtils';

export default function TaskManagerScreen() {
  // State management
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  
  // Toast state
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: ToastType;
  }>({
    visible: false,
    message: '',
    type: 'success',
  });

  // Confirmation dialog state
  const [confirmationDialog, setConfirmationDialog] = useState<{
    visible: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    visible: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Task item refs for animation control
  const taskItemRefs = useRef<Map<string, TaskItemRef>>(new Map()).current;

  // Initialize sound manager and animations
  useEffect(() => {
    soundManager.loadSuccessSound();
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Cleanup sound manager on unmount
    return () => {
      soundManager.cleanup();
    };
  }, [fadeAnim]);

  // Computed values
  const completedTasks = tasks.filter(task => task.completed);
  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasksCount = completedTasks.length;
  const totalTasksCount = tasks.length;

  /**
   * Show toast notification with auto-hide
   */
  const showToast = (message: string, type: ToastType) => {
    setToast({ visible: true, message, type });
  };

  /**
   * Hide toast notification
   */
  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  /**
   * Show confirmation dialog
   */
  const showConfirmation = (title: string, message: string, onConfirm: () => void) => {
    setConfirmationDialog({ visible: true, title, message, onConfirm });
  };

  /**
   * Hide confirmation dialog
   */
  const hideConfirmation = () => {
    setConfirmationDialog(prev => ({ ...prev, visible: false }));
  };

  /**
   * Add new task with title and description
   */
  const addTask = (title: string, description: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text: title,
      description,
      completed: false,
      selected: false,
    };
    
    setTasks(prevTasks => [newTask, ...prevTasks]);
    showToast('Task added successfully 🚀', 'success');
  };

  /**
   * Toggle task completion status
   */
  const toggleTask = async (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      )
    );

    // Play sound and show toast for completion
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      await soundManager.playSuccessSound();
      showToast('Well done! Task completed 🎉', 'completion');
    }
  };

  /**
   * Delete a single task
   */
  const deleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    showToast('Task removed 🗑️', 'deletion');
  };

  /**
   * Handle task selection for bulk operations
   */
  const handleTaskSelection = (taskId: string) => {
    if (!isSelectionMode) {
      setIsSelectionMode(true);
    }

    setSelectedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      
      // Exit selection mode if no tasks selected
      if (newSet.size === 0) {
        setIsSelectionMode(false);
      }
      
      return newSet;
    });

    // Update task selection state
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, selected: !task.selected }
          : task
      )
    );
  };

  /**
   * Clear all selections and exit selection mode
   */
  const clearSelection = () => {
    setSelectedTasks(new Set());
    setIsSelectionMode(false);
    setTasks(prevTasks =>
      prevTasks.map(task => ({ ...task, selected: false }))
    );
  };

  /**
   * Mark all selected tasks as completed
   */
  const markAllSelectedCompleted = async () => {
    const selectedTaskIds = Array.from(selectedTasks);
    
    setTasks(prevTasks =>
      prevTasks.map(task =>
        selectedTaskIds.includes(task.id)
          ? { ...task, completed: true, selected: false }
          : task
      )
    );

    // Play sound and show toast
    await soundManager.playSuccessSound();
    showToast(`Marked ${selectedTaskIds.length} task${selectedTaskIds.length !== 1 ? 's' : ''} as completed 🎉`, 'completion');
    
    clearSelection();
  };

  /**
   * Delete all selected tasks
   */
  const deleteAllSelected = () => {
    const selectedTaskIds = Array.from(selectedTasks);
    
    setTasks(prevTasks =>
      prevTasks.filter(task => !selectedTaskIds.includes(task.id))
    );

    showToast(`Removed ${selectedTaskIds.length} task${selectedTaskIds.length !== 1 ? 's' : ''} 🗑️`, 'deletion');
    clearSelection();
  };

  /**
   * Show delete confirmation for single task
   */
  const showDeleteConfirmation = (taskId: string) => {
    showConfirmation(
      'Delete Task',
      'Are you sure you want to remove this task?',
      () => {
        // Trigger the delete animation in the TaskItem
        const taskItemRef = taskItemRefs.get(taskId);
        if (taskItemRef) {
          taskItemRef.animateDelete();
        } else {
          // Fallback: delete immediately if ref not found
          deleteTask(taskId);
        }
      }
    );
  };

  /**
   * Show delete confirmation for multiple tasks
   */
  const showBulkDeleteConfirmation = () => {
    const count = selectedTasks.size;
    showConfirmation(
      'Delete Multiple Tasks',
      `Are you sure you want to remove ${count} task${count !== 1 ? 's' : ''}?`,
      deleteAllSelected
    );
  };

  /**
   * Render task item with proper props
   */
  const renderTaskItem = ({ item, index }: { item: Task; index: number }) => (
    <TaskItem
      ref={(ref) => {
        if (ref) {
          taskItemRefs.set(item.id, ref);
        }
      }}
      task={item}
      onToggle={toggleTask}
      onDelete={showDeleteConfirmation}
      onSelect={handleTaskSelection}
      index={index}
      isSelectionMode={isSelectionMode}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <Text style={styles.title}>Task Manager</Text>
          <Text style={styles.subtitle}>
            {totalTasksCount === 0
              ? 'No tasks yet'
              : `${completedTasksCount} of ${totalTasksCount} completed`}
          </Text>
        </Animated.View>

        {/* Content */}
        <View style={styles.content}>
          {/* Incomplete Tasks Section */}
          {incompleteTasks.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Incomplete Tasks</Text>
              <FlatList
                data={incompleteTasks}
                keyExtractor={(item) => item.id}
                renderItem={renderTaskItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.taskList}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </View>
          )}

          {/* Completed Tasks Section */}
          {completedTasks.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Completed Tasks</Text>
              <FlatList
                data={completedTasks}
                keyExtractor={(item) => item.id}
                renderItem={renderTaskItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.taskList}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </View>
          )}

          {/* Empty State */}
          {totalTasksCount === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No tasks yet. Tap the + button to get started!
              </Text>
            </View>
          )}
        </View>

        {/* Floating Action Button */}
        <FloatingActionButton
          onPress={() => setIsModalVisible(true)}
          icon="add"
        />

        {/* Add Task Modal */}
        <AddTaskModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onAddTask={addTask}
        />

        {/* Toast Notifications */}
        <Toast
          visible={toast.visible}
          message={toast.message}
          type={toast.type}
          onHide={hideToast}
        />

        {/* Confirmation Dialog */}
        <ConfirmationDialog
          visible={confirmationDialog.visible}
          title={confirmationDialog.title}
          message={confirmationDialog.message}
          onConfirm={() => {
            hideConfirmation();
            confirmationDialog.onConfirm();
          }}
          onCancel={hideConfirmation}
          type="delete"
        />

        {/* Bulk Action Bar */}
        <BulkActionBar
          visible={isSelectionMode}
          selectedCount={selectedTasks.size}
          onDeleteAll={showBulkDeleteConfirmation}
          onMarkAllCompleted={markAllSelectedCompleted}
          onClearSelection={clearSelection}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
    marginTop: 8,
  },
  taskList: {
    paddingBottom: 100,
  },
  separator: {
    height: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 24,
  },
});
