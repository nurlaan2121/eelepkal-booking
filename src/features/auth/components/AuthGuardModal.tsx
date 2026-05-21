import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, LogIn } from 'lucide-react';

interface AuthGuardModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
}

const AuthGuardModal: React.FC<AuthGuardModalProps> = ({
    isOpen,
    onClose,
    title = "Требуется авторизация",
    message = "Пожалуйста, войдите в систему, чтобы продолжить это действие."
}) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                <button style={styles.closeButton} onClick={onClose}>
                    <X size={24} />
                </button>

                <div style={styles.content}>
                    <div style={styles.iconContainer}>
                        <LogIn size={48} color="#FF9800" />
                    </div>
                    <h2 style={styles.title}>{title}</h2>
                    <p style={styles.message}>{message}</p>

                    <div style={styles.actions}>
                        <button
                            style={styles.loginButton}
                            onClick={() => navigate('/login')}
                        >
                            Войти в аккаунт
                        </button>
                        <button
                            style={styles.cancelButton}
                            onClick={onClose}
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)',
    },
    modal: {
        backgroundColor: '#FFF',
        borderRadius: '24px',
        width: '90%',
        maxWidth: '400px',
        padding: '32px',
        position: 'relative',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    },
    closeButton: {
        position: 'absolute',
        top: '16px',
        right: '16px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#757575',
    },
    content: {
        textAlign: 'center',
    },
    iconContainer: {
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'center',
    },
    title: {
        fontSize: '22px',
        fontWeight: '700',
        color: '#212121',
        marginBottom: '12px',
    },
    message: {
        fontSize: '16px',
        color: '#757575',
        marginBottom: '32px',
        lineHeight: '1.5',
    },
    actions: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    loginButton: {
        backgroundColor: '#FF9800',
        color: '#FFF',
        border: 'none',
        borderRadius: '16px',
        padding: '16px',
        fontSize: '16px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    cancelButton: {
        backgroundColor: 'transparent',
        color: '#757575',
        border: 'none',
        padding: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
    }
};

export default AuthGuardModal;
