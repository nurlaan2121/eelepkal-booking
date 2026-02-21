import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginForm from '../features/auth/LoginForm';
import RegistrationForm from '../features/auth/RegistrationForm';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from '../shared/layouts/MainLayout';
import HomeScreen from '../features/home/HomeScreen';
import SearchScreen from '../features/search/SearchScreen';

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginForm />,
    },
    {
        path: '/register',
        element: <RegistrationForm />,
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    {
                        path: '/venues',
                        element: <HomeScreen />,
                    },
                    {
                        path: '/search',
                        element: <SearchScreen />,
                    },
                    {
                        path: '/booking',
                        element: <div style={{ padding: 20 }}>Bookings (Placeholder)</div>,
                    },
                    {
                        path: '/favorites',
                        element: <div style={{ padding: 20 }}>Favorites (Placeholder)</div>,
                    },
                    {
                        path: '/profile',
                        element: <div style={{ padding: 20 }}>Profile (Placeholder)</div>,
                    },
                ],
            },
        ],
    },
    {
        path: '/',
        element: <Navigate to="/venues" replace />,
    },
    {
        path: '*',
        element: <Navigate to="/venues" replace />,
    },
]);
