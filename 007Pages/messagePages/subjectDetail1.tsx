import React, { useCallback, useEffect, useState } from 'react';
import { Button, Text, Linking } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { firestore,submitDataToFirestore } from '../../004BackendModules/messageMetod/firestore';
import { increment,Timestamp, collection, addDoc, getDocs, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { ScrollView } from 'react-native-gesture-handler';
import { getUserId } from '../../004BackendModules/messageMetod/firebase';

//detail1はfirebaseの構築でDetailTemplate1に対応
//syllabusに沿って評価保存されているfirebaseで用いる


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
        <Button title="sport" onPress={() => { navigation.navigate('SubjectDetailScreen', { subjectId: "sport" }) }} />
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
    <ScrollView>
        <Button title='go back' onPress={() => { navigation.pop() }} />
        <SubjectDetailSection subjectId={subjectId} />
        <QuantitativeReviewSection subjectId={subjectId} />
        <ReviewMessageSection subjectId={subjectId} />
    </ScrollView>
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
    attendance: number;
    criteria: number;
}
type ReviewMessage = {
    reviewId: string;
    userName: string;
    whenTheUserTakesTheSubject: Date;
    content: string;
    likes: number;
    liked: boolean;
}

const textArray = ["テスト","課題","両方","不明","その他"] //アンケート結果(評価基準)の数字との対応表
// </entities>

// <repository>
// データの取得方法を抽象化
interface SubjectDetailRepository {
    getSubjectDetail(subjectId: string): Promise<SubjectDetail>; //教科の詳細(教科名・教授名など)を受け取る
    getQuantitativeReview(subjectId: string): Promise<QuantitativeSubjectReview>; //レビューを読み取り平均値を計算して返す
    getReviewMessages(subjectId: string, currentUserId: string): Promise<ReviewMessage[]>; //メッセージのリストを受け取る
    likeReviewMessage(subjectId: string, reviewId: string, currentUserId: string): Promise<void>; //いいねが押されたときにdatabaseを更新する
    dislikeReviewMessage(subjectId: string, reviewId: string, currentUserId: string): Promise<void>; //いいねが取り消されたときにdatabaseを更新する
}

