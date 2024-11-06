import React, { createContext, useContext, useEffect, useState } from 'react';
import { TextInput } from 'react-native';
import { Message } from  '../types/message';
import { MessageItem } from '../pages/messageitem';
import { createStackNavigator } from "@react-navigation/stack";
import { NativeStackScreenProps, NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text, Button, View } from "react-native";

import { db, getUserId } from '../lib/firebase'; 
import { Timestamp, collection, addDoc, getDocs, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

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
    name: string;
    dueDate: Timestamp;
}
// </types>



// <main component>
// exportするコンポーネント．つまり，このファイルに記述されるコンポーネントの中で一番外側に来るもの．
// ここでは画面遷移などを扱い，内容はここには書かない.SubjectBulletin(授業掲示板)Screenの内容はSubjectBulletinContentに書く．


// RootのStack.Navigatorに次の記述を追加すればこのページに遷移できます．
// <Stack.Screen name="SubjectBulletinScreen" component={SubjectBulletinScreen} options={{subjectRef: 'xxx'}}/>
// 動作確認時はinitialRouteNameをSubjectBulletinScreenにするのが楽です
// subjectIdではなく，subjectRefを用いているので注意してください．
// subjectRefはReferenceを意味し，subjectRef = 'zyugyo/<subjectId>'です．これはFirestore内のドキュメントパスに対応します．

// 以下はIdからReferenceを生成する関数です．
export const subjectIdToRef = (subjectId: string) => `zyugyo/${subjectId}`;

// [SubjectBulletinScreenProps]を定義するためのダミー．実際は呼び出し元のコンポーネントの定義による．
type RootStackParamList = {
    SubjectBulletinScreen: { subjectRef: string };
    Home: undefined;
}
type SubjectBulletinScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'SubjectBulletinScreen'>,
    subjectRef: string,
}

// ページごとにrouteに格納されるパラメータの設定
type StackParamList = {
    BulletinContent: {};
    ThreadScreen: { thread: Thread, threadRepo: ForumRepository };
}
const Stack = createStackNavigator<StackParamList>();

