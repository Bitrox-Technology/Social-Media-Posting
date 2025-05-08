import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, AlertCircle, X } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'warning' | 'error' | 'confirm';
  title: string;
  message?: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  type,
  title,
  message,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const icons = {
    success: <CheckCircle className="w-12 h-12 text-green-500" />,
    warning: <AlertTriangle className="w-12 h-12 text-yellow-500" />,
    error: <XCircle className="w-12 h-12 text-red-500" />,
    confirm: <AlertCircle className="w-12 h-12 text-blue-500" />,
  };

  const colors = {
    success: 'bg-green-50 dark:bg-green-900/20',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20',
    error: 'bg-red-50 dark:bg-red-900/20',
    confirm: 'bg-blue-50 dark:bg-blue-900/20',
  };

  const buttonColors = {
    success: 'bg-green-500 hover:bg-green-600',
    warning: 'bg-yellow-500 hover:bg-yellow-600',
    error: 'bg-red-500 hover:bg-red-600',
    confirm: 'bg-blue-500 hover:bg-blue-600',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Alert Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-labelledby="alert-title"
            aria-modal="true"
          >
            <div className={`${colors[type]} rounded-2xl shadow-xl overflow-hidden w-full max-w-md`}>
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-1 rounded-full hover:bg-black/10 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                aria-label="Close alert"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              <div className="p-6">
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {icons[type]}
                  </motion.div>
                  <h2 id="alert-title" className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                    {title}
                  </h2>
                  {message && (
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                      {message}
                    </p>
                  )}
                </div>

                <div className="mt-6 flex gap-3 justify-center">
                  {type === 'confirm' ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onConfirm}
                        className={`${buttonColors[type]} px-4 py-2 rounded-lg text-white font-medium min-w-[100px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        aria-label="Confirm action"
                      >
                        Confirm
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium min-w-[100px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        aria-label="Cancel action"
                      >
                        Cancel
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onClose}
                      className={`${buttonColors[type]} px-4 py-2 rounded-lg text-white font-medium min-w-[100px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${type === 'success' ? 'green' : type === 'warning' ? 'yellow' : 'red'}-500`}
                      aria-label="Dismiss alert"
                    >
                      OK
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};