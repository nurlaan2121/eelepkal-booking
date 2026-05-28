import React, { useEffect, useRef } from 'react';
import { X, Store, ExternalLink, Lightbulb, ArrowRight } from 'lucide-react';

interface ClaimVenueModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ClaimVenueModal: React.FC<ClaimVenueModalProps> = ({ isOpen, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === overlayRef.current) {
            onClose();
        }
    };

    const handleAdminLinkClick = () => {
        window.open('https://admin.eelepkal.com/auth/login', '_blank', 'noopener,noreferrer');
    };

    if (!isOpen) return null;

    return (
        <div 
            ref={overlayRef}
            style={styles.overlay} 
            onClick={handleOverlayClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="claim-modal-title"
        >
            <div 
                ref={modalRef}
                style={styles.modal}
                onClick={e => e.stopPropagation()}
            >
                <div style={styles.header}>
                    <div style={styles.headerIcon}>
                        <Store size={28} color="#FF9800" strokeWidth={2} />
                    </div>
                    <button 
                        onClick={onClose} 
                        style={styles.closeBtn}
                        aria-label="Закрыть"
                    >
                        <X size={24} color="#757575" />
                    </button>
                </div>

                <h2 id="claim-modal-title" style={styles.title}>
                    Это ваше заведение?
                </h2>

                <p style={styles.description}>
                    Если это ваше заведение, сначала необходимо подтвердить владение. Для этого выполните следующие шаги:
                </p>

                <div style={styles.stepsContainer}>
                    <div style={styles.step}>
                        <div style={styles.stepNumber}>1</div>
                        <div style={styles.stepContent}>
                            <div style={styles.stepTitle}>Перейдите в панель управления</div>
                            <p style={styles.stepDescription}>
                                Откройте административную панель Ээлеп кал
                            </p>
                            <button 
                                onClick={handleAdminLinkClick}
                                style={styles.adminLinkButton}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 152, 0, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 152, 0, 0.2)';
                                }}
                            >
                                <ExternalLink size={16} />
                                <span>Перейти в панель управления</span>
                            </button>
                        </div>
                    </div>

                    <div style={styles.step}>
                        <div style={styles.stepNumber}>2</div>
                        <div style={styles.stepContent}>
                            <div style={styles.stepTitle}>Войдите в аккаунт</div>
                            <p style={styles.stepDescription}>
                                Используйте данные администратора. Если аккаунта нет — пройдите регистрацию
                            </p>
                        </div>
                    </div>

                    <div style={styles.step}>
                        <div style={styles.stepNumber}>3</div>
                        <div style={styles.stepContent}>
                            <div style={styles.stepTitle}>Отправьте запрос</div>
                            <p style={styles.stepDescription}>
                                После входа в панели управления в самом низу будет кнопка <strong>"Отправить запрос"</strong>. Вставьте ссылку вашей страницы заведения и отправьте заявку
                            </p>
                        </div>
                    </div>

                    <div style={styles.step}>
                        <div style={styles.stepNumber}>4</div>
                        <div style={styles.stepContent}>
                            <div style={styles.stepTitle}>Получите доступ</div>
                            <p style={styles.stepDescription}>
                                После проверки мы свяжемся с вами и предоставим полный доступ к управлению заведением
                            </p>
                        </div>
                    </div>
                </div>

                <div style={styles.infoBox}>
                    <div style={styles.infoItem}>
                        <Lightbulb size={18} color="#FF9800" />
                        <div>
                            <div style={styles.infoTitle}>Уже есть аккаунт?</div>
                            <p style={styles.infoDescription}>Просто войдите в систему</p>
                        </div>
                    </div>
                    <div style={styles.divider} />
                    <div style={styles.infoItem}>
                        <Lightbulb size={18} color="#FF9800" />
                        <div>
                            <div style={styles.infoTitle}>Нет аккаунта?</div>
                            <p style={styles.infoDescription}>Зарегистрируйтесь и отправьте заявку</p>
                        </div>
                    </div>
                </div>

                <div style={styles.footer}>
                    <button 
                        onClick={onClose}
                        style={styles.closeModalBtn}
                    >
                        Закрыть
                    </button>
                    <button 
                        onClick={handleAdminLinkClick}
                        style={styles.adminButton}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 152, 0, 0.35)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 152, 0, 0.25)';
                        }}
                    >
                        <span>Перейти в админку</span>
                        <ArrowRight size={18} />
                    </button>
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
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '20px',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.2s ease-out',
    },
    modal: {
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        padding: '28px 24px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '20px',
    },
    headerIcon: {
        width: '56px',
        height: '56px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(255, 152, 0, 0.15)',
    },
    closeBtn: {
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        padding: '8px',
        borderRadius: '12px',
        transition: 'background-color 0.2s',
    },
    title: {
        fontSize: '26px',
        fontWeight: '800',
        color: '#1A1A1A',
        margin: '0 0 12px 0',
        letterSpacing: '-0.02em',
    },
    description: {
        fontSize: '15px',
        color: '#616161',
        margin: '0 0 24px 0',
        lineHeight: '1.6',
    },
    stepsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '24px',
    },
    step: {
        display: 'flex',
        gap: '16px',
        padding: '16px',
        backgroundColor: '#FAFAFA',
        borderRadius: '16px',
        border: '1px solid #F0F0F0',
        transition: 'all 0.2s',
    },
    stepNumber: {
        width: '36px',
        height: '36px',
        borderRadius: '10px',
        background: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        fontWeight: '800',
        flexShrink: 0,
    },
    stepContent: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    stepTitle: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#212121',
    },
    stepDescription: {
        fontSize: '14px',
        color: '#757575',
        margin: 0,
        lineHeight: '1.5',
    },
    adminLinkButton: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 16px',
        background: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
        border: 'none',
        borderRadius: '10px',
        color: '#FFFFFF',
        fontSize: '13px',
        fontWeight: '700',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(255, 152, 0, 0.2)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        marginTop: '8px',
        alignSelf: 'flex-start',
    },
    infoBox: {
        background: 'linear-gradient(135deg, #FFF7ED 0%, #FFFBF5 100%)',
        border: '1px solid rgba(255, 152, 0, 0.15)',
        borderRadius: '16px',
        padding: '16px',
        marginBottom: '24px',
    },
    infoItem: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '8px 0',
    },
    infoTitle: {
        fontSize: '14px',
        fontWeight: '700',
        color: '#212121',
        marginBottom: '2px',
    },
    infoDescription: {
        fontSize: '13px',
        color: '#757575',
        margin: 0,
    },
    divider: {
        height: '1px',
        backgroundColor: 'rgba(255, 152, 0, 0.15)',
        margin: '8px 0',
    },
    footer: {
        display: 'flex',
        gap: '12px',
        paddingTop: '8px',
    },
    closeModalBtn: {
        flex: 1,
        padding: '14px 24px',
        backgroundColor: '#F5F5F5',
        border: 'none',
        borderRadius: '14px',
        color: '#424242',
        fontSize: '15px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    adminButton: {
        flex: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '14px 24px',
        background: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
        border: 'none',
        borderRadius: '14px',
        color: '#FFFFFF',
        fontSize: '15px',
        fontWeight: '700',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(255, 152, 0, 0.25)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
};

export default ClaimVenueModal;
