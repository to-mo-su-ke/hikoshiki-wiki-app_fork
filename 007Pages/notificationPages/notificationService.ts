import AsyncStorage from "@react-native-async-storage/async-storage";

// <types>
// ピクトグラムのリソース．リンクで指定するのか，アセットに画像を配置してそれを指定するのか分からないので，
// とりあえず型として切り出しています．
class PictogramResource {
    constructor(public url: URL) {}
    toString() {
        return this.url.toString();
    }
    static fromString(str: string) {
        return new PictogramResource(new URL(str));
    }
}
// ブロードキャストのお知らせ
export type NotificationId = string;
export class Notification {
    constructor(
        public id: NotificationId,
        public title: string,
        public pictogram: PictogramResource,
        public registeredDate: Date,
        public note: string,
        public link: URL,
    ) {}
    // 通知情報をクライアント端末に保存するためにjsonエンコード・デコードを実現します．
    toString() {
        const obj ={
            id: this.id,
            title: this.title,
            pictogram: this.pictogram.toString(),
            registeredDate: this.registeredDate.toISOString(),
            note: this.note,
            link: this.link.toString(),
        };
        return JSON.stringify(obj);
    }
    static fromString(str: string) {
        const obj = JSON.parse(str);
        return new Notification(
            obj.id,
            obj.title,
            PictogramResource.fromString(obj.pictogram),
            new Date(obj.registeredDate),
            obj.note,
            new URL(obj.link),
        );
    }
}
// 特定のユーザーへのお知らせ
export type DirectMessageId = string;
export class DirectMessage{
    constructor(
        public id: DirectMessageId,
        public title: string,
        public pictogram: PictogramResource,
        public registeredDate: Date,
        public note: string,
        public content: string,
    ) {}
    // 通知情報をクライアント端末に保存するためにjsonエンコード・デコードを実現します．
    toString() {
        const obj ={
            id: this.id,
            title: this.title,
            pictogram: this.pictogram.toString(),
            registeredDate: this.registeredDate.toISOString(),
            note: this.note,
            content: this.content,
        };
        return JSON.stringify(obj);
    }
    static fromString(str: string) {
        const obj = JSON.parse(str);
        return new DirectMessage(
            obj.id,
            obj.title,
            PictogramResource.fromString(obj.pictogram),
            new Date(obj.registeredDate),
            obj.note,
            obj.content,
        );
    }
}
// </types>

export interface NotificationService {
    fetchNotifications: () => Promise<Notification[]>;
    fetchDirectMessages: () => Promise<DirectMessage[]>;
    dismissNotification: (id: NotificationId) => Promise<void>;
    dismissDirectMessage: (id: DirectMessageId) => Promise<void>;
}

// <mock implementation>

export class MockNotificationService implements NotificationService {
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

// </mock implementation>

// <implementation>

class NotificationServiceImpl implements NotificationService {
    private static NOTIFICATIONS_KEY = "notification_service_notifications";
    private notifications: Notification[];
    async restoreNotifications() {
        const notificationsJson = await AsyncStorage.getItem(NotificationServiceImpl.NOTIFICATIONS_KEY);
        if (notificationsJson) {
            this.notifications = JSON.parse(notificationsJson).map((n: string) => Notification.fromString(n));
        } else {
            this.notifications = [];
        }
    }
    private static DIRECT_MESSAGES_KEY = "notification_service_direct_messages";
    private directMessages: DirectMessage[];
    async restoreDirectMessages() {
        const directMessagesJson = await AsyncStorage.getItem(NotificationServiceImpl.DIRECT_MESSAGES_KEY);
        if (directMessagesJson) {
            this.directMessages = JSON.parse(directMessagesJson).map((dm: string) => DirectMessage.fromString(dm));
        } else {
            this.directMessages = [];
        }
    }
    private static NOTIFICATIONS_LAST_FETCHED_AT_KEY = "notification_service_notifications_last_fetched_at";
    private notificationsLastFetchedAt: Date;
    async restoreNotificationsLastFetchedAt() {
        const notificationsLastFetchedAtJson = await AsyncStorage.getItem(NotificationServiceImpl.NOTIFICATIONS_LAST_FETCHED_AT_KEY);
        if (notificationsLastFetchedAtJson) {
            this.notificationsLastFetchedAt = new Date(notificationsLastFetchedAtJson);
        } else {
            this.notificationsLastFetchedAt = new Date(0);
        }
    }
    private static DIRECT_MESSAGES_LAST_FETCHED_AT_KEY = "notification_service_direct_messages_last_fetched_at";
    private directMessagesLastFetchedAt: Date;
    async restoreDirectMessagesLastFetchedAt() {
        const directMessagesLastFetchedAtJson = await AsyncStorage.getItem(NotificationServiceImpl.DIRECT_MESSAGES_LAST_FETCHED_AT_KEY);
        if (directMessagesLastFetchedAtJson) {
            this.directMessagesLastFetchedAt = new Date(directMessagesLastFetchedAtJson);
        } else {
            this.directMessagesLastFetchedAt = new Date(0);
        }
    }
    private initialized: boolean = false;

