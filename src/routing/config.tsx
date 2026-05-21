import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginForm from '../features/auth/LoginForm';
import RegistrationForm from '../features/auth/RegistrationForm';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from '../shared/layouts/MainLayout';
import HomeScreen from '../features/home/HomeScreen';
import SearchScreen from '../features/search/SearchScreen';
import VenueDetailsPage from '../features/venues/VenueDetailsPage';
import BookingListScreen from '../features/booking/BookingListScreen';
import BookingDetailsPage from '../features/booking/BookingDetailsPage';

import ProfileScreen from '../features/profile/ProfileScreen';
import FavoritesScreen from '../features/favorites/FavoritesScreen';
import ErrorBoundary from '../components/ui/ErrorBoundary';

const RootErrorBoundary = () => (
    <ErrorBoundary>
        <MainLayout />
    </ErrorBoundary>
);

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
        element: <RootErrorBoundary />,
        errorElement: <ErrorBoundary />,
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
                path: '/venue/:id',
                element: <VenueDetailsPage />,
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: '/booking',
                        element: <BookingListScreen />,
                    },
                    {
                        path: '/booking/:id',
                        element: <BookingDetailsPage />,
                    },
                    {
                        path: '/favorites',
                        element: <FavoritesScreen />,
                    },
                    {
                        path: '/profile',
                        element: <ProfileScreen />,
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
