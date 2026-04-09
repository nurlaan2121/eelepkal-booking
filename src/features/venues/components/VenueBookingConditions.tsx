import React from 'react';
import { Info, Clock, AlertCircle, Coins } from 'lucide-react';
import type { BookingConditions } from '../../../api/dto/venueDto';

interface VenueBookingConditionsProps {
    conditions: BookingConditions | null;
}

const VenueBookingConditions: React.FC<VenueBookingConditionsProps> = ({ conditions }) => {
    if (!conditions) return null;

    const toReadableTime = (deadline: number[] | null): string => {
        if (!deadline) return "0 мин";
        const hour = deadline[0] || 0;
        const minute = deadline[1] || 0;

        if (hour > 0 && minute > 0) return `${hour} ч ${minute} мин`;
        if (hour > 0) return `${hour} ч`;
        if (minute > 0) return `${minute} мин`;
        return "0 мин";
    };

    const hasAnyCondition =
        (conditions.cancellationAllowed && conditions.cancellationDeadline) ||
        (conditions.editingAllowed && conditions.editingDeadline) ||
        (conditions.withADeposit && conditions.deposit && conditions.deposit > 0);

    if (!hasAnyCondition) return null;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <Info size={18} color="#FF9800" />
                <h3 style={styles.title}>Условия бронирования</h3>
            </div>

            <div style={styles.content}>
                {conditions.cancellationAllowed && conditions.cancellationDeadline && (
                    <div style={styles.conditionRow}>
                        <div style={styles.iconBox}>
                            <AlertCircle size={16} color="#757575" />
                        </div>
                        <span style={styles.text}>
                            Отмена за {toReadableTime(conditions.cancellationDeadline)} до визита
                        </span>
                    </div>
                )}

                {conditions.editingAllowed && conditions.editingDeadline && (
                    <div style={styles.conditionRow}>
                        <div style={styles.iconBox}>
                            <Clock size={16} color="#757575" />
                        </div>
                        <span style={styles.text}>
                            Изменения возможны за {toReadableTime(conditions.editingDeadline)} до визита
                        </span>
                    </div>
                )}

                {conditions.withADeposit && conditions.deposit && conditions.deposit > 0 && (
                    <div style={styles.conditionRow}>
                        <div style={styles.iconBox}>
                            <Coins size={16} color="#757575" />
                        </div>
                        <span style={styles.text}>
                            Депозит: <strong>{conditions.deposit} c</strong>
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        padding: '24px',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        marginBottom: '24px',
        border: '1px solid #F0F0F0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px',
    },
    title: {
        fontSize: '18px',
        fontWeight: '800',
        margin: 0,
        color: '#212121',
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    conditionRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    iconBox: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: '#F5F5F5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    text: {
        fontSize: '14px',
        color: '#424242',
        lineHeight: '1.4',
    },
};

export default VenueBookingConditions;
