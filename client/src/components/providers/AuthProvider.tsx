import React, { createContext, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCheckAuthStatusQuery, useRefreshAuthMutation, useGetCsrfTokenQuery, useValidateSessionQuery } from '../../store/api';
import { setUser, clearUser, setCsrfToken, clearCsrfToken } from '../../store/appSlice';
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
    const user = useSelector((state: RootState) => state.app.user);
    const [refreshAuth] = useRefreshAuthMutation();

    // Define public routes that don’t require authentication
    const publicRoutes = [
        '/',
        '/home',
        '/about',
        '/services',
        '/pricing',
        '/features',
    ];
    const isPublicRoute = publicRoutes.includes(location.pathname);

    // Only check auth status for non-public routes
    const { data: authData, error: authError, isLoading } = useCheckAuthStatusQuery(undefined, {
        skip: isPublicRoute,
        pollingInterval: 10 * 60 * 1000, // Every 10 minutes
    });

    // Fetch CSRF token for all routes
    const { data: csrfData, error: csrfError } = useGetCsrfTokenQuery(undefined);

    const {data: sessionData, error: sessionError} = useValidateSessionQuery(undefined, {
        skip: isPublicRoute,
        pollingInterval: 10 * 60 * 1000, // Every 10 minutes
    });

    useEffect(() => {
        if (authError && !isPublicRoute && !isLoading) {
            console.log('Auth error detected, clearing state and redirecting to /signin');
            dispatch(clearUser());
            dispatch(clearCsrfToken());
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            navigate('/signin', { replace: true, state: { from: location.pathname } });
        } else if (authData?.success && authData.data.isAuthenticated) {
            console.log('Setting user in Redux:', authData.data.user);
            dispatch(
                setUser({
                    email: authData.data.user.email,
                    expiresAt: authData.data.user.expiresAt,
                    role: authData.data.user.role,
                    authenticate: authData.data.isAuthenticated,
                })
            );
        }
    }, [authData, authError, isLoading, dispatch, navigate, isPublicRoute, location.pathname]);

    useEffect(() => {
        if (csrfError) {
            console.error('CSRF token fetch failed:', csrfError);
            dispatch(clearCsrfToken());
        } else if (csrfData?.success) {
            console.log('Setting CSRF token in Redux:', csrfData.data);
            dispatch(
                setCsrfToken({
                    token: csrfData.data.csrfToken,
                    expiresAt: csrfData.data.expiresAt,
                })
            );
        }
    }, [csrfData, csrfError, dispatch]);

    
    useEffect(() => {
        if (sessionError) {
            console.error('Session validation failed:', sessionError);
        } else if (sessionData?.success && sessionData.data.isValid) {
            console.log('Session is valid:', sessionData.data);
        }
    }, [sessionData, sessionError, dispatch, navigate, isPublicRoute, location.pathname]);


    useEffect(() => {
        const authChannel = new BroadcastChannel('auth_channel');
        authChannel.onmessage = (event) => {
            console.log('BroadcastChannel event:', event.data);
            if (event.data.type === 'CSRF_UPDATE') {
                dispatch(
                    setCsrfToken({
                        token: event.data.payload.csrfToken,
                        expiresAt: event.data.payload.expiresAt,
                    })
                );
            } else if (event.data.type === 'AUTH_REFRESH') {
                dispatch(
                    setUser({
                        email: event.data.payload.email,
                        expiresAt: event.data.payload.expiresAt,
                        role: event.data.payload.role,
                        authenticate: true,
                    })
                );
            } else if (event.data.type === 'LOGOUT') {
                dispatch(clearUser());
                dispatch(clearCsrfToken());
                Cookies.remove('userInfo');
                Cookies.remove('accessToken');
                Cookies.remove('refreshToken');
                if (!isPublicRoute) {
                    console.log('Redirecting to /signin due to logout event');
                    navigate('/signin', { replace: true, state: { from: location.pathname } });
                }
            }
        };
        return () => authChannel.close();
    }, [dispatch, navigate, isPublicRoute]);

    const refreshSession = useCallback(async () => {
        console.log('Attempting to refresh session');
        try {
            const response = await refreshAuth().unwrap();
            console.log('Refresh session response:', response);
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
            }
        } catch (error) {
            console.error('Refresh session failed:', error);
            dispatch(clearUser());
            dispatch(clearCsrfToken());
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            if (!isPublicRoute) {
                console.log('Redirecting to /signin due to refresh failure');
                navigate('/signin', { replace: true, state: { from: location.pathname } });
            }
        }
    }, [refreshAuth, dispatch, navigate, isPublicRoute, location.pathname]);
    return (
        <AuthContext.Provider value={{ isAuthenticated, refreshSession }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;