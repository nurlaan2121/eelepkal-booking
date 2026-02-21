import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavigation from '../components/Navigation/BottomNavigation';

const MainLayout: React.FC = () => {
    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>ElevAuto</h1>
            </header>

            <main style={styles.main}>
                <Outlet />
            </main>

            <BottomNavigation />
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        paddingBottom: '80px', // Space for bottom nav
    },
    header: {
        padding: '16px 20px',
        borderBottom: '1px solid #F5F5F5',
        backgroundColor: '#FFFFFF',
        position: 'sticky',
        top: 0,
        zIndex: 900,
    },
    title: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#000000',
        margin: 0,
    },
    main: {
        flex: 1,
        overflowY: 'auto',
    },
};

export default MainLayout;
