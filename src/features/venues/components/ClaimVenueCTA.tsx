import React from 'react';
import { Store, ArrowRight, CheckCircle } from 'lucide-react';

interface ClaimVenueCTAProps {
    onOpenModal: () => void;
}

const ClaimVenueCTA: React.FC<ClaimVenueCTAProps> = ({ onOpenModal }) => {
    return (
        <div style={styles.container}>
            <div style={styles.glow} />
            
            <div style={styles.content}>
                <div style={styles.iconWrapper}>
                    <div style={styles.iconBg}>
                        <Store size={32} color="#FF9800" strokeWidth={2} />
                    </div>
                </div>

                <h2 style={styles.title}>Владеете этим заведением?</h2>
                <p style={styles.description}>
                    Управляйте бронированиями, меню и настройками заведения через Ээлеп кал
                </p>

                <button 
                    onClick={onOpenModal}
                    style={styles.button}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 12px 32px rgba(255, 152, 0, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 152, 0, 0.3)';
                    }}
                >
                    <span style={styles.buttonText}>Это моё заведение</span>
                    <ArrowRight size={20} color="#FFFFFF" />
                </button>

                <div style={styles.features}>
                    <div style={styles.featureItem}>
                        <CheckCircle size={16} color="#FF9800" />
                        <span style={styles.featureText}>Управление бронированиями</span>
                    </div>
                    <div style={styles.featureItem}>
                        <CheckCircle size={16} color="#FF9800" />
                        <span style={styles.featureText}>Обновление меню</span>
                    </div>
                    <div style={styles.featureItem}>
                        <CheckCircle size={16} color="#FF9800" />
                        <span style={styles.featureText}>Аналитика и статистика</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        position: 'relative',
        margin: '32px 0',
        borderRadius: '24px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #FFF7ED 0%, #FFFBF5 50%, #FFF5EB 100%)',
        border: '1px solid rgba(255, 152, 0, 0.15)',
        boxShadow: '0 8px 32px rgba(255, 152, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04)',
    },
    glow: {
        position: 'absolute',
        top: '-50%',
        right: '-20%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(255, 152, 0, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
    },
    content: {
        position: 'relative',
        zIndex: 1,
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
    },
    iconWrapper: {
        marginBottom: '4px',
    },
    iconBg: {
        width: '72px',
        height: '72px',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(255, 152, 0, 0.15)',
    },
    title: {
        fontSize: '24px',
        fontWeight: '800',
        color: '#1A1A1A',
        margin: 0,
        textAlign: 'center',
        letterSpacing: '-0.02em',
    },
    description: {
        fontSize: '15px',
        color: '#616161',
        margin: 0,
        textAlign: 'center',
        lineHeight: '1.6',
        maxWidth: '480px',
    },
    button: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '16px 32px',
        background: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
        border: 'none',
        borderRadius: '16px',
        color: '#FFFFFF',
        fontSize: '16px',
        fontWeight: '700',
        cursor: 'pointer',
        boxShadow: '0 8px 24px rgba(255, 152, 0, 0.3)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        marginTop: '8px',
    },
    buttonText: {
        letterSpacing: '0.02em',
    },
    features: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginTop: '8px',
        width: '100%',
        maxWidth: '320px',
    },
    featureItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 12px',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: '10px',
        backdropFilter: 'blur(8px)',
    },
    featureText: {
        fontSize: '14px',
        color: '#424242',
        fontWeight: '600',
    },
};

export default ClaimVenueCTA;
