export interface ClientNotification {
  notificationId: number;
  title: string;
  description: string;
  notificationType: string;
  createdAt: number | string; // Can be timestamp (seconds) or ISO string
}

export interface NotificationResponse {
  notifications: ClientNotification[];
  hasMore: boolean;
  total: number;
}
