import api from '../instances/apiInstance';
import { ClientNotification } from '../dto/notificationDto';

export const clientNotificationService = {
  /**
   * Get notifications for a specific date
   * @param date - Date in YYYY-MM-DD format
   * @param offset - Pagination offset (default: 0)
   * @param limit - Number of items per page (default: 20)
   * @returns Array of notifications
   */
  getNotifications: async (
    date: string,
    offset: number = 0,
    limit: number = 20
  ): Promise<ClientNotification[]> => {
    const response = await api.get<ClientNotification[]>('/client-notification/get-notifications', {
      params: {
        date,
        offset,
        limit,
      },
    });
    
    return response.data;
  },
};
