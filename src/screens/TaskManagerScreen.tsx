import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
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
    toggleSelectionMode,
    selectAllTasks,
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

  // Memoized section data for SectionList
  const sectionData = useMemo(() => {
    const sections = [];
    
    if (incompleteTasks.length > 0) {
      sections.push({
        title: 'Incomplete Tasks',
        data: incompleteTasks,
        type: 'incomplete' as const,
      });
    }
    
    if (completedTasks.length > 0) {
      sections.push({
        title: 'Completed Tasks',
        data: completedTasks,
        type: 'completed' as const,
      });
    }
    
    return sections;
  }, [incompleteTasks, completedTasks]);

  // Enhanced task handlers with toast notifications
  const handleAddTask = useCallback((title: string, description: string) => {
    addTask(title, description);
    showToast('Task added successfully 🚀', 'success');
  }, [addTask, showToast]);

  const handleToggleTask = useCallback(async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      await toggleTask(taskId);
      showToast('Well done! Task completed 🎉', 'completion');
    } else {
      toggleTask(taskId);
    }
  }, [tasks, toggleTask, showToast]);

  const handleDeleteTask = useCallback((taskId: string) => {
    deleteTask(taskId);
    showToast('Task removed 🗑️', 'deletion');
  }, [deleteTask, showToast]);

  const handleMarkAllSelectedCompleted = useCallback(async () => {
    const selectedTaskIds = Array.from(selectedTasks);
    await markAllSelectedCompleted();
    showToast(`Marked ${selectedTaskIds.length} task${selectedTaskIds.length !== 1 ? 's' : ''} as completed 🎉`, 'completion');
  }, [selectedTasks, markAllSelectedCompleted, showToast]);

  const handleDeleteAllSelected = useCallback(() => {
    const selectedTaskIds = Array.from(selectedTasks);
    deleteAllSelected();
    showToast(`Removed ${selectedTaskIds.length} task${selectedTaskIds.length !== 1 ? 's' : ''} 🗑️`, 'deletion');
  }, [selectedTasks, deleteAllSelected, showToast]);

  // Confirmation handlers
  const handleConfirmDelete = useCallback(() => {
    if (confirmationState.mode === 'delete-single' && confirmationState.targetTaskId) {
      handleDeleteTask(confirmationState.targetTaskId);
    } else if (confirmationState.mode === 'delete-bulk') {
      handleDeleteAllSelected();
    }
    hideConfirmation();
  }, [confirmationState, handleDeleteTask, handleDeleteAllSelected, hideConfirmation]);

  // Memoized render task item function
  const renderTaskItem = useCallback(({ item, index }: { item: any; index: number }) => (
    <TaskItem
      task={item}
      onToggle={handleToggleTask}
      onDelete={showDeleteConfirmation}
      onSelect={handleTaskSelection}
      index={index}
      isSelectionMode={isSelectionMode}
    />
  ), [handleToggleTask, showDeleteConfirmation, handleTaskSelection, isSelectionMode]);

  // Memoized render section header function
  const renderSectionHeader = useCallback(({ section }: { section: { title: string } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  ), []);

  // Memoized render separator function
  const renderSeparator = useCallback(() => <View style={styles.separator} />, []);

  // Memoized render empty state function
  const renderEmptyState = useCallback(() => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>
        No tasks yet. Tap the + button to get started!
      </Text>
    </View>
  ), []);

  // Header action handlers
  const handleSelectModeToggle = useCallback(() => {
    toggleSelectionMode();
  }, [toggleSelectionMode]);

  const handleSelectAll = useCallback(() => {
    selectAllTasks();
  }, [selectAllTasks]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <View style={styles.headerTop}>
            <Text style={styles.title}>Task Manager</Text>
            {totalTasksCount > 0 && (
              <TouchableOpacity
                style={styles.selectButton}
                onPress={handleSelectModeToggle}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={isSelectionMode ? "Exit selection mode" : "Enter selection mode"}
                accessibilityHint="Double tap to toggle selection mode for bulk operations"
              >
                <Text style={styles.selectButtonText}>
                  {isSelectionMode ? 'Cancel' : 'Select'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          {isSelectionMode && (
            <View style={styles.selectionHeader}>
              <TouchableOpacity
                style={styles.selectAllButton}
                onPress={handleSelectAll}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Select all tasks"
                accessibilityHint="Double tap to select all tasks for bulk operations"
              >
                <Text style={styles.selectAllButtonText}>Select All</Text>
              </TouchableOpacity>
              <Text style={styles.selectionCount}>
                {selectedTasks.size} of {totalTasksCount} selected
              </Text>
            </View>
          )}
          
          <Text style={styles.subtitle}>
            {totalTasksCount === 0
              ? 'No tasks yet'
              : `${completedTasksCount} of ${totalTasksCount} completed`}
          </Text>
        </Animated.View>

        {/* Content */}
        <View style={styles.content}>
          {totalTasksCount === 0 ? (
            renderEmptyState()
          ) : (
            <SectionList
              sections={sectionData}
              keyExtractor={(item) => item.id}
              renderItem={renderTaskItem}
              renderSectionHeader={renderSectionHeader}
              ItemSeparatorComponent={renderSeparator}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.taskList}
              scrollEventThrottle={16}
              keyboardShouldPersistTaps="handled"
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
              windowSize={10}
              stickySectionHeadersEnabled={false}
              accessibilityRole="list"
              accessibilityLabel="Task list with incomplete and completed sections"
            />
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
  },
  selectButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  selectButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  selectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 12,
  },
  selectAllButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  selectAllButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  selectionCount: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
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
