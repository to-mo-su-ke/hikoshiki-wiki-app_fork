import React, { useEffect, useState } from 'react';
import { Text, Button } from 'react-native';
import { NotificationService, MockNotificationService, Notification, DirectMessage } from './notificationService';
import { FlatList } from 'react-native-gesture-handler';

const  notificationService: NotificationService = new MockNotificationService();

// notification serviceのデバッグ用に用意したコンポーネントです．
// notificationServiceブランチ以外では置き換えてください．
export const NotificationPage = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [directMessages, setDirectMessages] = useState<DirectMessage[]>([]);
    useEffect(() => {
        notificationService.fetchNotifications().then((fetchedValue) => {
            setNotifications(fetchedValue);
        })
        notificationService.fetchDirectMessages().then((fetchedValue) => {
            setDirectMessages(fetchedValue);
        })
    }, []);

    const notificationRenderer = ({ item }: { item: Notification }) => {
        return <>
        <Text>{item.title}</Text>
        <Button title="dismiss" onPress={async () => {
            await notificationService.dismissNotification(item.id);
            await notificationService.fetchNotifications().then((fetchedValue) => {
                setNotifications(fetchedValue);
            })
        }} />
        </>;
    }
    const directMessageRenderer = ({ item }: { item: DirectMessage }) => {
        return <>
            <Text>{item.title}</Text>
            <Button title="dismiss" onPress={async () => {
                await notificationService.dismissDirectMessage(item.id);
                await notificationService.fetchDirectMessages().then((fetchedValue) => {
                    setDirectMessages(fetchedValue);
                })
            }} />
        </>;
    }

    return <>
        <Text>
        NotificationPage
        </Text>
        <Text>notifications</Text>
        <FlatList data={notifications} renderItem={notificationRenderer} />
        <Text>directMessages</Text>
        <FlatList data={directMessages} renderItem={directMessageRenderer} />
    </>;
};

