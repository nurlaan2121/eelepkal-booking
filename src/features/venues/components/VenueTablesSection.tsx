import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { venueService } from '../../../api/services/venueService';
import { Users, Calendar, Clock } from 'lucide-react';
import { formatToBackendDateTime } from '../../../shared/utils/dateFormatter';

import { TableItem } from '../../../api/dto/venueDto';
import TableDetailsModal from './TableDetailsModal';
import BookingConfirmationModal from './BookingConfirmationModal';

interface VenueTablesSectionProps {
    venueId: string | number;
}

const VenueTablesSection: React.FC<VenueTablesSectionProps> = ({ venueId }) => {
    const [floor, setFloor] = React.useState(1);
    const [guests, setGuests] = React.useState(1);
    const [selectedTableId, setSelectedTableId] = React.useState<number | null>(null);
    const [bookingConfirmation, setBookingConfirmation] = React.useState<{ tableId: number, title: string } | null>(null);

    // Default to tomorrow 12:00
    const [selectedDate, setSelectedDate] = React.useState(() => {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        return date.toISOString().split('T')[0];
    });
    const [selectedTime, setSelectedTime] = React.useState("12:00");

    const fullVisitTime = React.useMemo(() => {
        return formatToBackendDateTime(selectedDate, selectedTime);
    }, [selectedDate, selectedTime]);

    const tablesQuery = useQuery({
        queryKey: ['venueTables', venueId, floor, guests, fullVisitTime],
        queryFn: async () => {
            console.log({
                venueId,
                floor,
                countOfGuests: guests,
                fullVisitTime
            });

            return venueService.getTablesForBooking({
                venueId: Number(venueId),
                floor,
                countOfGuests: guests,
                fullVisitTime,
            });
        },
        enabled: !!venueId && !isNaN(Number(venueId)),
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
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.picker}>
                        <Clock size={18} color="#FF9800" />
                        <input
                            type="time"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.picker}>
                        <Users size={18} color="#FF9800" />
                        <select
                            value={guests}
                            onChange={(e) => setGuests(Number(e.target.value))}
                            style={styles.select}
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map(n => (
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
                {tablesQuery.data && (
                    <div style={styles.statsBar}>
                        <div style={styles.statItem}>
                            <div style={{ ...styles.statDot, backgroundColor: '#4CAF50' }} />
                            <span style={styles.statLabel}>Свободно:</span>
                            <span style={styles.statCount}>{tablesQuery.data.countOpen}</span>
                        </div>
                        <div style={styles.statItem}>
                            <div style={{ ...styles.statDot, backgroundColor: '#9E9E9E' }} />
                            <span style={styles.statLabel}>Занято:</span>
                            <span style={styles.statCount}>{tablesQuery.data.countBusy}</span>
                        </div>
                        <div style={styles.statItem}>
                            <div style={{ ...styles.statDot, backgroundColor: '#FF9800' }} />
                            <span style={styles.statLabel}>Для вас:</span>
                            <span style={styles.statCount}>{tablesQuery.data.countForYou}</span>
                        </div>
                    </div>
                )}

                {tablesQuery.isLoading ? (
                    <div>Поиск свободных столиков...</div>
                ) : tablesQuery.data?.tables.length === 0 ? (
                    <div style={styles.empty}>Свободных столиков нет на это время</div>
                ) : (
                    tablesQuery.data?.tables.map((table: TableItem) => (
                        <div
                            key={table.id}
                            style={styles.tableCard}
                            onClick={() => setSelectedTableId(table.id)}
                        >
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
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setBookingConfirmation({ tableId: table.id, title: table.title });
                                }}
                            >
                                {table.tableStatus === 'BUSY' ? 'Занят' : 'Бронь'}
                            </button>
                        </div>
                    ))
                )}
            </div>

            {selectedTableId && (
                <TableDetailsModal
                    tableId={selectedTableId}
                    visitTime={fullVisitTime}
                    onClose={() => setSelectedTableId(null)}
                    onBook={() => {
                        const table = tablesQuery.data?.tables.find(t => t.id === selectedTableId);
                        if (table) {
                            setBookingConfirmation({ tableId: table.id, title: table.title });
                            setSelectedTableId(null);
                        }
                    }}
                />
            )}

            {bookingConfirmation && (
                <BookingConfirmationModal
                    tableId={bookingConfirmation.tableId}
                    tableTitle={bookingConfirmation.title}
                    bookingData={{
                        venueId: Number(venueId),
                        floor,
                        countOfGuests: guests,
                        fullVisitTime,
                    }}
                    onClose={(success) => {
                        setBookingConfirmation(null);
                        if (success) {
                            // Optionally refetch tables if needed
                            tablesQuery.refetch();
                        }
                    }}
                />
            )}
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
        fontSize: '13px',
        fontWeight: '600',
        color: '#424242',
        width: '100%',
        outline: 'none',
        cursor: 'pointer',
    },
    input: {
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: '13px',
        fontWeight: '600',
        color: '#424242',
        width: '100%',
        outline: 'none',
        cursor: 'pointer',
        fontFamily: 'inherit',
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
    statsBar: {
        display: 'flex',
        gap: '12px',
        padding: '12px 16px',
        backgroundColor: '#F9FAFB',
        borderRadius: '16px',
        border: '1px solid #F3F4F6',
        marginBottom: '4px',
    },
    statItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    },
    statDot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
    },
    statLabel: {
        fontSize: '11px',
        fontWeight: '600',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: '0.02em',
    },
    statCount: {
        fontSize: '13px',
        fontWeight: '800',
        color: '#111827',
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
