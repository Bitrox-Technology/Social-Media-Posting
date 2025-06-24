// src/components/SessionWarning.tsx
import React, { useContext, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectSessionWarning, selectUser, setSessionWarning, clearUser, clearCsrfToken, setSessionWarningToExpire } from '../../store/appSlice';
import { AuthContext } from './AuthProvider';
import { useAlert } from '../hooks/useAlert';
import { Alert } from '../ui/Alert';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';

const SessionWarning: React.FC = () => {
  const sessionWarning = useSelector(selectSessionWarning);
  const sessionWarningToExpire = useSelector((state: any) => state.app.sessionWarningToExpire);
  const user = useSelector(selectUser);
  const { refreshSession, isAuthenticated } = useContext(AuthContext) || {};
  const { success, confirm, closeAlert, isOpen, config, handleConfirm } = useAlert();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Handle session expiration

  if(sessionWarningToExpire) {
    dispatch(setSessionWarningToExpire(false));
    confirm(
      'Session Expiring Soon',
      'Your session is about to expire. Please extend it to continue using the application.',
      async () => {
        try {
          if (refreshSession) {
            await refreshSession();
          }
          dispatch(setSessionWarning(false));
          closeAlert();
          success('Session Extended', 'Your session has been extended successfully!');
        } catch (error) {
          console.error('Session refresh failed:', error);
          closeAlert();
        }
      }
    );

  }

  if (sessionWarning){
    confirm(
      'Session Warning',
      'Your session is about to expire. Please extend it to continue using the application.',
      async () => {
        try {
          if (refreshSession) {
            await refreshSession();
          }
          dispatch(setSessionWarning(false));
          closeAlert();
          success('Session Extended', 'Your session has been extended successfully!');
        } catch (error) {
          console.error('Session refresh failed:', error);
          closeAlert();
        }
      }
    );
  }
  
  
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