import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Calendar, Clock, Sparkles } from 'lucide-react';
import { venueService } from '../../../api/services/venueService';
import { formatToBackendDateTime, translateTableType } from '../../../shared/utils/dateFormatter';
import { TableItem } from '../../../api/dto/venueDto';
import InfiniteScrollList from '../../../components/ui/InfiniteScrollList';
import TableDetailsModal from './TableDetailsModal';
import BookingConfirmationModal from './BookingConfirmationModal';
import AuthGuardModal from '../../auth/components/AuthGuardModal';
import { useAuthStore } from '../../auth/authStore';
import OptimizedImage from '../../../components/ui/OptimizedImage';

interface VenueTablesListSectionProps {
    venueId: string | number;
}

const LIMIT = 10;

const VenueTablesListSection: React.FC<VenueTablesListSectionProps> = ({ venueId }) => {
    const [floor, setFloor] = React.useState(1);
    const [selectedTableId, setSelectedTableId] = React.useState<number | null>(null);
    const [bookingConfirmation, setBookingConfirmation] = React.useState<{ tableId: number; title: string } | null>(null);
    const [isAuthGuardOpen, setIsAuthGuardOpen] = React.useState(false);

    const { isAuthenticated } = useAuthStore();

    // Default to current local date
    const [selectedDate, setSelectedDate] = React.useState(() => {
        const date = new Date();
        const offset = date.getTimezoneOffset() * 60000;
        const localISOTime = new Date(date.getTime() - offset).toISOString();
        return localISOTime.split('T')[0];
    });

    // Default to current local time
    const [selectedTime, setSelectedTime] = React.useState(() => {
        const date = new Date();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    });

    const fullVisitTime = React.useMemo(() => {
        return formatToBackendDateTime(selectedDate, selectedTime);
    }, [selectedDate, selectedTime]);

    const tablesQuery = useInfiniteQuery({
        queryKey: ['venueGuestTables', venueId, floor, fullVisitTime],
        queryFn: ({ pageParam = 0 }) =>
            venueService.getGuestTables(venueId, {
                floor,
                fullVisitTime,
                offset: pageParam,
                limit: LIMIT,
            }),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            const loaded = allPages.reduce((acc, p) => acc + (p.tables?.length ?? 0), 0);
            return lastPage.tables?.length === LIMIT ? loaded : undefined;
        },
        enabled: !!venueId && !!fullVisitTime,
    });

    const categories = [
        { id: 1, name: '1 Этаж' },
        { id: 2, name: '2 Этаж' },
        { id: 3, name: '3 Этаж' },
    ];

    // Read open/busy stats from the first page's response metadata
    const countOpen = tablesQuery.data?.pages[0]?.countOpen ?? 0;
    const countBusy = tablesQuery.data?.pages[0]?.countBusy ?? 0;

    const allTables = tablesQuery.data?.pages.flatMap((page) => page.tables ?? []) ?? [];

    const handleTableClick = (table: TableItem) => {
        setSelectedTableId(table.id);
    };

    const handleBook = (tableId: number, tableTitle: string) => {
        if (!isAuthenticated) {
            setIsAuthGuardOpen(true);
            return;
        }
        setSelectedTableId(null);
        setBookingConfirmation({ tableId, title: tableTitle });
    };

    return (
        <div style={styles.container}>
            <div style={styles.filterHeader}>
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
                            <span style={styles.statCount}>{countOpen}</span>
                        </div>
                        <div style={styles.statItem}>
                            <div style={{ ...styles.statDot, backgroundColor: '#9E9E9E' }} />
                            <span style={styles.statLabel}>Занято:</span>
                            <span style={styles.statCount}>{countBusy}</span>
                        </div>
                    </div>
                )}

                <InfiniteScrollList<TableItem>
                    items={allTables}
                    keyExtractor={(table, index) => table.id || index}
                    renderItem={(table) => {
                        const isBusy = table.tableStatus === 'BUSY';
                        const isRecommended = table.recommendationForBooking;

                        return (
                            <div
                                style={{
                                    ...styles.tableCard,
                                    border: isRecommended ? '1.5px solid #FFD54F' : '1px solid #F0F0F0',
                                    boxShadow: isRecommended ? '0 4px 12px rgba(255, 213, 79, 0.15)' : styles.tableCard.boxShadow,
                                    position: 'relative',
                                    cursor: 'pointer',
                                }}
                                onClick={() => handleTableClick(table)}
                            >
                                {isRecommended && (
                                    <div style={styles.recommendedBadge}>
                                        <Sparkles size={11} style={{ marginRight: '3px' }} />
                                        <span>Рекомендуем</span>
                                    </div>
                                )}

                                {table.image ? (
                                    <OptimizedImage src={table.image} alt={table.title} style={styles.tableImage} />
                                ) : (
                                    <div style={styles.tableImagePlaceholder}>
                                        <span style={styles.placeholderLabel}>Стул</span>
                                    </div>
                                )}

                                <div style={styles.tableInfo}>
                                    <h4 style={styles.tableName}>{table.title || 'Без названия'}</h4>
                                    <div style={styles.tagRow}>
                                        <span style={styles.tag}>{translateTableType(table.tableType)}</span>
                                        <span style={styles.tag}>{table.capacity || 0} чел.</span>
                                    </div>
                                    <div style={styles.tableMeta}>
                                        <span style={styles.depositLabel}>Депозит:</span>
                                        <span style={styles.depositValue}>{table.deposit || 0} сом</span>
                                    </div>
                                </div>

                                <div style={{
                                    ...styles.statusBadge,
                                    backgroundColor: isBusy ? '#FFEBEE' : '#E8F5E9',
                                    color: isBusy ? '#C62828' : '#2E7D32',
                                    border: `1px solid ${isBusy ? '#FFCDD2' : '#C8E6C9'}`
                                }}>
                                    {isBusy ? 'Занят' : 'Свободен'}
                                </div>
                            </div>
                        );
                    }}
                    hasNextPage={!!tablesQuery.hasNextPage}
                    isFetchingNextPage={tablesQuery.isFetchingNextPage}
                    isLoading={tablesQuery.isLoading}
                    isError={tablesQuery.isError}
                    onLoadMore={tablesQuery.fetchNextPage}
                    emptyState={<div style={styles.empty}>Столиков не найдено на выбранное время</div>}
                    errorState={<div style={styles.tabError}>Ошибка при загрузке столиков</div>}
                    gap={16}
                />
            </div>

            {/* Table Details Modal */}
            {selectedTableId !== null && (
                <TableDetailsModal
                    tableId={selectedTableId}
                    visitTime={fullVisitTime}
                    onClose={() => setSelectedTableId(null)}
                    onBook={() => {
                        const table = allTables.find(t => t.id === selectedTableId);
                        if (table) {
                            handleBook(table.id, table.title);
                        }
                    }}
                />
            )}

            {/* Booking Confirmation Modal */}
            {bookingConfirmation !== null && (
                <BookingConfirmationModal
                    tableId={bookingConfirmation.tableId}
                    tableTitle={bookingConfirmation.title}
                    bookingData={{
                        venueId: Number(venueId),
                        floor,
                        countOfGuests: 1,
                        fullVisitTime,
                    }}
                    onClose={() => setBookingConfirmation(null)}
                />
            )}

            {/* Auth Guard */}
            <AuthGuardModal
                isOpen={isAuthGuardOpen}
                onClose={() => setIsAuthGuardOpen(false)}
            />
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        marginTop: '16px',
    },
    filterHeader: {
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
        gap: '16px',
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
        padding: '16px',
        borderRadius: '16px',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.2s, transform 0.15s',
    },
    recommendedBadge: {
        position: 'absolute',
        top: '-10px',
        left: '16px',
        backgroundColor: '#FFD54F',
        color: '#7F5F00',
        padding: '2px 8px',
        borderRadius: '8px',
        fontSize: '10px',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 6px rgba(255, 213, 79, 0.4)',
    },
    tableImage: {
        width: '64px',
        height: '64px',
        borderRadius: '12px',
        objectFit: 'cover',
    },
    tableImagePlaceholder: {
        width: '64px',
        height: '64px',
        borderRadius: '12px',
        backgroundColor: '#ECEFF1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderLabel: {
        fontSize: '10px',
        color: '#78909C',
        fontWeight: '700',
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
    statusBadge: {
        padding: '6px 12px',
        borderRadius: '10px',
        fontSize: '12px',
        fontWeight: '700',
    },
    empty: {
        textAlign: 'center',
        padding: '40px 0',
        color: '#9E9E9E',
        fontSize: '14px',
    },
    tabError: {
        textAlign: 'center',
        padding: '40px 0',
        color: '#F44336',
        fontSize: '14px',
    },
};

export default VenueTablesListSection;
