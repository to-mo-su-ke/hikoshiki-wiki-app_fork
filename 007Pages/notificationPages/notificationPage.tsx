import React, { useEffect, useState } from 'react';
import { Text, Button, Image } from 'react-native';
import { NotificationService, NotificationServiceImpl, Notification, DirectMessage, PictogramResource } from './notificationService';
import { FlatList } from 'react-native-gesture-handler';

const  notificationService: NotificationService = new NotificationServiceImpl();

// notification serviceのデバッグ用に用意したコンポーネントです．
// notificationServiceブランチ以外では置き換えてください．


export const NotificationPage = ({navigation}) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [directMessages, setDirectMessages] = useState<DirectMessage[]>([]);
    useEffect(() => {
        try {
        notificationService.fetchNotifications().then((fetchedValue) => {
            setNotifications(fetchedValue);
        })
        } catch (e) {
            console.error(e);
        }
        try{
            notificationService.fetchDirectMessages().then((fetchedValue) => {
                setDirectMessages(fetchedValue);
            })
        } catch (e) {
            console.error(e);
        }
    }, []);

    const notificationRenderer = ({ item }: { item: Notification }) => {
        return <>
        <Text>{item.title}(#{item.id})</Text>
        <Button title="dismiss" onPress={async () => {
            await notificationService.dismissNotification(item.id);
            // dismissメソッドは飽くまでサービスの内部状態を変更するだけなので，ビューに反映させるために
            // 以下のようにsetStateを呼び出す必要がある．
            setNotifications(notifications.filter((notification) => notification.id !== item.id));
        }} />
        </>;
    }
    const directMessageRenderer = ({ item }: { item: DirectMessage }) => {
        return <>
            <Text>{item.title}(#{item.id})</Text>

            {/* DMのページへ遷移させるボタン2つ */}
            <Button title={item.title} onPress={()=>{
                 navigation.navigate('DMPage')
            }}/>  
            <Button title="detail" onPress={()=>{
                 navigation.navigate('DMDetailPage',{item})
            }}/>           

            <Button title="dismiss" onPress={async () => {
                await notificationService.dismissDirectMessage(item.id);
                // dismissメソッドは飽くまでサービスの内部状態を変更するだけなので，ビューに反映させるために
                // 以下のようにsetStateを呼び出す必要がある．
                setDirectMessages(directMessages.filter((directMessage) => directMessage.id !== item.id));
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


        {/* これ以下はデバッグ用です。削除してください */}
        <Button title="detail" onPress={()=>{
                const DMId = 'dummyId'
                 navigation.navigate('DMDetailPage',{DMId})
            }}/>  
    </>;
};




