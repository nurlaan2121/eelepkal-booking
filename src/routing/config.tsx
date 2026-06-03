import { createBrowserRouter, Navigate } from 'react-router-dom';
import React from 'react';
import AuthPage from '../features/auth/pages/AuthPage';
import OtpVerification from '../features/auth/pages/OtpVerification';
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

// SEO Landing Pages — lazy loaded for performance
const RestaurantsBishkekPage = React.lazy(() => import('../features/seo/RestaurantsBishkekPage'));
const CafeBishkekPage = React.lazy(() => import('../features/seo/CafeBishkekPage'));
const ChayhanaBishkekPage = React.lazy(() => import('../features/seo/ChayhanaBishkekPage'));
const LoungeBishkekPage = React.lazy(() => import('../features/seo/LoungeBishkekPage'));
const CabinsBishkekPage = React.lazy(() => import('../features/seo/CabinsBishkekPage'));

const SeoPageSuspense: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <React.Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: '#757575' }}>Загрузка...</div>}>
        {children}
    </React.Suspense>
);

const RootErrorBoundary = () => (
    <ErrorBoundary>
        <MainLayout />
    </ErrorBoundary>
);

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <AuthPage />,
    },
    {
        path: '/register',
        element: <AuthPage />,
    },
    {
        path: '/otp-verify',
        element: <OtpVerification />,
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
            // SEO Category Landing Pages
            {
                path: '/restaurants-bishkek',
                element: <SeoPageSuspense><RestaurantsBishkekPage /></SeoPageSuspense>,
            },
            {
                path: '/cafe-bishkek',
                element: <SeoPageSuspense><CafeBishkekPage /></SeoPageSuspense>,
            },
            {
                path: '/chayhana-bishkek',
                element: <SeoPageSuspense><ChayhanaBishkekPage /></SeoPageSuspense>,
            },
            {
                path: '/lounge-bishkek',
                element: <SeoPageSuspense><LoungeBishkekPage /></SeoPageSuspense>,
            },
            {
                path: '/cabins-bishkek',
                element: <SeoPageSuspense><CabinsBishkekPage /></SeoPageSuspense>,
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
