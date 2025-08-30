import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AddTaskModal from '../components/AddTaskModal';
import BulkActionBar from '../components/BulkActionBar';
import ConfirmationDialog from '../components/ConfirmationDialog';
import FloatingActionButton from '../components/FloatingActionButton';
import TaskItem from '../components/TaskItem';
import Toast from '../components/Toast';
import { useConfirmation, useTasks, useToast } from '../hooks';
import soundManager from '../utils/soundUtils';

export default function TaskManagerScreen() {
  // Custom hooks
  const {
    tasks,
    isSelectionMode,
    selectedTasks,
    completedTasks,
    incompleteTasks,
    completedTasksCount,
    totalTasksCount,
    addTask,
    toggleTask,
    deleteTask,
    handleTaskSelection,
    clearSelection,
    markAllSelectedCompleted,
    deleteAllSelected,
  } = useTasks();

  const { toast, showToast, hideToast } = useToast(2500);
  const { confirmationState, showDeleteConfirmation, showBulkDeleteConfirmation, hideConfirmation } = useConfirmation();

  // Modal state
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;

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

  // Enhanced task handlers with toast notifications
  const handleAddTask = (title: string, description: string) => {
    addTask(title, description);
    showToast('Task added successfully 🚀', 'success');
  };

  const handleToggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      await toggleTask(taskId);
      showToast('Well done! Task completed 🎉', 'completion');
    } else {
      toggleTask(taskId);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    showToast('Task removed 🗑️', 'deletion');
  };

  const handleMarkAllSelectedCompleted = async () => {
    const selectedTaskIds = Array.from(selectedTasks);
    await markAllSelectedCompleted();
    showToast(`Marked ${selectedTaskIds.length} task${selectedTaskIds.length !== 1 ? 's' : ''} as completed 🎉`, 'completion');
  };

  const handleDeleteAllSelected = () => {
    const selectedTaskIds = Array.from(selectedTasks);
    deleteAllSelected();
    showToast(`Removed ${selectedTaskIds.length} task${selectedTaskIds.length !== 1 ? 's' : ''} 🗑️`, 'deletion');
  };

  // Confirmation handlers
  const handleConfirmDelete = () => {
    if (confirmationState.mode === 'delete-single' && confirmationState.targetTaskId) {
      handleDeleteTask(confirmationState.targetTaskId);
    } else if (confirmationState.mode === 'delete-bulk') {
      handleDeleteAllSelected();
    }
    hideConfirmation();
  };

  // Render task item with proper props
  const renderTaskItem = ({ item, index }: { item: any; index: number }) => (
    <TaskItem
      task={item}
      onToggle={handleToggleTask}
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
                scrollEventThrottle={16}
                keyboardShouldPersistTaps="handled"
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                windowSize={10}
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
                scrollEventThrottle={16}
                keyboardShouldPersistTaps="handled"
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                windowSize={10}
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
          onAddTask={handleAddTask}
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
          visible={confirmationState.visible}
          title={confirmationState.title}
          message={confirmationState.message}
          onConfirm={handleConfirmDelete}
          onCancel={hideConfirmation}
          type="delete"
        />

        {/* Bulk Action Bar */}
        <BulkActionBar
          visible={isSelectionMode}
          selectedCount={selectedTasks.size}
          onDeleteAll={() => showBulkDeleteConfirmation(selectedTasks.size)}
          onMarkAllCompleted={handleMarkAllSelectedCompleted}
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