// 参考: https://reactnavigation.org/docs/hello-react-navigation
export const SubjectBulletinScreen = ({navigation, subjectRef}: SubjectBulletinScreenProps) => {
    return (
        <Stack.Navigator initialRouteName="BulletinContent" screenOptions={
            {headerShown: false,}
        }>
            <Stack.Screen name="BulletinContent">{
                (props)=>
                <CourseBulletinContent 
                    {...props} 
                    subjectRef={subjectRef} 
                    goBack={
                        () => navigation.replace('Home')
                }/>
            }
            </Stack.Screen>

            <Stack.Screen name="ThreadScreen" component={ThreadScreen}/>
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
interface CourseInfoRepository {
    getSubjectName(subjectRef: string): Promise<string>;
}
interface AssignmentInfoRepository {
    getAssignments(subjectRef: string): Promise<Assignment[]>;
    saveAssignment(subjectRef: string, assignment: Assignment): Promise<void>;
}
interface ForumRepository {
    getThreads(subjectRef: string): Promise<Thread[]>;
    // Messege型はここで定義せずにtypes/message.tsを参照している
    getMessages(threadRef: string): Promise<Message[]>;
    sendMessage(threadRef: string, message: Message): Promise<void>;
}
// </data>



// <repository implementations>
class CurrentUserImpl implements CurrentUser {
    _id: string = '';
    _name: string = '';
    initialized: boolean = false;
    constructor() {
        getUserId().then((userId) => {
            this._id = userId;
            return getDocs(collection(db, "user"));
        }).then((docs)=>{
            docs.forEach((doc) => {
                if (doc.id != this._id) {return;}
                this._name = doc.data().username;
            })
            this.initialized = true;
        });
    }
    get id(): string {
        return this._id;
    }
    get name(): string {
        return this._name;
    }
}
class AssignmentInfoRepositoryImpl implements AssignmentInfoRepository {
    async getTargetDocForSubject(subjectRef: string) {
        let directories = subjectRef.split('/');
        console.log(directories);
        let docs = await getDocs(collection(db, directories[0]));
        console.log(docs);
        let target: QueryDocumentSnapshot<DocumentData, DocumentData> | null = null;
        for (const doc of docs.docs) {
            if (doc.id == subjectRef) {
                target = doc;
                break;
            }
        }
        return target;
    }
    async getAssignments(subjectRef: string): Promise<Assignment[]> {
        let zyugyouDoc = await this.getTargetDocForSubject(subjectRef);
        // asita??????? 何だそれ???
        let asitaDocs = await getDocs(zyugyouDoc.data().asita);

        type Assignment_variant = {
            homework: string;
        }

        const assignments: Assignment[] = [];
        for (const doc of asitaDocs.docs) {
            const data = doc.data() as Assignment_variant;
            assignments.push({
                ref: doc.id,
                name: data.homework,
                dueDate: Timestamp.now(),
            });
        }
        return assignments;
    }
    async saveAssignment(subjectRef: string, assignment: Assignment): Promise<void> {
        let zyugyouDoc = await this.getTargetDocForSubject(subjectRef);
        // asita???????
        addDoc(zyugyouDoc.data().asita, {'homework': assignment.name});
    }
}
// </repository implementations>



// <mock data>
// インターフェイスの実装として，ダミーのデータを返すクラス（動作確認用）
class MockCurrentUser implements CurrentUser {
    get id(): string {
        return 'user1';
    }
    get name(): string {
        return 'Alice';
    }
}
class MockCourseInfoRepository implements CourseInfoRepository {
    async getSubjectName(courseId: string): Promise<string> {
        return 'コンピュータサイエンス';
    }
}
class MockAssignmentInfoRepository implements AssignmentInfoRepository {
    async getAssignments(courseId: string): Promise<Assignment[]> {
        const now = Timestamp.now();
        const yesterday = Timestamp.fromMillis(now.toMillis() - 24 * 60 * 60 * 1000);
        return [
            {
                ref: '1',
                name: '課題1',
                dueDate: yesterday,
            },
            {
                ref: '2',
                name: '課題2',
                dueDate: now,
            },
        ]
    }
    async saveAssignment(courseId: string, assignment: Assignment): Promise<void> {
        return;
    }
}
class MockForumRepository implements ForumRepository {
    async getThreads(contextRef: string): Promise<Thread[]> {
        const now = Timestamp.now();
        const yesterday = Timestamp.fromMillis(now.toMillis() - 24 * 60 * 60 * 1000);
        return [
            {
                ref: '1',
                signature: '',
                initialMessage: {
                    id: '1',
                    text: '最初のメッセージ',
                    createdAt: yesterday,
                    userId: 'user1',
                    userName: 'Alice',
                }
            },
            {
                ref: '2',
                signature: '',
                initialMessage: {
                    id: '2',
                    text: '最初のメッセージ',
                    createdAt: yesterday,
                    userId: 'user2',
                    userName: 'Bob',
                }
            },
        ]
    }
    async getMessages(threadRef: string): Promise<Message[]> {
        const now = Timestamp.now();
        const yesterday = Timestamp.fromMillis(now.toMillis() - 24 * 60 * 60 * 1000);
        const aMomentLater = Timestamp.fromMillis(yesterday.toMillis() + 60 * 1000);
        if (threadRef === '1') {
            return [
                {
                    id: '1',
                    text: '最初のメッセージ',
                    createdAt: yesterday,
                    userId: 'user1',
                    userName: 'Alice',
                },
                {
                    id: '3',
                    text: 'メッセージ2',
                    createdAt: aMomentLater,
                    userId: 'user2',
                    userName: 'Bob',
                },
            ]
        } else {
            return [
                {
                    id: '2',
                    text: '最初のメッセージ',
                    createdAt: yesterday,
                    userId: 'user2',
                    userName: 'Bob',
                }
            ]
        }
    }
    async sendMessage(threadRef: string, message: Message): Promise<void> {
        return;
    }
}
class MockForumRepository1 implements ForumRepository {
    async getThreads(context: string): Promise<Thread[]> {
        const now = Timestamp.now();
        const yesterday = Timestamp.fromMillis(now.toMillis() - 24 * 60 * 60 * 1000);
        return [
            {
                ref: '1',
                signature: '',
                initialMessage: {
                    id: '1',
                    text: '最初のメッセージ',
                    createdAt: yesterday,
                    userId: 'user1',
                    userName: 'Alice',
                }
            },
            {
                ref: '2',
                signature: '',
                initialMessage: {
                    id: '2',
                    text: '最初のメッセージ',
                    createdAt: yesterday,
                    userId: 'user2',
                    userName: 'Bob',
                }
            },
        ]
    }
    async getMessages(threadRef: string): Promise<Message[]> {
        const now = Timestamp.now();
        const yesterday = Timestamp.fromMillis(now.toMillis() - 24 * 60 * 60 * 1000);
        const aMomentLater = Timestamp.fromMillis(yesterday.toMillis() + 60 * 1000);
        if (threadRef === '1') {
            return [
                {
                    id: '1',
                    text: '最初のメッセージ',
                    createdAt: yesterday,
                    userId: 'user1',
                    userName: 'Alice',
                },
                {
                    id: '3',
                    text: 'メッセージ2',
                    createdAt: aMomentLater,
                    userId: 'user2',
                    userName: 'Bob',
                },
            ]
        } else {
            return [
                {
                    id: '2',
                    text: '最初のメッセージ',
                    createdAt: yesterday,
                    userId: 'user2',
                    userName: 'Bob',
                }
            ]
        }
    }
    async sendMessage(threadRef: string, message: Message): Promise<void> {
        return;
    }
}
class MockForumRepository2 implements ForumRepository {
    async getThreads(contextRef: string): Promise<Thread[]> {
        const now = Timestamp.now();
        const yesterday = Timestamp.fromMillis(now.toMillis() - 24 * 60 * 60 * 1000);
        return [
            {
                ref: '1',
                signature: '',
                initialMessage: {
                    id: '1',
                    text: '最初のメッセージ',
                    createdAt: yesterday,
                    userId: 'user1',
                    userName: 'Alice',
                }
            },
            {
                ref: '2',
                signature: '',
                initialMessage: {
                    id: '2',
                    text: '最初のメッセージ',
                    createdAt: yesterday,
                    userId: 'user2',
                    userName: 'Bob',
                }
            },
        ]
    }
    async getMessages(threadRef: string): Promise<Message[]> {
        const now = Timestamp.now();
        const yesterday = Timestamp.fromMillis(now.toMillis() - 24 * 60 * 60 * 1000);
        const aMomentLater = Timestamp.fromMillis(yesterday.toMillis() + 60 * 1000);
        if (threadRef === '1') {
            return [
                {
                    id: '1',
                    text: '最初のメッセージ',
                    createdAt: yesterday,
                    userId: 'user1',
                    userName: 'Alice',
                },
                {
                    id: '3',
                    text: 'メッセージ2',
                    createdAt: aMomentLater,
                    userId: 'user2',
                    userName: 'Bob',
                },
            ]
        } else {
            return [
                {
                    id: '2',
                    text: '最初のメッセージ',
                    createdAt: yesterday,
                    userId: 'user2',
                    userName: 'Bob',
                }
            ]
        }
    }
    async sendMessage(threadRef: string, message: Message): Promise<void> {
        return;
    }
}
// </mock data>



// <repository instance>
const currentUser: CurrentUser = new CurrentUserImpl();
const courseInfoRepository: CourseInfoRepository = new MockCourseInfoRepository();
const assignmentInfoRepository: AssignmentInfoRepository = new AssignmentInfoRepositoryImpl();
const testForumRepository: ForumRepository = new MockForumRepository();
const infoForumRepository: ForumRepository = new MockForumRepository1();
const freeForumRepository: ForumRepository = new MockForumRepository2();
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
        courseInfoRepository.getSubjectName(subjectRef).then((name) => {
            setCourseName(name);
        })
    }, []);
    return (
        <View>
            <Button title='back' onPress={goBack}/>
            <Text>{courseName} 掲示板</Text>
            <AssignmentInfoView subjectRef={subjectRef}/>
            <Forum title='テストの詳細' forumRepo={testForumRepository} subjectRef={subjectRef} navigation={navigation}></Forum>
            <Forum title='教室移動などの連絡事項' forumRepo={infoForumRepository} subjectRef={subjectRef} navigation={navigation}/>
            <Forum title='掲示板' forumRepo={freeForumRepository} subjectRef={subjectRef} navigation={navigation}/>
        </View>
    )
}

