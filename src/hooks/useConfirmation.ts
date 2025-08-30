import { useCallback, useState } from 'react';

export type ConfirmationMode = 'delete-single' | 'delete-bulk' | 'custom';

export interface ConfirmationState {
  visible: boolean;
  title: string;
  message: string;
  mode: ConfirmationMode;
  targetTaskId?: string;
}

export const useConfirmation = () => {
  const [confirmationState, setConfirmationState] = useState<ConfirmationState>({
    visible: false,
    title: '',
    message: '',
    mode: 'custom',
  });

  /**
   * Show confirmation dialog for single task deletion
   */
  const showDeleteConfirmation = useCallback((taskId: string) => {
    setConfirmationState({
      visible: true,
      title: 'Delete Task',
      message: 'Are you sure you want to remove this task?',
      mode: 'delete-single',
      targetTaskId: taskId,
    });
  }, []);

  /**
   * Show confirmation dialog for bulk task deletion
   */
  const showBulkDeleteConfirmation = useCallback((selectedCount: number) => {
    setConfirmationState({
      visible: true,
      title: 'Delete Multiple Tasks',
      message: `Are you sure you want to remove ${selectedCount} task${selectedCount !== 1 ? 's' : ''}?`,
      mode: 'delete-bulk',
    });
  }, []);

  /**
   * Show custom confirmation dialog
   */
  const showCustomConfirmation = useCallback((title: string, message: string) => {
    setConfirmationState({
      visible: true,
      title,
      message,
      mode: 'custom',
    });
  }, []);

  /**
   * Hide confirmation dialog
   */
  const hideConfirmation = useCallback(() => {
    setConfirmationState(prev => ({ ...prev, visible: false }));
  }, []);

  return {
    confirmationState,
    showDeleteConfirmation,
    showBulkDeleteConfirmation,
    showCustomConfirmation,
    hideConfirmation,
  };
};
