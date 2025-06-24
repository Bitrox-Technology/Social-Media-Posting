// src/components/AuthProvider.tsx
import React, { createContext, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useCheckAuthStatusQuery,
  useRefreshAuthMutation,
  useGetCsrfTokenQuery,
  useValidateSessionQuery,
} from '../../store/api';
import {
  setUser,
  clearUser,
  setCsrfToken,
  clearCsrfToken,
} from '../../store/appSlice';
import { RootState } from '../../store';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

interface AuthContextType {
  isAuthenticated: boolean;
  refreshSession: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector((state: RootState) => !!state.app.user?.authenticate);
  const [refreshAuth] = useRefreshAuthMutation();

  const publicRoutes = [
    '/',
    '/home',
    '/about',
    '/services',
    '/pricing',
    '/features',
    '/signin',
    '/signup',
    '/forgot-password',
    
  ];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  const {
    data: authData,
    error: authError,
    isLoading: authLoading,
  } = useCheckAuthStatusQuery(undefined, {
    skip: isPublicRoute,
    pollingInterval: 10 * 60 * 1000, // 10 minutes
  });

  const { data: csrfData, error: csrfError } = useGetCsrfTokenQuery();

  const { data: sessionData, error: sessionError } = useValidateSessionQuery(undefined, {
    skip: isPublicRoute,
    pollingInterval: 10 * 60 * 1000,
  });



  // Handle auth status
  useEffect(() => {
    if (authData?.success && authData.data.isAuthenticated) {
      dispatch(
        setUser({
          email: authData.data.user.email,
          expiresAt: authData.data.user.expiresAt,
          role: authData.data.user.role,
          authenticate: true,
        })
      );
    }
  }, [authData, authError, authLoading, isPublicRoute, dispatch, navigate]);

  // Handle CSRF token
  useEffect(() => {
    if (csrfData?.success) {
      dispatch(
        setCsrfToken({
          token: csrfData.data.csrfToken,
          expiresAt: csrfData.data.expiresAt,
        })
      );
    }
  }, [csrfData, csrfError, dispatch]);

  // Handle session validation
  useEffect(() => {
    if (sessionData?.success && sessionData.data.sessionValid) {
      dispatch(
        setUser({
          email: sessionData.data.user.email,
          expiresAt: sessionData.data.user.expiresAt,
          role: sessionData.data.user.role,
          authenticate: true,
        })
      );
    }
  }, []);

  // Handle cross-tab communication
  useEffect(() => {
    const authChannel = new BroadcastChannel('auth_channel');
    authChannel.onmessage = (event) => {
      if (event.data.type === 'CSRF_UPDATE') {
        dispatch(setCsrfToken(event.data.payload));
      } else if (event.data.type === 'AUTH_REFRESH') {
        dispatch(setUser({ ...event.data.payload, authenticate: true }));
      } else if (event.data.type === 'LOGOUT') {
        dispatch(clearUser());
        dispatch(clearCsrfToken());
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        if (!isPublicRoute) navigate('/signin', { replace: true });
      }
    };
    return () => authChannel.close();
  }, [dispatch, navigate, isPublicRoute]);

  // Refresh session
  const refreshSession = useCallback(async () => {
    try {
      const response = await refreshAuth().unwrap();
      if (response.success) {
        dispatch(
          setUser({
            email: response.data.email,
            expiresAt: response.data.sessionExpiry,
            role: response.data.role,
            authenticate: true,
          })
        );
        dispatch(
          setCsrfToken({
            token: response.data.csrfToken,
            expiresAt: response.data.csrfExpiresAt,
          })
        );
        // Broadcast refresh event
        const authChannel = new BroadcastChannel('auth_channel');
        authChannel.postMessage({
          type: 'AUTH_REFRESH',
          payload: {
            email: response.data.email,
            expiresAt: response.data.sessionExpiry,
            role: response.data.role,
          },
        });
        authChannel.close();
      } else {
        console.error('Session refresh failed:', response.message);
      } 
    } catch (err) {
      dispatch(clearUser());
      dispatch(clearCsrfToken());
      throw err;
    }
  }, [refreshAuth, dispatch, navigate]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;  