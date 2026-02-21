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
                    style={({ isActive }) => ({
                        ...styles.navItem,
                        color: isActive ? '#FF9800' : '#757575',
                    })}
                >
                    <item.icon size={24} />
                    <span style={styles.label}>{item.label}</span>
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
        backgroundColor: '#FFFFFF',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTop: '1px solid #E0E0E0',
        paddingBottom: 'env(safe-area-inset-bottom)',
        zIndex: 1000,
    },
    navItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none',
        gap: '4px',
        flex: 1,
    },
    label: {
        fontSize: '12px',
        fontWeight: '500',
    },
};

export default BottomNavigation;
