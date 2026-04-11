import React from 'react';
import { BookingKind } from '../../../api/dto/bookingDto';

interface BookingTabsProps {
    activeTab: BookingKind;
    onChange: (kind: BookingKind) => void;
}

const BookingTabs: React.FC<BookingTabsProps> = ({ activeTab, onChange }) => {
    return (
        <div style={styles.container}>
            <button
                style={{
                    ...styles.tab,
                    ...(activeTab === BookingKind.ACTIVE ? styles.activeTab : {}),
                }}
                onClick={() => onChange(BookingKind.ACTIVE)}
            >
                Активные
            </button>
            <button
                style={{
                    ...styles.tab,
                    ...(activeTab === BookingKind.HISTORY ? styles.activeTab : {}),
                }}
                onClick={() => onChange(BookingKind.HISTORY)}
            >
                История
            </button>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        backgroundColor: '#F5F5F5',
        borderRadius: '12px',
        padding: '4px',
        marginBottom: '20px',
    },
    tab: {
        flex: 1,
        padding: '10px 0',
        border: 'none',
        borderRadius: '8px',
        backgroundColor: 'transparent',
        fontSize: '14px',
        fontWeight: '600',
        color: '#757575',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    activeTab: {
        backgroundColor: '#FFFFFF',
        color: '#FF9800',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
};

export default BookingTabs;
