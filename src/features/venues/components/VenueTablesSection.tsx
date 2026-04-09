import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { venueService } from '../../../api/services/venueService';
import { Users, Calendar } from 'lucide-react';

interface VenueTablesSectionProps {
    venueId: string | number;
}

const VenueTablesSection: React.FC<VenueTablesSectionProps> = ({ venueId }) => {
    const [floor, setFloor] = React.useState(1);
    const [guests, setGuests] = React.useState(1);
    const [visitTime] = React.useState(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(12, 0, 0, 0);
        return tomorrow.toISOString();
    });

    const tablesQuery = useQuery({
        queryKey: ['venueTables', venueId, floor, guests, visitTime],
        queryFn: () => venueService.getTablesForBooking({
            venueId,
            floor,
            countOfGuests: guests,
            fullVisitTime: visitTime,
        }),
    });

    const categories = [
        { id: 1, name: '1 Этаж' },
        { id: 2, name: '2 Этаж' },
        { id: 3, name: '3 Этаж' },
    ];

    return (
        <div style={styles.container}>
            <div style={styles.bookingHeader}>
                <div style={styles.pickerRow}>
                    <div style={styles.picker}>
                        <Calendar size={18} color="#FF9800" />
                        <span style={styles.pickerLabel}>Завтра, 12:00</span>
                    </div>
                    <div style={styles.picker}>
                        <Users size={18} color="#FF9800" />
                        <select
                            value={guests}
                            onChange={(e) => setGuests(Number(e.target.value))}
                            style={styles.select}
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                                <option key={n} value={n}>{n} чел.</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div style={styles.floorBar}>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setFloor(cat.id)}
                            style={{
                                ...styles.floorChip,
                                backgroundColor: floor === cat.id ? '#FF9800' : '#F5F5F5',
                                color: floor === cat.id ? '#FFF' : '#757575',
                            }}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            <div style={styles.tableList}>
                {tablesQuery.isLoading ? (
                    <div>Поиск свободных столиков...</div>
                ) : tablesQuery.data?.tables.length === 0 ? (
                    <div style={styles.empty}>Свободных столиков нет на это время</div>
                ) : (
                    tablesQuery.data?.tables.map((table) => (
                        <div key={table.id} style={styles.tableCard}>
                            <img src={table.image} alt={table.title} style={styles.tableImage} />
                            <div style={styles.tableInfo}>
                                <h4 style={styles.tableName}>{table.title}</h4>
                                <div style={styles.tagRow}>
                                    <span style={styles.tag}>{table.tableType}</span>
                                    <span style={styles.tag}>{table.capacity} чел.</span>
                                </div>
                                <div style={styles.tableMeta}>
                                    <span style={styles.depositLabel}>Депозит:</span>
                                    <span style={styles.depositValue}>{table.deposit} KGS</span>
                                </div>
                            </div>
                            <button
                                style={{
                                    ...styles.bookButton,
                                    backgroundColor: table.tableStatus === 'BUSY' ? '#E0E0E0' : '#4CAF50',
                                    cursor: table.tableStatus === 'BUSY' ? 'not-allowed' : 'pointer'
                                }}
                                disabled={table.tableStatus === 'BUSY'}
                            >
                                {table.tableStatus === 'BUSY' ? 'Занят' : 'Бронь'}
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        marginTop: '16px',
    },
    bookingHeader: {
        marginBottom: '24px',
    },
    pickerRow: {
        display: 'flex',
        gap: '12px',
        marginBottom: '16px',
    },
    picker: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px',
        backgroundColor: '#F5F5F5',
        borderRadius: '12px',
        border: '1px solid #E0E0E0',
    },
    pickerLabel: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#424242',
    },
    select: {
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: '14px',
        fontWeight: '600',
        color: '#424242',
        width: '100%',
        outline: 'none',
    },
    floorBar: {
        display: 'flex',
        gap: '10px',
    },
    floorChip: {
        flex: 1,
        padding: '10px',
        borderRadius: '12px',
        border: 'none',
        fontSize: '13px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    tableList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    tableCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '12px',
        borderRadius: '16px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #F0F0F0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    },
    tableImage: {
        width: '64px',
        height: '64px',
        borderRadius: '12px',
        objectFit: 'cover',
    },
    tableInfo: {
        flex: 1,
    },
    tableName: {
        margin: '0 0 4px 0',
        fontSize: '15px',
        fontWeight: '700',
    },
    tagRow: {
        display: 'flex',
        gap: '8px',
        marginBottom: '4px',
    },
    tag: {
        fontSize: '10px',
        backgroundColor: '#ECEFF1',
        padding: '2px 8px',
        borderRadius: '4px',
        color: '#546E7A',
        fontWeight: '700',
    },
    tableMeta: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
    },
    depositLabel: {
        fontSize: '11px',
        color: '#757575',
    },
    depositValue: {
        fontSize: '12px',
        fontWeight: '800',
        color: '#212121',
    },
    bookButton: {
        padding: '8px 16px',
        borderRadius: '12px',
        border: 'none',
        color: '#FFF',
        fontSize: '13px',
        fontWeight: '700',
    },
    empty: {
        textAlign: 'center',
        padding: '40px 0',
        color: '#9E9E9E',
    },
};

export default VenueTablesSection;