// AssignmentInfoView: 課題の情報を表示する
type AssignmentInfoViewProps = {
    subjectRef: string;
}
const AssignmentInfoView = ({subjectRef}: AssignmentInfoViewProps) => {
    // データベースからの読み込みに時間がかかる可能性があるので遅延取得する
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    useEffect(() => {
        assignmentInfoRepository.getAssignments(subjectRef).then((assignments) => {
            setAssignments(assignments);
        })
    }, []);
    return (<>
        <Text>現在提示中の課題</Text>
        <View>
            {assignments.map((assignment) => (
                <Text key={assignment.ref}>{assignment.name} {assignment.dueDate.toDate().toString()}</Text>
            ))}
        </View>
    </>);
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
    useEffect(() => {
        forumRepo.getThreads(subjectRef).then((threads) => {
            setThreads(threads);
        })
    }, []);

    return (
        <>
            <Text>{title}</Text>
            <View>
                {threads.map((thread) => (
                    <ThreadTitle thread={thread} threadRepo={freeForumRepository} navigation={navigation} key={thread.ref}/>
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

    // データベースからの読み込みに時間がかかる可能性があるので遅延取得する
    const [messages, setMessages] = useState<Message[]>([]);
    useEffect(() => {
        threadRepo.getMessages(thread.ref).then((messages) => {
            setMessages(messages);
        })
    }, [thread.ref, thread.signature]);
    
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
                {messages.map((message) => (
                    // MessageItemはこのファイル内では定義されていない（pages内のものを呼び出している）
                    <MessageItem message={message} userId={currentUser.id} key={message.id}/>
                ))}
            </View>

            <MessagePostForm threadRef={thread.ref} threadRepo={threadRepo}/>
        </>
    )
}

type MessagePostFormProps = {threadRef: string, threadRepo: ForumRepository}
const MessagePostForm = ({threadRef, threadRepo}: MessagePostFormProps) => {
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
        multiline
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
            })
        }
    }/>
    </>
}
// </sub components>