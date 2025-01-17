import React, { useCallback, useEffect, useState } from 'react';
import { Button, Text, Linking } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { firestore,submitDataToFirestore } from '../../004BackendModules/messageMetod/firestore';
import { increment,Timestamp, collection, addDoc, getDocs, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { ScrollView } from 'react-native-gesture-handler';
import { getUserId } from '../../004BackendModules/messageMetod/firebase';


//detail2はfirebaseの構築でDetailTemplate2に対応
//教科名, 教師名で評価保存されているfirebaseで用いる
//subjectId=シラバス番号

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
        <Button title="sport" onPress={() => { navigation.navigate('SubjectDetailScreen', { subjectId: "0010001" }) }} />
        <Button title="english" onPress={() => { navigation.navigate('SubjectDetailScreen', { subjectId: "0011101" }) }} />
    </>
}


// <main compenets>
// 本ファイルでwrapperを除いて一番外型のコンポーネント
// 本ファイル内では単一の画面を表示するのみ（遷移なし）なので，ここから直接内容を記述する
// 全部ここに書いてもいいが，見づらくなりそうなので適当な位置で分割しておく
type SubjectDetailScreenProps = NativeStackScreenProps<StackParamList, 'SubjectDetailScreen'>;
export const SubjectDetailScreen = ({ navigation, route }: SubjectDetailScreenProps) => {
    const subjectId=route.params.subjectId
    const [reviewKey,setreviewKey]=useState<string>("s")
    return <>
    <ScrollView>
        <Button title='go back' onPress={() => { navigation.pop() }} />
        <SubjectDetailSection subjectId={subjectId} />
        <Button title={reviewKey=="s" ?"講義評価": "教授評価"} onPress={()=>{setreviewKey(reviewKey=="s"? "t":"s")}}/>
        {/* 講義の評価と先生の評価をそれぞれ表示 */}
        <QuantitativeReviewSection subjectId={subjectId} reviewKey={reviewKey}/>
        <ReviewMessageSection subjectId={subjectId} reviewKey={reviewKey} />
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
    getSubjectDetail(subjectId: string): Promise<SubjectDetail>;
    getQuantitativeReview(subjectId: string,reviewKey: string): Promise<QuantitativeSubjectReview>;
    getReviewMessages(subjectId: string,reviewKey: string,uid: string): Promise<ReviewMessage[]>;
    likeReviewMessage(reviewId: string, currentUserId: string): Promise<void>;
    dislikeReviewMessage(reviewId: string, currentUserId: string): Promise<void>;
}

