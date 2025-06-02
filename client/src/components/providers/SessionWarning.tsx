// src/components/SessionWarning.tsx
import React, { useContext, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectSessionWarning, selectUser, setSessionWarning, clearUser, clearCsrfToken } from '../../store/appSlice';
import { AuthContext } from './AuthProvider';
import { useAlert } from '../hooks/useAlert';
import { Alert } from '../ui/Alert';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import Cookies from 'js-cookie';

const SessionWarning: React.FC = () => {
  const sessionWarning = useSelector(selectSessionWarning);
  const user = useSelector(selectUser);
  const { refreshSession, isAuthenticated } = useContext(AuthContext) || {};
  const { success, confirm, closeAlert, isOpen, config, handleConfirm } = useAlert();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Handle session expiration
  const handleSessionExpiration = useCallback(() => {
    confirm(
      'Session Expired',
      'Your session has expired. Please sign in again.',
      () => {
        dispatch(clearUser());
        dispatch(clearCsrfToken());
        dispatch(setSessionWarning(false));
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        navigate('/signin', { replace: true });
        closeAlert();

        // Broadcast logout to all tabs
        const authChannel = new BroadcastChannel('auth_channel');
        authChannel.postMessage({ type: 'LOGOUT' });
        authChannel.close();
      }
    );
  }, [navigate, dispatch, confirm, closeAlert]);

  // Handle session warning (less than 5 minutes remaining)
  // remove useEffect
  useEffect(() => {
    if (!sessionWarning || !user?.authenticate || !refreshSession || !isAuthenticated) return;

    confirm(
      'Session Expiring Soon',
      'Your session will expire in less than 5 minutes. Would you like to extend it?',
      async () => {
        try {
          await refreshSession();
          dispatch(setSessionWarning(false));
          closeAlert();
          success('Session Extended', 'Your session has been extended successfully!');
        } catch (error) {
          console.error('Session refresh failed:', error);
          closeAlert();
          handleSessionExpiration();
        }
      }
    );

    // Cleanup to prevent duplicate alerts
    return () => closeAlert();
  }, [ refreshSession, confirm, success, closeAlert, dispatch, handleSessionExpiration]);

  // Check for expired session (user.expiresAt < now())
  useEffect(() => {
    if (!user?.authenticate || !refreshSession || !isAuthenticated) return;

    if (user.expiresAt && user.expiresAt <= Date.now()) {
      handleSessionExpiration();
    }
  }, [user, isAuthenticated, refreshSession, handleSessionExpiration]);

  return (
    <Alert
      type={config.type}
      title={config.title}
      message={config.message}
      isOpen={isOpen}
      onClose={closeAlert}
      onConfirm={handleConfirm}
    />
  );
};

export default SessionWarning;