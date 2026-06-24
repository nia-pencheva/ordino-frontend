export interface Notification {
    id: number;
    title: string;
    message: string;
    createdAt: string;
}

export interface NotificationsPage {
    notifications: Notification[];
    totalElements: number;
    totalPages: number;
}
