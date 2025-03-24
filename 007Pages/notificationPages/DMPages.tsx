import React, { createContext, useContext, useEffect, useState ,useCallback} from 'react';
import { Text, Image,  Button, View, FlatList, StyleSheet } from "react-native";
import { firestore,submitDataToFirestore } from '../../004BackendModules/messageMetod/firestore';
import { getUserId } from '../../004BackendModules/messageMetod/firebase';
import { Timestamp, collection, addDoc, getDocs, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { ScrollView } from 'react-native-gesture-handler';
import { NotificationService, NotificationServiceImpl, Notification, DirectMessage, PictogramResource } from './notificationService';

export const DMDetailPage=({navigation, route})=>{
    const getDirectMessage= async (DMId: string): Promise<DirectMessage>=>{
        const DM_doc = await firestore.doc(`DirectMessages/${DMId}`).get()
        const newDM = new DirectMessage(
            DMId,DM_doc.get("title"),DM_doc.get("pictogramResource"),DM_doc.get("publishedAt").toDate(), DM_doc.get("note"), DM_doc.get("content"))
        return newDM
    }
    const {DMId} = route.params;
    const [DM, setDM] = useState<DirectMessage>(null)
    useEffect(()=>{
        getDirectMessage(DMId).then(setDM)
    },[])
    if(DM==null){
        return<><Text>ロード中</Text></> }
    return <>

    <Button title="go back" onPress={()=>{
        navigation.pop()
    }}/>
    <Text>{DM.registeredDate.toLocaleString()}</Text>
    <DMTitleSection DM={DM}/>
    <DMContextSection DM={DM}/>
    </>
}

//DMのタイトル(とピクトグラム)を表示するセクション
type DMTitleSectionProps={
    DM:DirectMessage
}
const DMTitleSection=({DM}: DMTitleSectionProps)=>{
    //DMに"お気に入り"機能などをつける場合はこっちのセクションにつける(つもり)
    return <>
    <View style={{flexDirection: "row", alignItems: "center"}}>
        <Image source={{ uri: DM.pictogram.toString() }} style={{ width: 50, height: 50}} />
        <Text style={{ fontSize: 30 }}>{DM.title}</Text>
    </View>
    </>
}

//DMの内容を表示するセクション
type DMContextSectionProps={
    DM:DirectMessage
}
const DMContextSection=({DM}:DMContextSectionProps)=>{
    //色を変えたり, 画像を入れたりする場合, その情報をこのセクションで管理(するつもり)
    return<>
        <Text>{DM.content}</Text>
    </>
}



export const DMListPage=({navigation})=>{
    const getDirectMessages=async (): Promise<DirectMessage[]>=>{
        const DMDocs = await firestore.collection('DirectMessages').get()
        let messages: DirectMessage[] = [];
        messages = await Promise.all(DMDocs.docs.map(async (doc)=>{
            let message=new DirectMessage(
                doc.id,
                doc.get('title'),
                doc.get('pictogram'),
                doc.get('publishedAt'),
                doc.get('note'),
                doc.get('content')
            )
            return message
        }));
        return messages;    
    }
    const directMessageRenderer = ({ item }: { item: DirectMessage }) => {
        return <>
            <Button title={item.title} onPress={()=>{
                const DMId=item.id
                navigation.navigate('DMDetailPage',{DMId})
            }}/>           
        </>
    }

    const [DMs, setDMs]=useState<DirectMessage[]>();
    useEffect(()=>{
        getDirectMessages().then(setDMs)
    },[])
    return<>
    <Button title="go back" onPress={()=>{
        navigation.pop()
    }}/>
    <FlatList data={DMs} renderItem={directMessageRenderer}/>
    </>
}
