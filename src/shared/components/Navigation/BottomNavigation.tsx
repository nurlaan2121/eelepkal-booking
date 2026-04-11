import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Calendar, Heart, User } from 'lucide-react';

const BottomNavigation: React.FC = () => {
    const navItems = [
        { path: '/venues', icon: Home, label: 'Главная' },
        { path: '/search', icon: Search, label: 'Поиск' },
        { path: '/booking', icon: Calendar, label: 'Бронь' },
        { path: '/favorites', icon: Heart, label: 'Избранное' },
        { path: '/profile', icon: User, label: 'Профиль' },
    ];

    return (
        <nav style={styles.nav}>
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
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
