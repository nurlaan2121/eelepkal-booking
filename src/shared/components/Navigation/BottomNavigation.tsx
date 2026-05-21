import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Calendar, Heart, User } from 'lucide-react';
import { useAuthStore } from '../../../features/auth/authStore';
import AuthGuardModal from '../../../features/auth/components/AuthGuardModal';

const BottomNavigation: React.FC = () => {
    const { isAuthenticated } = useAuthStore();
    const [isGuardOpen, setIsGuardOpen] = React.useState(false);
    const [pendingPath, setPendingPath] = React.useState<string | null>(null);

    const navItems = [
        { path: '/venues', icon: Home, label: 'Главная', protected: false },
        { path: '/search', icon: Search, label: 'Поиск', protected: false },
        { path: '/booking', icon: Calendar, label: 'Бронь', protected: true },
        { path: '/favorites', icon: Heart, label: 'Избранное', protected: true },
        { path: '/profile', icon: User, label: 'Профиль', protected: true },
    ];

    const handleNavClick = (e: React.MouseEvent, path: string, isProtected: boolean) => {
        if (isProtected && !isAuthenticated) {
            e.preventDefault();
            e.stopPropagation();
            setPendingPath(path);
            setIsGuardOpen(true);
            return;
        }
    };

    const getGuardMessage = () => {
        if (pendingPath === '/profile') return "Войдите, чтобы просмотреть свой профиль.";
        if (pendingPath === '/favorites') return "Войдите, чтобы просмотреть сохраненные заведения.";
        if (pendingPath === '/booking') return "Войдите, чтобы управлять вашими бронированиями.";
        return "Пожалуйста, войдите в систему, чтобы продолжить.";
    };

    return (
        <nav style={styles.nav}>
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={(e) => handleNavClick(e, item.path, item.protected)}
                    style={{ textDecoration: 'none', flex: 1, display: 'flex', justifyContent: 'center' }}
                >
                    {({ isActive }) => (
                        <div style={{
                            ...styles.navItem,
                            color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                        }}>
                            <div style={{
                                ...styles.iconWrapper,
                                backgroundColor: isActive ? 'var(--color-primary-alpha)' : 'transparent',
                            }}>
                                <item.icon
                                    size={24}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                            </div>
                            <span style={{
                                ...styles.label,
                                fontWeight: isActive ? 700 : 500,
                            }}>{item.label}</span>
                        </div>
                    )}
                </NavLink>
            ))}

            <AuthGuardModal
                isOpen={isGuardOpen}
                onClose={() => setIsGuardOpen(false)}
                message={getGuardMessage()}
            />
        </nav>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    nav: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '65px',
        backgroundColor: 'var(--color-surface)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTop: '1px solid var(--color-border)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        zIndex: 1000,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.02)',
    },
    navItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        width: '100%',
        transition: 'all 0.2s ease',
    },
    iconWrapper: {
        padding: '4px 16px',
        borderRadius: '16px',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: '11px',
        transition: 'all 0.2s ease',
    },
};

export default BottomNavigation;
