import React, { useCallback, useEffect, useState } from 'react';
import { Button, Text, Linking } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { firestore,submitDataToFirestore } from '../../004BackendModules/messageMetod/firestore';
import { increment,Timestamp, collection, addDoc, getDocs, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

// 各コンポーネントの引数の型を設定
type StackParamList = {
    DummyScreen: {};
    DummyCheckScreen: {};
    DummyFormScreen: {};
    SubjectDetailScreen: { subjectId: string };
    PrvisionalFormScreen: { subjectId: string };
}
// const Stack = createStackNavigator<StackParamList>();

// <wrapper>
// main compoentsをテストとして表示するためのダミーの遷移元．
// また，実際に使用する際の使い方の参考
type DummyScreenProps = NativeStackScreenProps<StackParamList, 'DummyScreen'>;
export const DummyScreen = ({ navigation, route }: DummyScreenProps) => {
    // * stackにSubjectDetailScreenという名前のスクリーンが登録されていることが前提
    return <>
        <Button title="check" onPress={() => { navigation.navigate('DummyCheckScreen') }} />
        <Button title="form" onPress={() => { navigation.navigate('DummyFormScreen') }} />
    </>
}
// </wrapper>

type DummyCheckScreenProps = NativeStackScreenProps<StackParamList, 'DummyCheckScreen'>;
export const DummyCheckScreen = ({ navigation, route }: DummyCheckScreenProps) => {
    // * stackにSubjectDetailScreenという名前のスクリーンが登録されていることが前提
    return <>
        <Button title='go back' onPress={() => { navigation.pop() }} />
        <Button title="sport" onPress={() => { navigation.navigate('SubjectDetailScreen', { subjectId: "dummyId" }) }} />
        <Button title="english" onPress={() => { navigation.navigate('SubjectDetailScreen', { subjectId: "english" }) }} />
    </>
}


// <main compenets>
// 本ファイルでwrapperを除いて一番外型のコンポーネント
// 本ファイル内では単一の画面を表示するのみ（遷移なし）なので，ここから直接内容を記述する
// 全部ここに書いてもいいが，見づらくなりそうなので適当な位置で分割しておく
type SubjectDetailScreenProps = NativeStackScreenProps<StackParamList, 'SubjectDetailScreen'>;
export const SubjectDetailScreen = ({ navigation, route }: SubjectDetailScreenProps) => {
    const subjectId=route.params.subjectId
    return <>
        <Button title='go back' onPress={() => { navigation.pop() }} />
        <SubjectDetailSection subjectRef={`detail/${subjectId}`} />
        <QuantitativeReviewSection subjectRef={`detail/${subjectId}`} />
        <ReviewMessageSection subjectRef={`detail/${subjectId}`} />
    </>
}
// </main compoents>

// <data>
// <entities>
// このファイル内で使用するデータの構造を定義
type SubjectDetail = {
    nameOfSubject: string;
    nameOfTeacher: string;
    linkOfSyllabus: string;
    textbookDescription: string;
    credits: number;
    gradesDescription: string;
}
type QuantitativeSubjectReview = {
    grossRating: number;
    understandabilityOfClasses: number;
    understandabilityOfDocs: number;
    difficultyOfExam: number;
    easinessOfObtainingCredit: number;
    personalityOfTeacher: number;
}
type ReviewMessage = {
    reviewId: string;
    userName: string;
    whenTheUserTakesTheSubject: Date;
    content: string;
    likes: number;
    liked: boolean;
}
// </entities>

// <repository>
// データの取得方法を抽象化
interface SubjectDetailRepository {
    getSubjectDetail(subjectRef: string): Promise<SubjectDetail>;
    getQuantitativeReview(subjectRef: string): Promise<QuantitativeSubjectReview>;
    getReviewMessages(subjectRef: string): Promise<ReviewMessage[]>;
    likeReviewMessage(subjectRef: string, reviewId: string): Promise<void>;
    dislikeReviewMessage(subjectRef: string, reviewId: string): Promise<void>;
}

class SubjectDetailRepository implements SubjectDetailRepository {
    async getSubjectDetail(subjectRef: string) {
        let subjectDoc = await firestore.doc(subjectRef).get();
        let syllabus_ref = subjectDoc.get('syllabus');
        let syllabusDoc = await firestore.doc(syllabus_ref).get();
        return{
            nameOfSubject: syllabusDoc.get('courseTitle'),
            nameOfTeacher: syllabusDoc.get('instructor'),
            linkOfSyllabus: "", //シラバスはアプリ内のシラバスページか, 外部のページか
            textbookDescription: syllabusDoc.get('textbook'),
            credits: syllabusDoc.get('credits'),
            gradesDescription: subjectDoc.get('grades')  
        }
    }
    async getQuantitativeReview(subjectRef: string) {
        let subjectDoc = await firestore.doc(subjectRef).get();
        return {
            grossRating: subjectDoc.get('grossRating'),
            understandabilityOfClasses: subjectDoc.get('understandabilityOfClasses'),
            understandabilityOfDocs: subjectDoc.get('understandabilityOfDocs'),
            difficultyOfExam: subjectDoc.get('difficultyOfExam'),
            easinessOfObtainingCredit: subjectDoc.get('easinessOfObtainingCredit'),
            personalityOfTeacher: subjectDoc.get('personalityOfTeacher')
        }
    }
    async getReviewMessages(subjectRef: string) {
        let message_collection= await firestore.collection(`${subjectRef}/message`)
                .orderBy('term')
                .get();
        // データベースから取得した課題情報をAssignment型に変換
        let messages: ReviewMessage[] = [];
        for (let doc of message_collection.docs) {
            let userId=doc.get('userId');
            let user_doc=await firestore.doc(`user/${userId}`).get()
            messages.push({
                reviewId: doc.id,
                userName: user_doc.get('username'),
                whenTheUserTakesTheSubject: doc.get('term').toDate(),
                content: doc.get('content'),
                likes: doc.get('likes'),
                liked: false,
            });
        }
        return messages
    }
    async likeReviewMessage(subjectRef: string, reviewId: string) {
        let message_doc=firestore.doc(`${subjectRef}/message/${reviewId}`)
        message_doc.update({
            likes: increment(1)
        })
    }
    async dislikeReviewMessage(subjectRef: string, reviewId: string) {
        let message_doc=firestore.doc(`${subjectRef}/message/${reviewId}`)
        message_doc.update({
            likes: increment(-1)
        })
    }
}
// </repository>

// 抽象化されたデータ取得方法のダミーの実装


// データ取得方法の（実装を）指定
const subjectDetailRepository = new SubjectDetailRepository();

// </data>

// <sub components>
// メインコンポーネントから呼び出されるサブコンポーネント（Section）を定義（適当なまとまりで分割）

// 一番上のセクション
type SubjectDetailSectionProps = { subjectRef: string; }
const SubjectDetailSection = ({ subjectRef }: SubjectDetailSectionProps) => {
    // <リポジトリからsubjectDetailを取得できるまでローディング要素を表示>
    const [subjectDetail, setSubjectDetail] = useState<SubjectDetail | null>(null);
    useEffect(() => {
        subjectDetailRepository.getSubjectDetail(subjectRef).then(setSubjectDetail);
    }, [subjectRef]);
    // </リポジトリからsubjectDetailを取得できるまでローディング要素を表示>
    if (subjectDetail === null) {
        return <Text> ロード中 </Text>
    }
    return <>
        <Text>講義詳細</Text>
        <Text> {subjectDetail.nameOfSubject} ({subjectDetail.nameOfTeacher}) </Text>
        <LinkedText url={subjectDetail.linkOfSyllabus} text="シラバスリンク" />
        <Text> 教科書: {subjectDetail.textbookDescription} </Text>
        <Text> 単位数: {subjectDetail.credits} </Text>
        <Text> 成績評価: {subjectDetail.gradesDescription} </Text>
    </>
}
// 参考: https://reactnative.dev/docs/linking
// aタグのようなもの
type LinkedTextProps = { url: string; text: string; }
const LinkedText = ({ url, text }: LinkedTextProps) => {
    const handlePress = useCallback(async () => {
        // URLが開けるなら開く
        if (await Linking.canOpenURL(url)) {
            await Linking.openURL(url);
        }
    }, [url]);
    return <Button title={text} onPress={handlePress} />;
}


// 真ん中のセクション
type QuantitativeReviewSectionProps = { subjectRef: string; }
const QuantitativeReviewSection = ({ subjectRef }: QuantitativeReviewSectionProps) => {
    // <リポジトリからreviewを取得できるまでローディング要素を表示>
    const [review, setReview] = useState<QuantitativeSubjectReview | null>(null);
    useEffect(() => {
        subjectDetailRepository.getQuantitativeReview(subjectRef).then(setReview);
    }, [subjectRef]);
    if (review === null) {
        return <Text> ロード中 </Text>
    }
    // </リポジトリからreviewを取得できるまでローディング要素を表示>
    return <>
        <Text> レビュー </Text>
        <Text> 総合評価: </Text>
        <RatingBar rating={review.grossRating} />
        <Text> 授業のわかりやすさ:</Text>
        <RatingBar rating={review.understandabilityOfClasses} />
        <Text> 資料のわかりやすさ: </Text>
        <RatingBar rating={review.understandabilityOfDocs} />
        <Text> テストの難しさ: </Text>
        <RatingBar rating={review.difficultyOfExam} />
        <Text> 単位の取りやすさ: </Text>
        <RatingBar rating={review.easinessOfObtainingCredit} />
        <Text> 教授の人間性: </Text>
        <RatingBar rating={review.personalityOfTeacher} />
    </>
}
type RatingBarProps = { rating: number; }
const RatingBar = ({ rating }: RatingBarProps) => {
    return <Text> {'★'.repeat(Math.round(rating))} </Text>
}


// 一番下のセクション
// レビューメッセージを一覧表示
type ReviewMessageSectionProps = { subjectRef: string; }
const ReviewMessageSection = ({ subjectRef }: ReviewMessageSectionProps) => {
    const [reviewMessages, setReviewMessages] = useState<ReviewMessage[]>([]);
    useEffect(() => {
        subjectDetailRepository.getReviewMessages(subjectRef).then(setReviewMessages);
    }, [subjectRef]);
    return <>
        {reviewMessages.map((reviewMessage) => <ReviewMessageBox subjectRef={subjectRef} reviewMessage={reviewMessage} key={reviewMessage.reviewId}/>)}
    </>
}
// 個々のレビューメッセージ
type ReviewMessageBoxProps = { subjectRef: string, reviewMessage: ReviewMessage; }
const ReviewMessageBox = ({ subjectRef, reviewMessage }: ReviewMessageBoxProps) => {
    // <likeボタンの状態を管理>
    const [likes, setLikes] = useState(reviewMessage.likes);
    const [liked, setLiked] = useState(reviewMessage.liked);
    const handleLike = useCallback(() => {
        if (liked) {
            subjectDetailRepository.dislikeReviewMessage(subjectRef, reviewMessage.reviewId).then(() => {
                setLikes(likes - 1);
                setLiked(false);
            });
        } else {
            subjectDetailRepository.likeReviewMessage(subjectRef, reviewMessage.reviewId).then(() => {
                setLikes(likes + 1);
                setLiked(true);
            });
        }
    }, [reviewMessage,liked]);
    // </likeボタンの状態を管理>
    return <>
        <Text> {reviewMessage.whenTheUserTakesTheSubject.toISOString()} {reviewMessage.userName} </Text>
        <Text> {reviewMessage.content} </Text>
        <Button title={(liked ? '♥' : '♡') + likes.toString()} onPress={handleLike} />
    </>
}
// </sub components>