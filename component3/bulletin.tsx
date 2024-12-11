import React, { createContext, useContext, useEffect, useState ,useCallback} from 'react';
import { TextInput } from 'react-native';
import { Message } from  '../types/message';
import { MessageItem } from '../pages/messageitem';
import { createStackNavigator } from "@react-navigation/stack";
import { NativeStackScreenProps, NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text, Button, View, FlatList } from "react-native";
import {useFocusEffect} from '@react-navigation/native';

import { firestore } from '../lib/firestore'; 
import { Timestamp, collection, addDoc, getDocs, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { ScrollView } from 'react-native-gesture-handler';

// <types>
// データ型の定義 本来ここでするべきものではない気もする．
type Thread = {
    ref: string;
    // スレッドの最終更新日時等を表すシグネチャ
    // 更新のたびに変化することによって，クライアントが更新を検知できる
    signature: string;
    initialMessage: Message;
}
type Assignment = {
    ref: string|undefined;
    title: string;
    dueDate: Timestamp;
}
// </types>



// <main component>
// exportするコンポーネント．つまり，このファイルに記述されるコンポーネントの中で一番外側に来るもの．
// ここでは画面遷移などを扱い，内容はここには書かない.SubjectBulletin(授業掲示板)Screenの内容はSubjectBulletinContentに書く．


// RootのStack.Navigatorに次の記述を追加すればこのページに遷移できます．
/**  
<Stack.Screen name="SubjectBulletinScreen">{
    (props)=>
        <SubjectBulletinScreen
            subjectId={`dummy3`} 
            {...props} 
        />
    }
</Stack.Screen>
 * 
*/
// 動作確認時はinitialRouteNameをSubjectBulletinScreenにするのが楽です


// [SubjectBulletinScreenProps]を定義するためのダミー．実際は呼び出し元のコンポーネントの定義による．
type RootStackParamList = {
    SubjectBulletinScreen: { subjectId: string };
    Home: undefined;
}
type SubjectBulletinScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'SubjectBulletinScreen'>,
    subjectId: string,
}

// ページごとにrouteに格納されるパラメータの設定
type StackParamList = {
    BulletinContent: {};
    ThreadScreen: { thread: Thread, threadRepo: ForumRepository };
    MakeThreadScreen: {subjectRef: string,threadRepo: ForumRepository};
    SaveAssignmentScreen: {subjectRef: string};
}
const Stack = createStackNavigator<StackParamList>();

// 参考: https://reactnavigation.org/docs/hello-react-navigation
export const SubjectBulletinScreen = ({navigation, subjectId}: SubjectBulletinScreenProps) => {
    return (
        <Stack.Navigator initialRouteName="BulletinContent" screenOptions={
            {headerShown: false,}
        }>
            <Stack.Screen name="BulletinContent">{
                (props)=>
                <CourseBulletinContent 
                    subjectRef={`zyugyou/${subjectId}`} 
                    goBack={
                        () => navigation.replace('Home')
                    }
                    {...props} 
                />
            }
            </Stack.Screen>

            <Stack.Screen name="ThreadScreen" component={ThreadScreen}/>
            <Stack.Screen name="MakeThreadScreen" component={MakeThreadScreen}/>
            <Stack.Screen name="SaveAssignmentScreen" component={SaveAssignmentScreen}/>
        </Stack.Navigator>
    )
}
// </main component>


// <data>
// リポジトリ (インターフェイス) インターフェイス及び実装は本来ここではなくdatabaseディレクトリに定義されるべきだろうが，ここに記述しておく
// CurrentUserRepositoryはここに記述するべきではないが必要なので記述しておく
interface CurrentUser {
    get id(): string;
    get name(): string;
}
interface SubjectInfoRepository {
    getSubjectName(subjectRef: string): Promise<string>;
}
interface AssignmentInfoRepository {
    getAssignments(subjectRef: string): Promise<Assignment[]>;
    saveAssignment(subjectRef: string, assignment: Assignment): Promise<void>;
    isChangedByOthers(subjectRef: string): Promise<boolean>;
}
interface ForumRepository {
    getThreads(subjectRef: string): Promise<Thread[]>;
    makeThread(subjectRef: string, initialMessage: Message): Promise<Thread>;
    // Messege型はここで定義せずにtypes/message.tsを参照している
    getMessages(threadRef: string): Promise<Message[]>;
    sendMessage(threadRef: string, message: Message): Promise<void>;
    isChangedByOthers(subjectRef: string): Promise<boolean>;
}
// </data>



