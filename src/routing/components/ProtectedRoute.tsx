import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/authStore';

const ProtectedRoute: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuthStore();

    if (isLoading) {
        return <div>Loading...</div>; // Minimal UI as requested
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
