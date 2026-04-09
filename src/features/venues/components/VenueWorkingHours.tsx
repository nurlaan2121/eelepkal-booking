import React from 'react';
import { Clock, ChevronDown, ChevronUp } from 'lucide-react';
import type { VenueSchedule } from '../../../api/dto/venueDto';

interface VenueWorkingHoursProps {
    schedule: VenueSchedule | null;
    todayHours: string;
}

const daysMap = {
    MONDAY: 'Понедельник',
    TUESDAY: 'Вторник',
    WEDNESDAY: 'Среда',
    THURSDAY: 'Четверг',
    FRIDAY: 'Пятница',
    SATURDAY: 'Суббота',
    SUNDAY: 'Воскресенье',
};

const VenueWorkingHours: React.FC<VenueWorkingHoursProps> = ({ schedule, todayHours }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    return (
        <div style={styles.container}>
            <div style={styles.summary} onClick={() => setIsExpanded(!isExpanded)}>
                <div style={styles.iconBox}>
                    <Clock size={20} color="#FF9800" />
                </div>
                <div style={styles.content}>
                    <span style={styles.label}>Время работы (Сегодня)</span>
                    <span style={styles.value}>{todayHours}</span>
                </div>
                <div style={styles.toggle}>
                    {isExpanded ? <ChevronUp size={20} color="#757575" /> : <ChevronDown size={20} color="#757575" />}
                </div>
            </div>

            {isExpanded && schedule && (
                <div style={styles.expandedList}>
                    {Object.entries(daysMap).map(([key, label]) => (
                        <div key={key} style={styles.scheduleRow}>
                            <span style={styles.dayLabel}>{label}</span>
                            <span style={styles.hoursValue}>{(schedule as any)[key] || 'Закрыто'}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        padding: '16px 24px',
        backgroundColor: '#F9F9F9',
        borderRadius: '24px',
        marginBottom: '24px',
        cursor: 'pointer',
    },
    summary: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    iconBox: {
        width: '44px',
        height: '44px',
        borderRadius: '12px',
        backgroundColor: '#FFE0B2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
    },
    label: {
        fontSize: '12px',
        color: '#757575',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    value: {
        fontSize: '16px',
        color: '#212121',
        fontWeight: '700',
    },
    toggle: {
        marginLeft: 'auto',
    },
    expandedList: {
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: '1px solid #E0E0E0',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    scheduleRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dayLabel: {
        fontSize: '14px',
        color: '#424242',
        fontWeight: '500',
    },
    hoursValue: {
        fontSize: '14px',
        color: '#212121',
        fontWeight: '700',
    },
};

export default VenueWorkingHours;