// <repository implementations>
const newSignature = () => Date.now().toString() + Math.random().toString();
class SubjectInfoRepositoryImpl implements SubjectInfoRepository {
    async getSubjectName(subjectRef: string) {
        let subjectDoc = await firestore.doc(subjectRef).get();
        let syllabus_ref = subjectDoc.get('syllabus');
        let syllabusDoc = await firestore.doc(syllabus_ref).get();
        return syllabusDoc.get('courseTitle');
    }
}
abstract class ChangeDetector {
    signature: string = '';
    isChangeDetected: boolean = false;
    abstract get signatureName(): string;

    /** 初回呼び出し時にもメモリ上にsignatureが設定されていないのでtrueを吐きます */
    async isChangedByOthers(subjectRef: string): Promise<boolean> {
        if (this.isChangeDetected) {
            this.isChangeDetected = false;
            return true;
        } else {
            await this._detectChange(subjectRef);
            if (this.isChangeDetected) {
                this.isChangeDetected = false;
                return true;
            } else {
                return false;
            }
        }
    }

    async _detectChange(subjectRef: string) {
        let subjectDoc = await firestore.doc(subjectRef).get();
        let dbSignature = subjectDoc.get(this.signatureName);
        if (dbSignature !== this.signature) {
            this.signature = dbSignature;
            this.isChangeDetected = true;
        }
    }
    async _updateDBSignature(subjectRef: string) {
        this.signature = newSignature();
        await firestore.doc(subjectRef).update({
            [this.signatureName]: this.signature,
        });
    }
}
class AssignmentInfoRepositoryImpl extends ChangeDetector implements AssignmentInfoRepository{
    /**
     * @param subjectRef zyugyou/[subjectId]
     *  */
    signatureName: string = 'homeworkSignature';
    async getAssignments(subjectRef: string) {
        let homework_collection = 
            await firestore
                .collection(`${subjectRef}/homework`)
                .orderBy('dueDate')
                .get();
        // データベースから取得した課題情報をAssignment型に変換
        let assignments: Assignment[] = [];
        for (let doc of homework_collection.docs) {
            assignments.push({
                ref: `${subjectRef}/homework/${doc.id}`,
                title: doc.get('title'),
                dueDate: doc.get('dueDate'),
            });
        }
        return assignments;
    }
    async saveAssignment(subjectRef: string, assignment: Assignment): Promise<void> {
        let homework_collection = firestore.collection(`${subjectRef}/homework`);
        if (assignment.ref) {
            firestore.doc(assignment.ref).set({
                title: assignment.title,
                dueDate: assignment.dueDate,
            });
        } else {
            await homework_collection.add({
                title: assignment.title,
                dueDate: assignment.dueDate,
            });
        }
        this._detectChange(subjectRef);
        this._updateDBSignature(subjectRef);
    }
}
abstract class ForumRepositoryImpl extends ChangeDetector implements ForumRepository {
    signature: string = '';
    isChangeDetected: boolean = false;
    get signatureName() {
        return this.threadName + 'Signature';
    };
    abstract threadName: string;
    /**
     * @param subjectRef zyugyou/[subjectId]
     *  */
    async getThreads(subjectRef: string): Promise<Thread[]> {
        let threadCollection = firestore.collection(`${subjectRef}/${this.threadName}`).orderBy('createdAt');
        let threads: Thread[] = [];
        let threadDocs = await threadCollection.get();
        for (let doc of threadDocs.docs) {
            let initialMessageDoc = doc.get('initialMessageRef');
            let initial = await firestore.doc(initialMessageDoc).get();
            let userRef = initial.get('userRef');
            let userDoc = await firestore.doc(userRef).get();
            threads.push({
                ref: `${subjectRef}/${this.threadName}/${doc.id}`,
                signature: doc.get('signature'),
                initialMessage: {
                    id: initial.id,
                    text: initial.get('content'),
                    createdAt: initial.get('createdAt'),
                    userId: userDoc.id,
                    userName: userDoc.get("username"),
                }
            });
        }
        return threads.reverse();
    }
    async makeThread(subjectRef: string, initialMessage: Message): Promise<Thread> {
        let threadCollection = firestore.collection(`${subjectRef}/${this.threadName}`);
        let threadDoc = threadCollection.doc();
        let threadSignature = newSignature();
        await threadDoc.set({
            signature: threadSignature,
            initialMessageRef: '',
            createdAt: Timestamp.now(),
        });
        let messageCollection = firestore.collection(`${threadDoc.path}/messages`);
        let initialMessageDoc = await messageCollection.add({
            content: initialMessage.text,
            createdAt: initialMessage.createdAt,
            userRef: `/user/${initialMessage.userId}`,
        });
        await threadDoc.update({
            initialMessageRef: initialMessageDoc.path,
        });
        return {
            ref: threadDoc.id,
            signature: threadSignature,
            initialMessage: initialMessage,
        }
    }
    // Messege型はここで定義せずにtypes/message.tsを参照している
    async getMessages(threadRef: string): Promise<Message[]> {
        let messageCollection = firestore
            .collection(`${threadRef}/messages`)
            .orderBy('createdAt');
        let messages: Message[] = [];
        let messageDocs = await messageCollection.get();
        messages = await Promise.all(messageDocs.docs.map(async (doc)=>{
            let userRef = doc.get('userRef');
            let userDoc = await firestore.doc(userRef).get();
            return {
                id: doc.id,
                text: doc.get('content'),
                createdAt: doc.get('createdAt'),
                userId: userDoc.id,
                userName: userDoc.get('username'),
            }
        }));
        return messages;
    }
    sendMessage(threadRef: string, message: Message): Promise<void> {
        let messageCollection = firestore.collection(`${threadRef}/messages`);
        return messageCollection.add({
            content: message.text,
            createdAt: message.createdAt,
            userRef: `/user/${message.userId}`, 
        }).then(async () => {
            await this._detectChange(threadRef);
            await this._updateDBSignature(threadRef);
        });
    }
}
// </repository implementations>

