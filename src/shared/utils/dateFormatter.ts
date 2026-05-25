/**
 * Formats date and time into the specific ISO format required by the backend.
 * Example result: 2026-09-09T18:00:00+06:00
 * 
 * @param date - Date string in YYYY-MM-DD format
 * @param time - Time string in HH:mm format
 * @returns Formatted datetime string
 */
export const formatToBackendDateTime = (date: string, time: string): string => {
    // date: "2026-09-09"
    // time: "18:00"
    return `${date}T${time}:00+06:00`;
};

/**
 * Formats a numeric timestamp into a readable date and time string.
 * Example result: 11.04.2026 13:12
 * 
 * @param timestamp - The numeric timestamp in seconds (Unix timestamp)
 * @returns Formatted date string
 */
export const formatTimestamp = (timestamp: number): string => {
    // Server returns timestamps in seconds, but JavaScript Date expects milliseconds
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Translates booking status from English to Russian.
 * @param status - The booking status in English
 * @returns Translated status in Russian
 */
export const translateBookingStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
        'APPROVED': 'Подтверждено',
        'PENDING': 'В ожидании',
        'CANCELLED': 'Отменено',
        'NOT_PAID': 'Ожидает оплаты',
        'PAID': 'Оплачено',
        'COMPLETED': 'Завершено',
        'ACTIVE': 'Активно',
        'EXPIRED': 'Истекло'
    };
    return statusMap[status] || status;
};

/**
 * Translates table type from English to Russian.
 * @param type - The table type in English
 * @returns Translated type in Russian
 */
export const translateTableType = (type: string): string => {
    const typeMap: Record<string, string> = {
        'Terrace': 'Терраса',
        'Terasa': 'Терраса',
        ' terrace': 'Терраса',
        'VIP': 'VIP',
        'Standard': 'Стандарт',
        'Main Hall': 'Основной зал',
        'Outdoor': 'На улице'
    };
    return typeMap[type] || type;
};
