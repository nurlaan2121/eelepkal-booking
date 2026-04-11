import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavigation from '../components/Navigation/BottomNavigation';
import Footer from '../components/Footer/Footer';
import { MapPin } from 'lucide-react';

const MainLayout: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div style={styles.container}>
            <header style={{
                ...styles.header,
                boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
                borderBottomColor: scrolled ? 'transparent' : 'var(--color-border)'
            }}>
                <div style={styles.logoWrapper}>
                    <div style={styles.iconCircle}>
                        <MapPin size={20} color="#FFFFFF" />
                    </div>
                    <h1 style={styles.title}>Ээлеп кал</h1>
                </div>
            </header>

            <main style={styles.main}>
                <Outlet />
            </main>

            <Footer />
            <BottomNavigation />
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg)',
        paddingBottom: '65px', // Space for bottom nav
    },
    header: {
        padding: '12px 20px',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 900,
        transition: 'all var(--transition-base)',
        display: 'flex',
        alignItems: 'center',
    },
    logoWrapper: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    iconCircle: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: 'var(--color-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-sm)',
    },
    title: {
        fontSize: '22px',
        fontWeight: '800',
        color: 'var(--color-text)',
        margin: 0,
        letterSpacing: '-0.5px',
    },
    main: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-bg)',
    },
};

export default MainLayout;