class TestForumRepository extends ForumRepositoryImpl
{
    threadName="test";
}

class InfoForumRepository extends ForumRepositoryImpl
{
    threadName="info";
}

class FreeForumRepository extends ForumRepositoryImpl
{
    threadName="free";
}
// <mock data>
// インターフェイスの実装として，ダミーのデータを返すクラス（動作確認用）
class MockCurrentUser implements CurrentUser {
    get id(): string {
        return 'APZO4rGLegV9OwSogBVN';
    }
    get name(): string {
        return 'Alice';
    }
}



// <repository instance>
const currentUser: CurrentUser = new MockCurrentUser(); //変更の必要あり
const subjectInfoRepository: SubjectInfoRepository = new SubjectInfoRepositoryImpl();
const assignmentInfoRepository: AssignmentInfoRepository = new AssignmentInfoRepositoryImpl();
const testForumRepository: ForumRepository = new TestForumRepository();
const infoForumRepository: ForumRepository = new InfoForumRepository();
const freeForumRepository: ForumRepository = new FreeForumRepository();
// </repository instance>



// <sub components>
// 掲示板/BulletinBoard: フォーラムの集まり
// CourseBulletinContent: 
type CourseBulletinContentProps = {
    navigation: NativeStackNavigationProp<StackParamList, 'BulletinContent'>; // 掲示板画面内遷移用
    goBack: () => void; // 掲示板画面(本ファイル内で定義される画面領域)から退出する
    subjectRef: string;
}
const CourseBulletinContent = ({navigation, goBack, subjectRef}: CourseBulletinContentProps) => {
    const [courseName, setCourseName] = useState('');
    useEffect(() => {
        subjectInfoRepository.getSubjectName(subjectRef).then((name) => {
            setCourseName(name);
        })
    }, []);
    return (
        <ScrollView>
            <Button title='back' onPress={goBack}/>
            <Text>{courseName} 掲示板</Text>
            <AssignmentForum subjectRef={subjectRef} navigation={navigation}/>
            <Forum title='テストの詳細' forumRepo={testForumRepository} subjectRef={subjectRef} navigation={navigation}></Forum>
            <Forum title='教室移動などの連絡事項' forumRepo={infoForumRepository} subjectRef={subjectRef} navigation={navigation}/>
            <Forum title='掲示板' forumRepo={freeForumRepository} subjectRef={subjectRef} navigation={navigation}/>
        </ScrollView>
    )
}

