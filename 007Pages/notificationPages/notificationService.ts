// <types>
class PictogramResource {
    constructor(public url: URL) {}
}
// ブロードキャストのお知らせ
export type NotificationId = string;
export type Notification = {
    id: NotificationId;
    title: string;
    pictogram: PictogramResource;
    registeredDate: Date;
    note: string;
    link: URL;
}
// 特定のユーザーへのお知らせ
export type DirectMessageId = string;
export type DirectMessage = {
    id: DirectMessageId;
    title: string;
    pictogram: PictogramResource;
    registeredDate: Date;
    note: string;
    content: string;
}
// </types>

interface NotificationService {
    fetchNotifications: () => Promise<Notification[]>;
    fetchDirectMessages: () => Promise<DirectMessage[]>;
    dismissNotification: (id: NotificationId) => Promise<void>;
    dismissDirectMessage: (id: DirectMessageId) => Promise<void>;
}

// mock implementation

class MockNotificationService implements NotificationService {
    public notifications:Notification[] = [
        {
            id: "1",
            title: "title 1",
            pictogram: new PictogramResource(new URL("https://example.com")),
            registeredDate: new Date(),
            note: "note1",
            link: new URL("https://example.com")
        },        
        {
            id: "2",
            title: "title 2",
            pictogram: new PictogramResource(new URL("https://example.com")),
            registeredDate: new Date(),
            note: "note2",
            link: new URL("https://example.com")
        },       
        {
            id: "3",
            title: "title 3",
            pictogram: new PictogramResource(new URL("https://example.com")),
            registeredDate: new Date(),
            note: "note3",
            link: new URL("https://example.com")
        },
    ];
    public directMessages:DirectMessage[] = [
        {
            id: "1",
            title: "title 1",
            pictogram: new PictogramResource(new URL("https://example.com")),
            registeredDate: new Date(),
            note: "note1",
            content: "content1"
        },        
        {
            id: "2",
            title: "title 2",
            pictogram: new PictogramResource(new URL("https://example.com")),
            registeredDate: new Date(),
            note: "note2",
            content: "content2"
        },       
        {
            id: "3",
            title: "title 3",
            pictogram: new PictogramResource(new URL("https://example.com")),
            registeredDate: new Date(),
            note: "note3",
            content: "content3"
        },
    ];

    async fetchDirectMessages() {
        return this.directMessages;
    }
    async dismissDirectMessage(id: DirectMessageId) {
        this.directMessages = this.directMessages.filter((dm) => dm.id !== id);
    }
    async fetchNotifications() {
        return this.notifications;
    }
    async dismissNotification(id: NotificationId) {
        this.notifications = this.notifications.filter((n) => n.id !== id);
    }
}

// bind instance
export const notificationService: NotificationService = new MockNotificationService();
