// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../store/appSlice';
import { useCheckAuthStatusQuery } from '../../store/api';

const ProtectedRoute: React.FC = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { isLoading } = useCheckAuthStatusQuery();

  if (isLoading) {
    return <div>Loading...</div>; // Replace with a proper loading component
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;