// AssignmentForum: 課題の情報を表示する
type AssignmentForumProps = {
    subjectRef: string;
    navigation: NativeStackNavigationProp<StackParamList, "BulletinContent", undefined>;
}
const AssignmentForum = ({subjectRef,navigation}: AssignmentForumProps) => {
    // データベースからの読み込みに時間がかかる可能性があるので遅延取得する
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    useFocusEffect(
        useCallback(() => {
            let Active=true;
            assignmentInfoRepository.getAssignments(subjectRef).then((assignments) => {
                if(Active){
                    setAssignments(assignments);
                }
            })
            return ()=>{Active=false;}
        },[]) 
    ); //ページを開く度に更新されるように設定(gobackでも)(signatureに変更の必要あり)
    return (
    <>
        <Text>現在提示中の課題</Text>
        <Button title="+" onPress={
            () => navigation.navigate('SaveAssignmentScreen', {subjectRef: subjectRef})
        }/>  
        <View>
            {assignments.map((assignment,index) => (
                <Text key={index}>{assignment.title} {assignment.dueDate.toDate().toString()}</Text>
            ))}
        </View>
    </>);
}

//Threadをつくる画面
const SaveAssignmentScreen = ({navigation, route}: NativeStackScreenProps<StackParamList, 'SaveAssignmentScreen'>) => {
    const {subjectRef} = route.params; 
    return (
        <>
            <View>
                <Button title='back' onPress={
                    () => navigation.goBack()
                }/>
            </View>
            <SaveAssignmentForm subjectRef={subjectRef}/>
        </>
    )
}

//スレッドの最初のメッセージを入力するテキストボックス
type SaveAssignmentFormProps = {subjectRef: string}
const SaveAssignmentForm = ({subjectRef}: SaveAssignmentFormProps) => {
    const [newMessage, setNewMessage] = useState<string>('');
    const [newDueDate,setnewDueDate] = useState<string>(''); //変更の必要あり
    return <>
    <TextInput
        style={{
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 20,
          height: 100,
          textAlignVertical: "top",
        }}
        placeholder="メッセージを入力"
        value={newMessage}
        onChangeText={(text) => setNewMessage(text)}
        //改行する場合はmultilineを入れる
    />
    <TextInput
        style={{
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 20,
          height: 100,
          textAlignVertical: "top",
        }}
        placeholder="2022-05-05T06:35:20"
        value={newDueDate}
        onChangeText={(text) => setnewDueDate(text)}
        //改行する場合はmultilineを入れる
    />
    <Button title='post' onPress={
        () => {
            let newdueDate=new Date(newDueDate);
            let dueDate=new Timestamp(Math.floor(newdueDate.getTime() / 1000),0)
            assignmentInfoRepository.saveAssignment(subjectRef,{
                
                ref:"",
                title: newMessage,
                dueDate: dueDate,
            }).then(() => {
                setNewMessage('')
                setnewDueDate('')
            })
        }
    }/>
    </>
}

// Forum: フォーラム ThreadTitleの集まり
type ForumProps = {
    title: string;
    forumRepo: ForumRepository;
    subjectRef: string;
    navigation: NativeStackNavigationProp<StackParamList, "BulletinContent", undefined>;
}
const Forum = ({title, subjectRef, forumRepo, navigation}: ForumProps) => {
    // データベースからの読み込みに時間がかかる可能性があるので遅延取得する
    const [threads, setThreads] = useState<Thread[]>([]);
    useFocusEffect(
        useCallback(() => {
            let Active=true;
            forumRepo.getThreads(subjectRef).then((threads) => {
                if(Active){
                    setThreads(threads);
                }
            })
            return ()=>{Active=false;}
        },[]) 
    ); //ページを開く度に更新されるように設定(gobackでも)(signatureに変更の必要あり)
    return (
        <>
            <Text>{title}</Text>
            <Button title="+" onPress={
            () => navigation.navigate('MakeThreadScreen', {subjectRef: subjectRef, threadRepo: forumRepo})
        }/>           
            <View>
                {threads.map((thread,index) => (
                    <ThreadTitle thread={thread} threadRepo={forumRepo} navigation={navigation} key={index}/>
                ))}
            </View>
        </>
    )
}

