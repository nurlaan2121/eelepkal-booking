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
 * @param timestamp - The numeric timestamp in milliseconds
 * @returns Formatted date string
 */
export const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};
