import React, { useState } from 'react';
import { useSearchStore } from '../searchStore';
import { X, Star } from 'lucide-react';

interface FilterModalProps {
    onClose: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ onClose }) => {
    const { filters, setFilters, resetFilters } = useSearchStore();

    // Local state for UI responsiveness before applying
    const [localFilters, setLocalFilters] = useState(filters);

    const handleApply = () => {
        setFilters(localFilters);
        onClose();
    };

    const handleReset = () => {
        resetFilters();
        setLocalFilters({
            minRating: undefined,
            minAverageCheck: undefined,
            maxAverageCheck: undefined,
        });
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Фильтры</h2>
                    <button onClick={onClose} style={styles.closeBtn}>
                        <X size={24} />
                    </button>
                </div>

                <div style={styles.body}>
                    {/* Rating Section */}
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>Минимальный рейтинг</h3>
                        <div style={styles.ratingRow}>
                            {[3, 4, 4.5, 5].map((val) => (
                                <button
                                    key={val}
                                    onClick={() => setLocalFilters({ ...localFilters, minRating: val })}
                                    style={{
                                        ...styles.filterOption,
                                        backgroundColor: localFilters.minRating === val ? '#FF9800' : '#F5F5F5',
                                        color: localFilters.minRating === val ? '#FFFFFF' : '#000000',
                                    }}
                                >
                                    <Star size={14} fill={localFilters.minRating === val ? '#FFFFFF' : 'none'} />
                                    {val}+
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Price Range Section */}
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>Средний чек (₸)</h3>
                        <div style={styles.rangeRow}>
                            <input
                                type="number"
                                placeholder="От"
                                value={localFilters.minAverageCheck || ''}
                                onChange={(e) => setLocalFilters({ ...localFilters, minAverageCheck: Number(e.target.value) || undefined })}
                                style={styles.numberInput}
                            />
                            <div style={styles.separator} />
                            <input
                                type="number"
                                placeholder="До"
                                value={localFilters.maxAverageCheck || ''}
                                onChange={(e) => setLocalFilters({ ...localFilters, maxAverageCheck: Number(e.target.value) || undefined })}
                                style={styles.numberInput}
                            />
                        </div>
                    </div>
                </div>

                <div style={styles.footer}>
                    <button onClick={handleReset} style={styles.resetBtn}>Сбросить</button>
                    <button onClick={handleApply} style={styles.applyBtn}>Применить</button>
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
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'flex-end',
        zIndex: 2000,
    },
    modal: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        animation: 'slideUp 0.3s ease-out',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: '20px',
        fontWeight: '700',
        margin: 0,
    },
    closeBtn: {
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        padding: '4px',
    },
    body: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
    },
    section: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    sectionTitle: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#757575',
        margin: 0,
    },
    ratingRow: {
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
    },
    filterOption: {
        border: 'none',
        borderRadius: '12px',
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    rangeRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    numberInput: {
        flex: 1,
        height: '48px',
        borderRadius: '12px',
        border: '1px solid #E0E0E0',
        padding: '0 16px',
        fontSize: '15px',
        outline: 'none',
    },
    separator: {
        width: '8px',
        height: '2px',
        backgroundColor: '#E0E0E0',
    },
    footer: {
        display: 'flex',
        gap: '12px',
        marginTop: '8px',
    },
    resetBtn: {
        flex: 1,
        height: '52px',
        borderRadius: '15px',
        border: '1px solid #E0E0E0',
        backgroundColor: '#FFFFFF',
        fontSize: '16px',
        fontWeight: '600',
        color: '#000000',
        cursor: 'pointer',
    },
    applyBtn: {
        flex: 2,
        height: '52px',
        borderRadius: '15px',
        border: 'none',
        backgroundColor: '#FF9800',
        fontSize: '16px',
        fontWeight: '600',
        color: '#FFFFFF',
        cursor: 'pointer',
    },
};

export default FilterModal;
