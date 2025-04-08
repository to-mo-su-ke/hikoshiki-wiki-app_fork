import AsyncStorage from "@react-native-async-storage/async-storage";
import {firestore} from "../../004BackendModules/firebaseMetod/firestore";
import { getUserId } from "../../004BackendModules/firebaseMetod/firebase";

// <types>
// ピクトグラムのリソース．リンクで指定するのか，アセットに画像を配置してそれを指定するのか分からないので，
// とりあえず型として切り出しています．
export class PictogramResource {
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
        public role: string = "general", // デフォルトは一般ユーザ
        public readBy: string[] = [], // 既読にしたユーザーのUIDを格納
        public dismissedBy: string[] = [] // 削除したユーザーのUIDを格納
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
            obj.role,
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
    /// これによって登録されたコールバックは
    // [fetchNotifications]を実行した際に新規お知らせが存在した場合はそれらを引数に与えて呼びだします．
    addOnNewNotificationListener: (listener: (newNotification: Notification[]) => void) => void;
    /// これによって登録されたコールバックは
    // [fetchDirectMessages]を実行した際に新規ダイレクトメッセージが存在した場合はそれらを引数に与えて呼びだします．
    addOnNewDirectMessageListener: (listener: (newDirectMessage: DirectMessage[]) => void) => void;
    /// キャッシュされたお知らせおよび新規取得したお知らせをまとめて返します．
    fetchNotifications: () => Promise<Notification[]>;
    /// キャッシュされたダイレクトメッセージおよび新規取得したダイレクトメッセージをまとめて返します．
    fetchDirectMessages: () => Promise<DirectMessage[]>;
    /// 指定されたidをもつお知らせをキャッシュから削除します．
    dismissNotification: (id: NotificationId) => Promise<void>;
    /// 指定されたidをもつダイレクトメッセージをキャッシュから削除します．
    dismissDirectMessage: (id: DirectMessageId) => Promise<void>;
    /// 内部状態(デバイスに保持されているおしらせ，ダイレクトメッセージのキャッシュや最終取得日時)を破棄します．
    /// 不具合解消やデバッグに利用してください．
    resetState: () => Promise<void>;
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
            link: new URL("https://example.com"),
            role: "superAdministrator",
            readBy: [],
            dismissedBy: [],
           
            
        },        
        {
            id: "2",
            title: "title 2",
            pictogram: new PictogramResource(new URL("https://example.com")),
            registeredDate: new Date(),
            note: "note2",
            link: new URL("https://example.com"),
            role: "superAdministrator",
            readBy: [],
            dismissedBy: [],
        },       
        {
            id: "3",
            title: "title 3",
            pictogram: new PictogramResource(new URL("https://example.com")),
            registeredDate: new Date(),
            note: "note3",
            link: new URL("https://example.com"),
            role: "superAdministrator",
            readBy: [],
            dismissedBy: [],
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

    addOnNewNotificationListener(listener: (newNotification: Notification[]) => void) {
        // Mockなので何もしない
    }
    addOnNewDirectMessageListener(listener: (newDirectMessage: DirectMessage[]) => void) {
        // Mockなので何もしない
    }

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
    async resetState() {
        this.notifications = [
            {
                id: "1",
                title: "title 1",
                pictogram: new PictogramResource(new URL("https://example.com")),
                registeredDate: new Date(),
                note: "note1",
                link: new URL("https://example.com"),
                role: "superAdministrator",
                readBy: [],
                dismissedBy: [],
            },        
            {
                id: "2",
                title: "title 2",
                pictogram: new PictogramResource(new URL("https://example.com")),
                registeredDate: new Date(),
                note: "note2",
                link: new URL("https://example.com"),
                role: "superAdministrator",
                readBy: [],
                dismissedBy: [],

            },       
            {
                id: "3",
                title: "title 3",
                pictogram: new PictogramResource(new URL("https://example.com")),
                registeredDate: new Date(),
                note: "note3",
                link: new URL("https://example.com"),
                role: "superAdministrator",
                readBy: [],
                dismissedBy: [],
            },
        ];
        this.directMessages = [
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
    }
}

// </mock implementation>

// <implementation>

export class NotificationServiceImpl implements NotificationService {
    // <AsyncStorage>
    // firebaseからの取得結果をキャッシュするためにAsyncStorageを利用します．
    // 以下でAsyncStorageの各キーを定め，AsyncStorageの利用をメソッド化します．
    // <notifications>
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
    async pushNotifications(notifications: Notification[]) {
        await this.ensureInitialized();
        this.notifications.push(...notifications);
        await AsyncStorage.setItem(
            NotificationServiceImpl.NOTIFICATIONS_KEY, 
            JSON.stringify(this.notifications.map((n) => n.toString()))
        );
    }
    async clearNotifications() {
        await this.ensureInitialized();
        this.notifications = [];
        await AsyncStorage.setItem(NotificationServiceImpl.NOTIFICATIONS_KEY, "[]");
    }
    // </notifications>
    // <directMessages>
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
    async pushDirectMessages(directMessages: DirectMessage[]) {
        await this.ensureInitialized();
        this.directMessages.push(...directMessages);
        await AsyncStorage.setItem(
            NotificationServiceImpl.DIRECT_MESSAGES_KEY, 
            JSON.stringify(this.directMessages.map((dm) => dm.toString()))
        );
    }
    async clearDirectMessages() {
        await this.ensureInitialized();
        this.directMessages = [];
        await AsyncStorage.setItem(NotificationServiceImpl.DIRECT_MESSAGES_KEY, "[]");
    }
    // </directMessages>
    // <notificationsLastFetchedAt>
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
    async setNotificationsLastFetchedAt(date: Date) {
        await this.ensureInitialized();
        this.notificationsLastFetchedAt = date;
        await AsyncStorage.setItem(
            NotificationServiceImpl.NOTIFICATIONS_LAST_FETCHED_AT_KEY, 
            this.notificationsLastFetchedAt.toISOString()
        );
    }
    async resetNotificationsLastFetchedAt() {
        await this.ensureInitialized();
        this.notificationsLastFetchedAt = new Date(0);
        await AsyncStorage.setItem(
            NotificationServiceImpl.NOTIFICATIONS_LAST_FETCHED_AT_KEY, 
            this.notificationsLastFetchedAt.toISOString()
        );
    }
    // </notificationsLastFetchedAt>
    // <directMessagesLastFetchedAt>
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
    async setDirectMessagesLastFetchedAt(date: Date) {
        await this.ensureInitialized();
        this.directMessagesLastFetchedAt = date;
        await AsyncStorage.setItem(
            NotificationServiceImpl.DIRECT_MESSAGES_LAST_FETCHED_AT_KEY,
             date.toISOString()
        );
    }
    async resetDirectMessagesLastFetchedAt() {
        await this.ensureInitialized();
        this.directMessagesLastFetchedAt = new Date(0);
        await AsyncStorage.setItem(
            NotificationServiceImpl.DIRECT_MESSAGES_LAST_FETCHED_AT_KEY,
             this.directMessagesLastFetchedAt.toISOString()
        );
    }
    // </directMessagesLastFetchedAt>
    // </AsyncStorage>

    // <Initialize>
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
    // </Initialize>

    constructor(
        /// 新しい通知を取得した場合に呼びだされるコールバック．
        /// 渡されるリストの長さは1以上である．
        /// addOnNewNotificationListenerで動的に追加することも可能．
        private newNotificationListeners: ((newNotifications: Notification[]) => void)[] = [],
        /// 新しいダイレクトメッセージを取得した場合に呼びだされるコールバック．
        /// 渡されるリストの長さは1以上である．
        /// addOnNewDirectMessageListenerで動的に追加することも可能．
        private newDirectMessageListeners: ((newDirectMessages: DirectMessage[]) => void)[] = [],
    ) {}

    // <updateListener>
    addOnNewNotificationListener(listener: (newNotification: Notification[]) => void) {
        this.newNotificationListeners.push(listener);
    }
    addOnNewDirectMessageListener(listener: (newDirectMessage: DirectMessage[]) => void) {
        this.newDirectMessageListeners.push(listener);
    }
    // </updateListener>

    // <fetch>
    private static NotificationDocRef = firestore.collection("Notifications");
    /// firebaseに新規のお知らせが登録されていないか確認し，登録されている場合はキャッシュしてリスナに通知します．
    async fetchNotifications() {
        await this.ensureInitialized();
        const fetchingNotificationsAt = new Date();
        // 新規おしらせの取得
        // 複数フィールドに条件付けするクエリを発行する際はfirebaseでindexを作成する必要がある．
        // !! firebaseのフィールド構造に依存 !!
        const newNotificationDocs = await NotificationServiceImpl.NotificationDocRef
            .where("publishedAt",">=",this.notificationsLastFetchedAt)
            .where("outdatedAt",">=",fetchingNotificationsAt)
            .get();
        const newNotifications = newNotificationDocs.docs.map((doc) => {
            const data = doc.data();
            // !! firebaseのフィールド構造に依存 !!
            return new Notification(
                doc.id,
                data.title,
                new PictogramResource(new URL(data.pictogramResource)),
                data.publishedAt.toDate(),
                data.note,
                new URL(data.link),
                data.role,
            );
        });
        // 取得したお知らせを各処理に分配
        for (const listener of this.newNotificationListeners) listener(newNotifications);
        await this.pushNotifications(newNotifications);
        // 最終取得日時を更新
        await this.setNotificationsLastFetchedAt(fetchingNotificationsAt);
        return this.notifications;
    }
    private static DirectMessageDocRef = firestore.collection("DirectMessages");
    /// firebaseに新規のダイレクトメッセージが登録されていないか確認し，登録されている場合はキャッシュしてリスナに通知します．
    async fetchDirectMessages() {
        await this.ensureInitialized();
        const fetchingDirectMessagesAt = new Date();
        // 新規ダイレクトメッセージの取得
        // 複数フィールドに条件付けするクエリを発行する際はfirebaseでindexを作成する必要がある．
        const targetUserId = await getUserId();
        console.log(targetUserId);
        // !! firebaseのフィールド構造に依存 !!
        const newDirectMessageDocs = await NotificationServiceImpl.DirectMessageDocRef
            .where("publishedAt",">=",this.directMessagesLastFetchedAt)
            .where("outdatedAt",">=",fetchingDirectMessagesAt)
            .where("targetUserId","==",targetUserId)
            .get();
        const newDirectMessages = newDirectMessageDocs.docs.map((doc) => {
            const data = doc.data();
            // !! firebaseのフィールド構造に依存 !!
            return new DirectMessage(
                doc.id,
                data.title,
                new PictogramResource(new URL(data.pictogramResource)),
                data.publishedAt.toDate(),
                data.note,
                data.content,
            );
        });
        // 取得した新規ダイレクトメッセージを各処理に分配
        for (const listener of this.newDirectMessageListeners) listener(newDirectMessages);
        await this.pushDirectMessages(newDirectMessages);
        // 最終取得日時を更新
        await this.setDirectMessagesLastFetchedAt(fetchingDirectMessagesAt);
        return this.directMessages;
    }
    // </fetch>
    // <dismiss>
    async dismissNotification(id: NotificationId) {
        await this.ensureInitialized();
        // idが一致する要素をキャッシュから削除
        this.notifications = this.notifications.filter((n) => n.id !== id);
        await AsyncStorage.setItem(
            NotificationServiceImpl.NOTIFICATIONS_KEY, 
            JSON.stringify(this.notifications.map((n) => n.toString()))
        );
    }
    async dismissDirectMessage(id: DirectMessageId) {
        await this.ensureInitialized();
        // idが一致する要素をキャッシュから削除
        this.directMessages = this.directMessages.filter((dm) => dm.id !== id);
        await AsyncStorage.setItem(
            NotificationServiceImpl.DIRECT_MESSAGES_KEY, 
            JSON.stringify(this.directMessages.map((dm) => dm.toString()))
        );

    }
    // </dismiss>

    async resetState() {
        await this.clearNotifications();
        await this.resetNotificationsLastFetchedAt();
        await this.clearDirectMessages();
        await this.resetDirectMessagesLastFetchedAt();
    }
}

// </implementation>