class SubjectDetailRepository implements SubjectDetailRepository {
    async getSubjectDetail(subjectId: string) {
        const subjectRef=`syllabus/${subjectId}`;
        const syllabusDoc=await firestore.doc(subjectRef).get()
        let instructor=syllabusDoc.get('instructor')
        let newInstructor=instructor.replace(/○[\s\S]*/u,"")
        return{
            nameOfSubject: syllabusDoc.get('courseTitle'),
            nameOfTeacher: newInstructor,
            linkOfSyllabus: syllabusDoc.get('syllabusUrl'), 
            textbookDescription: syllabusDoc.get('textbook'),
            credits: syllabusDoc.get('credits'),
            gradesDescription: "C,B,A" //変更
        }
    }
    async getQuantitativeReview(subjectId: string,reviewKey: string) {
        const subjectdetail=await this.getSubjectDetail(subjectId);
        let name = reviewKey=="s"?subjectdetail.nameOfSubject:subjectdetail.nameOfTeacher;
        let colname = reviewKey=="s"?"subjectReview":"teacherReview";
        let reviewDoc = await firestore.doc(`DetailTemplate2/information/${colname}/${name}`).get();
        let documentNumber = reviewDoc.get('documentNumber')
        let review = {
            grossRating: reviewDoc.get('grossRating')/documentNumber,
            understandabilityOfClasses: reviewDoc.get('understandabilityOfClasses')/documentNumber,
            understandabilityOfDocs: reviewDoc.get('understandabilityOfDocs')/documentNumber,
            difficultyOfExam: reviewDoc.get('difficultyOfExam')/documentNumber,
            easinessOfObtainingCredit: reviewDoc.get('easinessOfObtainingCredit')/documentNumber,
            personalityOfTeacher: reviewDoc.get('personalityOfTeacher')/documentNumber
        }
        return review
    }
    async getReviewMessages(subjectId: string,reviewKey: string, uid: string) {
        const subjectdetail=await this.getSubjectDetail(subjectId);
        let name = reviewKey=="s"?subjectdetail.nameOfSubject:subjectdetail.nameOfTeacher;
        let fieldname= reviewKey=="s"?"courseTitle":"instructor"
        let message_collection= await firestore.collection(`DetailTemplate2/information/messages`)
                .where(fieldname,'==',name) //並び替え機能の追加(変更)
                .get();
        // データベースから取得した課題情報をAssignment型に変換
        let messages: ReviewMessage[] = [];
        for (let doc of message_collection.docs) {
            let userId=doc.get('userId');
            let user_doc=await firestore.doc(`user/${userId}`).get()
            let liked_doc=await firestore.doc(`DetailTemplate2/information/messages/${doc.id}/likedUser/${uid}`).get()
            messages.push({
                reviewId: doc.id,
                userName: user_doc.get('username'),
                whenTheUserTakesTheSubject: doc.get('term').toDate(),
                content: doc.get('content'),
                likes: doc.get('likes'),
                liked: liked_doc.exists,
            });
        }
        return messages
    }
    async likeReviewMessage(reviewId: string, currentUserId: string) {
        let message_doc=firestore.doc(`DetailTemplate2/information/messages/${reviewId}`)
        let liked_doc=firestore.doc(`DetailTemplate2/information/messages/${reviewId}/likedUser/${currentUserId}`)
        message_doc.update({
            likes: increment(1)
        })
        liked_doc.set({})
    }
    async dislikeReviewMessage(reviewId: string, currentUserId: string) {
        let message_doc=firestore.doc(`DetailTemplate2/information/messages/${reviewId}`)
        let liked_doc=firestore.doc(`DetailTemplate2/information/messages/${reviewId}/likedUser/${currentUserId}`)
        message_doc.update({
            likes: increment(-1)
        })
        liked_doc.delete()
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
type QuantitativeReviewSectionProps = { subjectId: string; reviewKey: string;}
const QuantitativeReviewSection = ({ subjectId, reviewKey }: QuantitativeReviewSectionProps) => {
    // <リポジトリからreviewを取得できるまでローディング要素を表示>
    const [review, setReview] = useState<QuantitativeSubjectReview | null>(null);
    useEffect(() => {
        subjectDetailRepository.getQuantitativeReview(subjectId,reviewKey).then(setReview);
    }, [subjectId,reviewKey]);
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
type ReviewMessageSectionProps = { subjectId: string; reviewKey: string;}
const ReviewMessageSection = ({ subjectId, reviewKey }: ReviewMessageSectionProps) => {
    const [reviewMessages, setReviewMessages] = useState<ReviewMessage[]>([]);
    const [currentUserId, setCurrentUserId] = useState('');
    useEffect(() => {
        getUserId().then(setCurrentUserId)
        subjectDetailRepository.getReviewMessages(subjectId,reviewKey,currentUserId).then(setReviewMessages);
        console.log(currentUserId)
    }, [subjectId,reviewKey,currentUserId]);
    return <>
        {reviewMessages.map((reviewMessage) => <ReviewMessageBox subjectId={subjectId} reviewMessage={reviewMessage} key={reviewMessage.reviewId} currentUserId={currentUserId}/>)}
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
            subjectDetailRepository.dislikeReviewMessage(reviewMessage.reviewId, currentUserId).then(() => {
                setLikes(likes - 1);
                setLiked(false);
            });
        } else {
            subjectDetailRepository.likeReviewMessage(reviewMessage.reviewId, currentUserId).then(() => {
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