// ThreadTitle: スレッド画面を表示するボタン
type ThreadTitleProps = {
    thread: Thread, 
    threadRepo: ForumRepository,
    navigation: NativeStackNavigationProp<StackParamList, "BulletinContent", undefined>
}
const ThreadTitle = ({thread, threadRepo, navigation} :ThreadTitleProps) => {   
    return (
        <Button title={thread.initialMessage.text} onPress={
            () => navigation.navigate('ThreadScreen', {thread: thread, threadRepo: threadRepo})
        }/>
    )
}

// ThreadScreen: スレッド画面
const ThreadScreen = ({navigation, route}: NativeStackScreenProps<StackParamList, 'ThreadScreen'>) => {
    const {thread, threadRepo} = route.params;
    const [key,setKey]=useState(0);
    // データベースからの読み込みに時間がかかる可能性があるので遅延取得する
    const [messages, setMessages] = useState<Message[]>([]);
    useEffect(() => {
        threadRepo.getMessages(thread.ref).then((messages) => {
            setMessages(messages);
        })
    }, [thread.ref, thread.signature,key]);

    const ReloadScreen =()=>
    {
        setKey(key + 1)
    }
    //メッセージをpostしたときに, ページ全体の更新をかけるための関数(signatureに変更の必要あり)
    return (
        <>
            <View>
                <Button title='back' onPress={
                    () => navigation.goBack()
                }/>
            </View>
            
            <View>
            <Text>{thread.initialMessage.text}</Text>
            <Text>{thread.initialMessage.userName}</Text>
            <Text>{thread.initialMessage.createdAt.toString()}</Text>
            </View>

            <View>
                {messages.map((message,index) => (
                    // MessageItemはこのファイル内では定義されていない（pages内のものを呼び出している）
                    <MessageItem message={message} userId={currentUser.id} key={index}/>
                ))}
            </View>

            <MessagePostForm threadRef={thread.ref} threadRepo={threadRepo} ReloadScreen={ReloadScreen}/>
        </>
    )
}

type MessagePostFormProps = {threadRef: string, threadRepo: ForumRepository,ReloadScreen: ()=>void}
const MessagePostForm = ({threadRef, threadRepo,ReloadScreen}: MessagePostFormProps) => {
    const [newMessage, setNewMessage] = useState('');
    return <>
    <TextInput
        style={{
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 20,
          height: 100,
          textAlignVertical: "top",
        }}
        placeholder="メッセージを入力"
        value={newMessage}
        onChangeText={(text) => setNewMessage(text)}
        // 改行する場合はmultilineをいれる
    />
    <Button title='post' onPress={
        () => {
            threadRepo.sendMessage(threadRef, {
                id: '',
                text: newMessage,
                createdAt: Timestamp.now(),
                userId: currentUser.id,
                userName: currentUser.name,
            }).then(() => {
                setNewMessage('');
                ReloadScreen();
            })
        }
    }/>
    </>
}

//Threadをつくる画面
const MakeThreadScreen = ({navigation, route}: NativeStackScreenProps<StackParamList, 'MakeThreadScreen'>) => {
    const {subjectRef,threadRepo} = route.params; 
    return (
        <>
            <View>
                <Button title='back' onPress={
                    () => navigation.goBack()
                }/>
            </View>
            <ThreadPostForm subjectRef={subjectRef} threadRepo={threadRepo}/>
        </>
    )
}

//スレッドの最初のメッセージを入力するテキストボックス
//MessagePostFormとThreadPostFormの親をつくるように変更する必要あり
type ThreadPostFormProps = {subjectRef: string, threadRepo: ForumRepository}
const ThreadPostForm = ({subjectRef,threadRepo}: ThreadPostFormProps) => {
    const [newMessage, setNewMessage] = useState('');
    return <>
    <TextInput
        style={{
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 20,
          height: 100,
          textAlignVertical: "top",
        }}
        placeholder="メッセージを入力"
        value={newMessage}
        onChangeText={(text) => setNewMessage(text)}
        //改行する場合はmultilineを入れる
    />
    <Button title='post' onPress={
        () => {
            threadRepo.makeThread(subjectRef,{
                id: '',
                text: newMessage,
                createdAt: Timestamp.now(),
                userId: currentUser.id,
                userName: currentUser.name,
            }).then(() => {
                setNewMessage('')
            })
        }
    }/>
    </>
}
// </sub components>


//その他の変更　編集機能