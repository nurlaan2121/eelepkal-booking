import React, { useState, useEffect, useCallback } from 'react';
import { X, Bell, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import { clientNotificationService } from '../../api/services/notificationService';
import { ClientNotification } from '../../api/dto/notificationDto';
import { translateNotificationType, formatNotificationDate } from '../../shared/utils/dateFormatter';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<ClientNotification[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Load notifications on first open
  useEffect(() => {
    if (isOpen && !hasLoaded) {
      fetchNotifications();
      setHasLoaded(true);
    }
  }, [isOpen]);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await clientNotificationService.getNotifications(selectedDate);
      setNotifications(data);
    } catch (err: any) {
      console.error('Failed to fetch notifications:', err);
      setError(err.response?.data?.message || 'Не удалось загрузить уведомления');
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleShowNotifications = () => {
    fetchNotifications();
  };

  const formatDateTime = (dateValue: number | string) => {
    return formatNotificationDate(dateValue);
  };

  const getNotificationTypeBadge = (type: string) => {
    const translatedType = translateNotificationType(type);
    const typeMap: Record<string, { color: string; bgColor: string }> = {
      'АКЦИЯ': { color: '#E65100', bgColor: '#FFF3E0' },
      'ИНФО': { color: '#1565C0', bgColor: '#E3F2FD' },
      'БРОНЬ': { color: '#2E7D32', bgColor: '#E8F5E9' },
      'СИСТЕМА': { color: '#6A1B9A', bgColor: '#F3E5F5' },
      'ВАЖНО': { color: '#C62828', bgColor: '#FFEBEE' },
      'ОТМЕНЕНО': { color: '#C62828', bgColor: '#FFEBEE' },
      'ПОДТВЕРЖДЕНО': { color: '#2E7D32', bgColor: '#E8F5E9' },
      'В ОЖИДАНИИ': { color: '#F57C00', bgColor: '#FFF3E0' },
      'ОТКЛОНЕНО': { color: '#C62828', bgColor: '#FFEBEE' },
    };

    const config = typeMap[translatedType] || { color: '#424242', bgColor: '#F5F5F5' };
    
    return (
      <span style={{
        ...styles.badge,
        color: config.color,
        backgroundColor: config.bgColor,
      }}>
        {translatedType}
      </span>
    );
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div 
        style={{
          ...styles.modal,
          ...(isMobile ? styles.modalMobile : styles.modalDesktop)
        }} 
        onClick={e => e.stopPropagation()}
      >
        {/* Mobile Handle Bar */}
        {isMobile && <div style={styles.mobileHandleBar} />}
        
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <Bell size={24} color="#FF9800" />
            <h2 style={styles.title}>Уведомления</h2>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={24} />
          </button>
        </div>

        {/* Date Picker */}
        <div style={styles.dateSection}>
          <div style={styles.datePickerWrapper}>
            <Calendar size={18} color="#757575" />
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              style={styles.dateInput}
            />
          </div>
          <button
            onClick={handleShowNotifications}
            disabled={isLoading}
            style={{
              ...styles.fetchButton,
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Загрузка...
              </>
            ) : (
              'Показать уведомления'
            )}
          </button>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {isLoading && notifications.length === 0 ? (
            // Loading State
            <div style={styles.loadingContainer}>
              <Loader2 size={40} color="#FF9800" className="animate-spin" />
              <p style={styles.loadingText}>Загрузка уведомлений...</p>
            </div>
          ) : error ? (
            // Error State
            <div style={styles.errorContainer}>
              <AlertCircle size={48} color="#F44336" />
              <p style={styles.errorText}>{error}</p>
              <button onClick={fetchNotifications} style={styles.retryButton}>
                Повторить
              </button>
            </div>
          ) : notifications.length === 0 ? (
            // Empty State
            <div style={styles.emptyContainer}>
              <Bell size={64} color="#BDBDBD" />
              <h3 style={styles.emptyTitle}>Уведомлений нет</h3>
              <p style={styles.emptySubtitle}>
                За выбранную дату уведомления отсутствуют
              </p>
            </div>
          ) : (
            // Notifications List
            <div style={styles.notificationsList}>
              {notifications.map((notification) => (
                <div key={notification.notificationId} style={styles.notificationCard}>
                  <div style={styles.notificationHeader}>
                    <h4 style={styles.notificationTitle}>{notification.title}</h4>
                    {getNotificationTypeBadge(notification.notificationType)}
                  </div>
                  <p style={styles.notificationDescription}>{notification.description}</p>
                  <div style={styles.notificationFooter}>
                    <span style={styles.notificationDate}>
                      {formatDateTime(notification.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
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
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 2000,
    backdropFilter: 'blur(4px)',
    padding: '0',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxHeight: '90vh',
    borderRadius: '24px 24px 0 0',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.2)',
    animation: 'slideUp 0.3s ease-out',
  },
  modalMobile: {
    maxHeight: '85vh',
    borderRadius: '24px 24px 0 0',
  },
  mobileHandleBar: {
    width: '40px',
    height: '4px',
    backgroundColor: '#E0E0E0',
    borderRadius: '2px',
    margin: '12px auto 0',
  },
  modalDesktop: {
    maxWidth: '500px',
    maxHeight: '85vh',
    borderRadius: '24px',
    alignItems: 'center',
  },
  header: {
    padding: '20px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#212121',
    margin: 0,
  },
  closeBtn: {
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  },
  dateSection: {
    padding: '16px 24px',
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderBottom: '1px solid #F0F0F0',
  },
  datePickerWrapper: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #E0E0E0',
  },
  dateInput: {
    flex: 1,
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '14px',
    fontWeight: '600',
    color: '#212121',
    outline: 'none',
    fontFamily: 'inherit',
    cursor: 'pointer',
  },
  fetchButton: {
    padding: '12px 20px',
    backgroundColor: '#FF9800',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    gap: '16px',
  },
  loadingText: {
    fontSize: '16px',
    color: '#757575',
    fontWeight: '600',
    margin: 0,
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    gap: '16px',
    textAlign: 'center',
  },
  errorText: {
    fontSize: '16px',
    color: '#F44336',
    fontWeight: '600',
    margin: 0,
  },
  retryButton: {
    padding: '12px 24px',
    backgroundColor: '#FF9800',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '8px',
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    gap: '16px',
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#424242',
    margin: 0,
  },
  emptySubtitle: {
    fontSize: '14px',
    color: '#9E9E9E',
    margin: 0,
    lineHeight: '1.5',
  },
  notificationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  notificationCard: {
    padding: '16px',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #F0F0F0',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    transition: 'all 0.2s',
  },
  notificationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '8px',
  },
  notificationTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#212121',
    margin: 0,
    flex: 1,
  },
  badge: {
    padding: '4px 10px',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    whiteSpace: 'nowrap',
  },
  notificationDescription: {
    fontSize: '14px',
    color: '#616161',
    lineHeight: '1.5',
    margin: '0 0 12px 0',
  },
  notificationFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  notificationDate: {
    fontSize: '12px',
    color: '#9E9E9E',
    fontWeight: '600',
  },
};

export default React.memo(NotificationModal);
