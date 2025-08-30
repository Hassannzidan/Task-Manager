import { useCallback, useRef, useState } from 'react';
import { ToastType } from '../components/Toast';

export const useToast = (autoHideDuration: number = 2500) => {
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: ToastType;
  }>({
    visible: false,
    message: '',
    type: 'success',
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Show toast notification with auto-hide
   */
  const showToast = useCallback((message: string, type: ToastType) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setToast({ visible: true, message, type });

    // Set auto-hide timeout
    timeoutRef.current = setTimeout(() => {
      hideToast();
    }, autoHideDuration);
  }, [autoHideDuration]);

  /**
   * Hide toast notification
   */
  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, visible: false }));
    
    // Clear timeout if it exists
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
};
