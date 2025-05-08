import { useState } from 'react';

interface AlertConfig {
  type: 'success' | 'warning' | 'error' | 'confirm';
  title: string;
  message?: string;
}

export const useAlert = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<AlertConfig>({
    type: 'success',
    title: '',
  });
  const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void) | undefined>();

  const showAlert = (alertConfig: AlertConfig, onConfirm?: () => void) => {
    setConfig(alertConfig);
    if (onConfirm) {
      setOnConfirmCallback(() => onConfirm);
    }
    setIsOpen(true);
  };

  const closeAlert = () => {
    setIsOpen(false);
    setOnConfirmCallback(undefined);
  };

  const handleConfirm = () => {
    if (onConfirmCallback) {
      onConfirmCallback();
    }
    closeAlert();
  };

  return {
    isOpen,
    config,
    showAlert,
    closeAlert,
    handleConfirm,
    success: (title: string, message?: string) => 
      showAlert({ type: 'success', title, message }),
    warning: (title: string, message?: string) =>
      showAlert({ type: 'warning', title, message }),
    error: (title: string, message?: string) =>
      showAlert({ type: 'error', title, message }),
    confirm: (title: string, message?: string, onConfirm?: () => void) =>
      showAlert({ type: 'confirm', title, message }, onConfirm),
  };
};