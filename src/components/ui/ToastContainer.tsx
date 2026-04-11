import React from 'react';
import { useToastStore } from '../../store/useToastStore';

const ToastContainer: React.FC = () => {
    const { toasts } = useToastStore();

    if (toasts.length === 0) return null;

    return (
        <div style={styles.container}>
            {toasts.map((toast) => (
                <div key={toast.id} style={{
                    ...styles.toast,
                    backgroundColor: toast.type === 'error' ? '#F44336' : '#212121',
                }}>
                    {toast.message}
                </div>
            ))}
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        position: 'fixed',
        bottom: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        pointerEvents: 'none',
    },
    toast: {
        color: '#FFFFFF',
        padding: '12px 24px',
        borderRadius: '24px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        animation: 'slideUp 0.3s ease-out',
        textAlign: 'center',
    }
};

export default ToastContainer;
