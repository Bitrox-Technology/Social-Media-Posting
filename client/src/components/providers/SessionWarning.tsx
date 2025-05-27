import React, { useContext, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectSessionWarning, selectUser } from '../../store/appSlice';
import { AuthContext } from './AuthProvider';
import { useAlert } from '../hooks/useAlert';
import { Alert } from '../ui/Alert';
import { useNavigate } from 'react-router-dom';

const SessionWarning: React.FC = () => {
  const sessionWarning = useSelector(selectSessionWarning);
  const user = useSelector(selectUser);
  const authContext = useContext(AuthContext);
  const { isOpen, config, confirm, success, error, closeAlert, handleConfirm } = useAlert();
  const navigate = useNavigate();

  const handleRefresh = useCallback(async () => {
    if (!authContext) {
      error('Authentication Error', 'Please sign in again.');
      navigate('/signin');
      return;
    }
    try {
      await authContext.refreshSession();
      success('Session extended!', 'You can continue working.');
    } catch {
      error('Failed to extend session.', 'Please sign in again.');
      navigate('/signin');
    }
  }, [authContext, error, navigate, success]);

  useEffect(() => {
    if (sessionWarning && user && authContext && !isOpen) {
      confirm('Session About to Expire', 'Extend your session now?', handleRefresh);
    }
  }, [sessionWarning, user, authContext, isOpen, confirm, handleRefresh]);

  return (
    <Alert
      type={config.type}
      title={config.title}
      message={config.message}
      isOpen={isOpen}
      onClose={closeAlert}
      onConfirm={config.type === 'confirm' ? handleConfirm : undefined}
    />
  );
};

export default SessionWarning;