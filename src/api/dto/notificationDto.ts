export interface ClientNotification {
  notificationId: number;
  title: string;
  description: string;
  notificationType: string;
  createdAt: string;
}

export interface NotificationResponse {
  notifications: ClientNotification[];
  hasMore: boolean;
  total: number;
}