class SubjectDetailRepository implements SubjectDetailRepository {
    async getSubjectDetail(subjectId: string) {
        let subjectDoc = await firestore.doc(`DetailTemplate1/${subjectId}`).get();
        let syllabus_ref = subjectDoc.get('syllabus');
        let syllabusDoc = await firestore.doc(syllabus_ref).get();
        return{
            nameOfSubject: syllabusDoc.get('courseTitle'),
            nameOfTeacher: syllabusDoc.get('instructor'),
            linkOfSyllabus: syllabusDoc.get('syllabusUrl'), 
            textbookDescription: syllabusDoc.get('textbook'),
            credits: syllabusDoc.get('credits'),
            gradesDescription: "C,B,A" //変更
        }
    }
    async getQuantitativeReview(subjectId: string) {
        let subjectDoc = await firestore.doc(`DetailTemplate1/${subjectId}`).get();
        let documentNumber = subjectDoc.get('documentNumber')
        let review = {
            grossRating: subjectDoc.get('grossRating')/documentNumber,
            understandabilityOfClasses: subjectDoc.get('understandabilityOfClasses')/documentNumber,
            understandabilityOfDocs: subjectDoc.get('understandabilityOfDocs')/documentNumber,
            difficultyOfExam: subjectDoc.get('difficultyOfExam')/documentNumber,
            easinessOfObtainingCredit: subjectDoc.get('easinessOfObtainingCredit')/documentNumber,
            personalityOfTeacher: subjectDoc.get('personalityOfTeacher')/documentNumber,
            attendance: subjectDoc.get('attendance')/documentNumber,
            criteria: subjectDoc.get('criteria')/documentNumber
        }
        return review //それぞれの評価の平均値を返す
    }
    async getReviewMessages(subjectId: string, currentUserId: string) {
        let message_collection= await firestore.collection(`DetailTemplate1/${subjectId}/message`)
                .orderBy('term') //日付で並び替え
                .get();
        // データベースから取得した課題情報をAssignment型に変換
        let messages: ReviewMessage[] = [];
        for (let doc of message_collection.docs) {
            let userId=doc.get('userId');
            let user_doc=await firestore.doc(`user/${userId}`).get()
            let liked_doc=await firestore.doc(`DetailTemplate1/${subjectId}/message/${doc.id}/likedUser/${currentUserId}`).get()
            messages.push({
                reviewId: doc.id,
                userName: user_doc.get('username'),
                whenTheUserTakesTheSubject: doc.get('term').toDate(),
                content: doc.get('content'),
                likes: doc.get('likes'),
                liked: liked_doc.exists, //LikedUserにUserIDがある場合は, いいね済みと処理
            });
        }
        return messages //メッセージのリストを返す
    }
    async likeReviewMessage(subjectId: string, reviewId: string, currentUserId: string) {
        let message_doc=firestore.doc(`DetailTemplate1/${subjectId}/message/${reviewId}`)
        let liked_doc=firestore.doc(`DetailTemplate1/${subjectId}/message/${reviewId}/likedUser/${currentUserId}`)
        message_doc.update({
            likes: increment(1) //いいねの数を増やす
        })
        liked_doc.set({}) //LikedUserにUserIdを保存
    }
    async dislikeReviewMessage(subjectId: string, reviewId: string, currentUserId: string) {
        let message_doc=firestore.doc(`DetailTemplate1/${subjectId}/message/${reviewId}`)
        let liked_doc=firestore.doc(`DetailTemplate1/${subjectId}/message/${reviewId}/likedUser/${currentUserId}`)
        message_doc.update({
            likes: increment(-1) //いいねの数を減らす
        })
        liked_doc.delete() //LikedUser中のUserIdを削除
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
type SubjectDetailSectionProps = { subjectId: string; }
const SubjectDetailSection = ({ subjectId }: SubjectDetailSectionProps) => {
    // <リポジトリからsubjectDetailを取得できるまでローディング要素を表示>
    const [subjectDetail, setSubjectDetail] = useState<SubjectDetail | null>(null);
    useEffect(() => {
        subjectDetailRepository.getSubjectDetail(subjectId).then(setSubjectDetail);
    }, [subjectId]);
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
type QuantitativeReviewSectionProps = { subjectId: string; }
const QuantitativeReviewSection = ({ subjectId }: QuantitativeReviewSectionProps) => {
    // <リポジトリからreviewを取得できるまでローディング要素を表示>
    const [review, setReview] = useState<QuantitativeSubjectReview | null>(null);
    useEffect(() => {
        subjectDetailRepository.getQuantitativeReview(subjectId).then(setReview);
    }, [subjectId]);
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
        <Text> 出席確認の頻度: </Text>
        <RatingBar rating={review.attendance} />
        <Text> 評価基準: </Text>
        <Text> {textArray[Math.round(review.criteria)]} </Text>
    </>
}
type RatingBarProps = { rating: number; }
const RatingBar = ({ rating }: RatingBarProps) => {
    return <Text> {'★'.repeat(Math.round(rating))} </Text>
}


// 一番下のセクション
// レビューメッセージを一覧表示
type ReviewMessageSectionProps = { subjectId: string; }
const ReviewMessageSection = ({ subjectId }: ReviewMessageSectionProps) => {
    const [reviewMessages, setReviewMessages] = useState<ReviewMessage[]>([]);
    const [currentUserId, setCurrentUserId] = useState('');
    useEffect(() => {
        getUserId().then(setCurrentUserId)
        subjectDetailRepository.getReviewMessages(subjectId, currentUserId).then(setReviewMessages);
    }, [subjectId,currentUserId]);
    return <>
        {reviewMessages.map((reviewMessage) => <ReviewMessageBox subjectId={subjectId} reviewMessage={reviewMessage} currentUserId={currentUserId} key={reviewMessage.reviewId}/>)}
    </>
}
// 個々のレビューメッセージ
type ReviewMessageBoxProps = { subjectId: string, reviewMessage: ReviewMessage, currentUserId: string; }
const ReviewMessageBox = ({ subjectId, reviewMessage, currentUserId }: ReviewMessageBoxProps) => {
    // <likeボタンの状態を管理>
    const [likes, setLikes] = useState(reviewMessage.likes);
    const [liked, setLiked] = useState(reviewMessage.liked);
    const handleLike = useCallback(() => {
        if (liked) {
            subjectDetailRepository.dislikeReviewMessage(subjectId, reviewMessage.reviewId, currentUserId).then(() => {
                setLikes(likes - 1);
                setLiked(false);
            });
        } else {
            subjectDetailRepository.likeReviewMessage(subjectId, reviewMessage.reviewId, currentUserId).then(() => {
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