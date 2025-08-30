import { useCallback, useState } from 'react';
import { LayoutAnimation, Platform, UIManager } from 'react-native';
import { Task } from '../types/Task';
import soundManager from '../utils/soundUtils';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

  // Computed values
  const completedTasks = tasks.filter(task => task.completed);
  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasksCount = completedTasks.length;
  const totalTasksCount = tasks.length;

  /**
   * Add new task with smooth animation
   */
  const addTask = useCallback((title: string, description: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text: title,
      description,
      completed: false,
      selected: false,
    };

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks(prevTasks => [newTask, ...prevTasks]);
  }, []);

  /**
   * Toggle task completion status with animation
   */
  const toggleTask = useCallback(async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      )
    );

    // Play sound and show toast for completion
    if (task && !task.completed) {
      await soundManager.playSuccessSound();
    }
  }, [tasks]);

  /**
   * Delete a single task with animation
   */
  const deleteTask = useCallback((taskId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  }, []);

  /**
   * Handle task selection for bulk operations
   */
  const handleTaskSelection = useCallback((taskId: string) => {
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
  }, [isSelectionMode]);

  /**
   * Clear all selections and exit selection mode
   */
  const clearSelection = useCallback(() => {
    setSelectedTasks(new Set());
    setIsSelectionMode(false);
    setTasks(prevTasks =>
      prevTasks.map(task => ({ ...task, selected: false }))
    );
  }, []);

  /**
   * Mark all selected tasks as completed
   */
  const markAllSelectedCompleted = useCallback(async () => {
    const selectedTaskIds = Array.from(selectedTasks);
    
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    setTasks(prevTasks =>
      prevTasks.map(task =>
        selectedTaskIds.includes(task.id)
          ? { ...task, completed: true, selected: false }
          : task
      )
    );

    // Play sound
    await soundManager.playSuccessSound();
    clearSelection();
  }, [selectedTasks, clearSelection]);

  /**
   * Delete all selected tasks
   */
  const deleteAllSelected = useCallback(() => {
    const selectedTaskIds = Array.from(selectedTasks);
    
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    setTasks(prevTasks =>
      prevTasks.filter(task => !selectedTaskIds.includes(task.id))
    );

    clearSelection();
  }, [selectedTasks, clearSelection]);

  return {
    // State
    tasks,
    isSelectionMode,
    selectedTasks,
    
    // Computed values
    completedTasks,
    incompleteTasks,
    completedTasksCount,
    totalTasksCount,
    
    // Actions
    addTask,
    toggleTask,
    deleteTask,
    handleTaskSelection,
    clearSelection,
    markAllSelectedCompleted,
    deleteAllSelected,
  };
};
