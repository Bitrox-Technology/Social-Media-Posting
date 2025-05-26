import React, { useContext, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectSessionWarning, selectUser } from '../../store/appSlice';
import { AuthContext } from './AuthProvider';
import { useAlert } from '../hooks/useAlert';
import { Alert } from '../ui/Alert';
import { useNavigate } from 'react-router-dom';

const SessionWarning: React.FC = () => {
  const sessionWarning = useSelector(selectSessionWarning);
  console.log('SessionWarning: sessionWarning=', sessionWarning);     
  const user = useSelector(selectUser);
  const authContext = useContext(AuthContext);
  const { isOpen, config, confirm, success, error, closeAlert, handleConfirm } = useAlert();
  const navigate = useNavigate();

  // Memoize handleRefresh to prevent re-creation on every render
  const handleRefresh = useCallback(async () => {
    console.log('SessionWarning: handleRefresh called, authContext=', authContext);
    if (!authContext) {
      console.error('SessionWarning: Auth context missing');
      error('Authentication Error', 'Auth context is unavailable. Please sign in again.');
      navigate('/signin');
      return;
    }
    try {
      await authContext.refreshSession();
      console.log('SessionWarning: Session refresh successful');
      success('Session extended successfully!', 'You can continue working.');
    } catch (err) {
      console.error('SessionWarning: Session refresh failed:', err);
      error('Failed to extend session.', 'Please sign in again.');
      navigate('/signin');
    }
  }, [authContext, success, error, navigate]);

  // Show confirmation alert when session is about to expire
  useEffect(() => {
    console.log('SessionWarning: useEffect triggered, sessionWarning=', sessionWarning, 'user=', user, 'isOpen=', isOpen);
    if (sessionWarning && user && authContext && !isOpen) {
      confirm(
        'Session About to Expire',
        'Your session will expire in less than 5 minutes. Extend now to continue.',
        handleRefresh
      );
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