    async ensureInitialized() {
        if (this.initialized) {return;}

        // notifications, directMessages, notificationsLastFetchedAt, directMessagesLastFetchedAtをAsyncStorageから回復させる．
        await this.restoreNotifications();
        await this.restoreDirectMessages();
        await this.restoreNotificationsLastFetchedAt();
        await this.restoreDirectMessagesLastFetchedAt();

        this.initialized = true;
    }

    async pushNotifications(notifications: Notification[]) {
        await this.ensureInitialized();
        this.notifications.push(...notifications);
        await AsyncStorage.setItem(
            NotificationServiceImpl.NOTIFICATIONS_KEY, 
            JSON.stringify(this.notifications.map((n) => n.toString()))
        );
    }

    async setNotificationsLastFetchedAt(date: Date) {
        await this.ensureInitialized();
        this.notificationsLastFetchedAt = date;
        await AsyncStorage.setItem(
            NotificationServiceImpl.NOTIFICATIONS_LAST_FETCHED_AT_KEY, 
            this.notificationsLastFetchedAt.toISOString()
        );
    }

    async pushDirectMessages(directMessages: DirectMessage[]) {
        await this.ensureInitialized();
        this.directMessages.push(...directMessages);
        await AsyncStorage.setItem(
            NotificationServiceImpl.DIRECT_MESSAGES_KEY, 
            JSON.stringify(this.directMessages.map((dm) => dm.toString()))
        );
    }

    async setDirectMessagesLastFetchedAt(date: Date) {
        await this.ensureInitialized();
        await AsyncStorage.setItem(NotificationServiceImpl.DIRECT_MESSAGES_LAST_FETCHED_AT_KEY, date.toISOString());
    }

    async fetchNotifications() {
        await this.ensureInitialized();
        const fetchingNotificationsAt = new Date();
        // ここでfirebaseから通知を取得
        await this.pushNotifications([]);
        await this.setNotificationsLastFetchedAt(fetchingNotificationsAt);
        return this.notifications;
    }
    async fetchDirectMessages() {
        await this.ensureInitialized();
        const fetchingDirectMessagesAt = new Date();
        // ここでfirebaseからダイレクトメッセージを取得
        await this.pushDirectMessages([]);
        await this.setDirectMessagesLastFetchedAt(fetchingDirectMessagesAt);
        return this.directMessages;
    }
    async dismissNotification(id: NotificationId) {
        await this.ensureInitialized();
        // idが一致する要素を削除
        this.notifications = this.notifications.filter((n) => n.id !== id);
        await AsyncStorage.setItem(
            NotificationServiceImpl.NOTIFICATIONS_KEY, 
            JSON.stringify(this.notifications.map((n) => n.toString()))
        );
    }
    async dismissDirectMessage(id: DirectMessageId) {
        await this.ensureInitialized();
        // idが一致する要素を削除
        this.directMessages = this.directMessages.filter((dm) => dm.id !== id);
        await AsyncStorage.setItem(
            NotificationServiceImpl.DIRECT_MESSAGES_KEY, 
            JSON.stringify(this.directMessages.map((dm) => dm.toString()))
        );

    }
}

// </implementation>
