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
