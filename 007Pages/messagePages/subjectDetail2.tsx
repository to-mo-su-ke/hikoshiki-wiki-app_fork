import React, { useCallback, useEffect, useState } from 'react';
import { Button, Text, Linking } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { firestore,submitDataToFirestore } from '../../004BackendModules/messageMetod/firestore';
import { increment,Timestamp, collection, addDoc, getDocs, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { ScrollView } from 'react-native-gesture-handler';
import { getUserId } from '../../004BackendModules/messageMetod/firebase';


//detail2はfirebaseの構築でDetailTemplate2_sum, DetailTemplate2_listに対応
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
    const [reviewKey,setreviewKey]=useState<string>("s") //s,tで講義の評価か教授の評価かを判定
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
    getQuantitativeReview(subjectId: string,reviewKey: string): Promise<QuantitativeSubjectReview>; //レビューを読み取り平均値を計算して返す
    getReviewMessages(subjectId: string,reviewKey: string,currentUserId: string): Promise<ReviewMessage[]>; //メッセージのリストを受け取る
    likeReviewMessage(reviewId: string, currentUserId: string): Promise<void>; //いいねが押されたときにdatabaseを更新する
    dislikeReviewMessage(reviewId: string, currentUserId: string): Promise<void>; //いいねが取り消されたときにdatabaseを更新する
}


//DetailTemplate2_sumに対応
//レビューの合計値を保管する
class SubjectDetailSumRepository implements SubjectDetailRepository {
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
        let name = reviewKey=="s"?subjectdetail.nameOfSubject:subjectdetail.nameOfTeacher; //sとtが教授名・教科名選択のキーとなっており, 参照するコレクションを変更
        let colname = reviewKey=="s"?"subjectReview":"teacherReview";
        let reviewDoc = await firestore.doc(`DetailTemplate2_sum/information/${colname}/${name}`).get();
        let documentNumber = reviewDoc.get('documentNumber')
        let review = {
            grossRating: reviewDoc.get('grossRating')/documentNumber,
            understandabilityOfClasses: reviewDoc.get('understandabilityOfClasses')/documentNumber,
            understandabilityOfDocs: reviewDoc.get('understandabilityOfDocs')/documentNumber,
            difficultyOfExam: reviewDoc.get('difficultyOfExam')/documentNumber,
            easinessOfObtainingCredit: reviewDoc.get('easinessOfObtainingCredit')/documentNumber,
            personalityOfTeacher: reviewDoc.get('personalityOfTeacher')/documentNumber,
            attendance: reviewDoc.get('attendance')/documentNumber,
            criteria: reviewDoc.get('criteria')/documentNumber
        }
        return review //それぞれの評価の平均値を返す
    }
    async getReviewMessages(subjectId: string,reviewKey: string, currentUserId: string) {
        const subjectdetail=await this.getSubjectDetail(subjectId);
        let name = reviewKey=="s"?subjectdetail.nameOfSubject:subjectdetail.nameOfTeacher;
        let fieldname= reviewKey=="s"?"courseTitle":"instructor"
        let message_collection= await firestore.collection(`DetailTemplate2_sum/information/messages`)
                .where(fieldname,'==',name) //教科名(教授名)が一致するメッセージを検索
                .get();
        // データベースから取得した課題情報をAssignment型に変換
        let messages: ReviewMessage[] = [];
        for (let doc of message_collection.docs) {
            let userId=doc.get('userId');
            let user_doc=await firestore.doc(`user/${userId}`).get()
            let liked_doc=await firestore.doc(`DetailTemplate2_sum/information/messages/${doc.id}/likedUser/${currentUserId}`).get()
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
    async likeReviewMessage(reviewId: string, currentUserId: string) {
        let message_doc=firestore.doc(`DetailTemplate2_sum/information/messages/${reviewId}`)
        let liked_doc=firestore.doc(`DetailTemplate2_sum/information/messages/${reviewId}/likedUser/${currentUserId}`)
        message_doc.update({
            likes: increment(1) //いいねの数を増やす
        })
        liked_doc.set({}) //LikedUserにUserIdを保存
    }
    async dislikeReviewMessage(reviewId: string, currentUserId: string) {
        let message_doc=firestore.doc(`DetailTemplate2_sum/information/messages/${reviewId}`)
        let liked_doc=firestore.doc(`DetailTemplate2_sum/information/messages/${reviewId}/likedUser/${currentUserId}`)
        message_doc.update({
            likes: increment(-1) //いいねの数を減らす
        })
        liked_doc.delete() //LikedUser中のUserIdを削除
    }
}


//DetailTemplate2_listに対応
//レビューのリストを保管
class SubjectDetailListRepository implements SubjectDetailRepository {
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
        const averageReview=(reviewArray: number[])=>{ 
            let sum=0,documentNumber=0;
            for(let i=0;i<5;i++){sum+=(i+1)*reviewArray[i];documentNumber+=reviewArray[i]} //リストから平均値を計算
            return sum/documentNumber;}
        const maxReview=(reviewArray: number[])=>{
            let max=0,max_index=0;
            for(let i=0;i<5;i++){if(max<reviewArray[i]){max=reviewArray[i];max_index=i}} //リストから値が最大のインデックスを計算
            return max_index;} 
        //統計値をとるための計算         

        const subjectdetail=await this.getSubjectDetail(subjectId);
        let name = reviewKey=="s"?subjectdetail.nameOfSubject:subjectdetail.nameOfTeacher; //sとtが教授名・教科名選択のキーとなっており, 参照するコレクションを変更
        let colname = reviewKey=="s"?"subjectReview":"teacherReview";
        let reviewDoc = await firestore.doc(`DetailTemplate2_list/information/${colname}/${name}`).get();
        let review = {
            grossRating: averageReview(reviewDoc.get('grossRating')),
            understandabilityOfClasses: averageReview(reviewDoc.get('understandabilityOfClasses')),
            understandabilityOfDocs: averageReview(reviewDoc.get('understandabilityOfDocs')),
            difficultyOfExam: averageReview(reviewDoc.get('difficultyOfExam')),
            easinessOfObtainingCredit: averageReview(reviewDoc.get('easinessOfObtainingCredit')),
            personalityOfTeacher: averageReview(reviewDoc.get('personalityOfTeacher')),
            attendance: averageReview(reviewDoc.get('attendance')),
            criteria: maxReview(reviewDoc.get('criteria')) //評価基準(テストor課題など)は, 平均値よりも数が最大のものを出力
        }
        return review //それぞれの評価の平均値を返す
    }
    async getReviewMessages(subjectId: string,reviewKey: string, currentUserId: string) {
        const subjectdetail=await this.getSubjectDetail(subjectId);
        let name = reviewKey=="s"?subjectdetail.nameOfSubject:subjectdetail.nameOfTeacher;
        let fieldname= reviewKey=="s"?"courseTitle":"instructor"
        let message_collection= await firestore.collection(`DetailTemplate2_list/information/messages`)
                .where(fieldname,'==',name) //教科名(教授名)が一致するメッセージを検索
                .get();
        // データベースから取得した課題情報をAssignment型に変換
        let messages: ReviewMessage[] = [];
        for (let doc of message_collection.docs) {
            let userId=doc.get('userId');
            let user_doc=await firestore.doc(`user/${userId}`).get()
            let liked_doc=await firestore.doc(`DetailTemplate2_list/information/messages/${doc.id}/likedUser/${currentUserId}`).get()
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
    async likeReviewMessage(reviewId: string, currentUserId: string) {
        let message_doc=firestore.doc(`DetailTemplate2_list/information/messages/${reviewId}`)
        let liked_doc=firestore.doc(`DetailTemplate2_list/information/messages/${reviewId}/likedUser/${currentUserId}`)
        message_doc.update({
            likes: increment(1) //いいねの数を増やす
        })
        liked_doc.set({}) //LikedUserにUserIdを保存
    }
    async dislikeReviewMessage(reviewId: string, currentUserId: string) {
        let message_doc=firestore.doc(`DetailTemplate2_list/information/messages/${reviewId}`)
        let liked_doc=firestore.doc(`DetailTemplate2_list/information/messages/${reviewId}/likedUser/${currentUserId}`)
        message_doc.update({
            likes: increment(-1) //いいねの数を減らす
        })
        liked_doc.delete() //LikedUser中のUserIdを削除
    }
}

// </repository>

// 抽象化されたデータ取得方法のダミーの実装


// データ取得方法の（実装を）指定
const subjectDetailRepository = new SubjectDetailSumRepository(); //ここを変更して切り替え

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
type ReviewMessageSectionProps = { subjectId: string; reviewKey: string;}
const ReviewMessageSection = ({ subjectId, reviewKey }: ReviewMessageSectionProps) => {
    const [reviewMessages, setReviewMessages] = useState<ReviewMessage[]>([]);
    const [currentUserId, setCurrentUserId] = useState('');
    useEffect(() => {
        getUserId().then(setCurrentUserId)
        subjectDetailRepository.getReviewMessages(subjectId,reviewKey,currentUserId).then(setReviewMessages);
    }, [subjectId,reviewKey,currentUserId]);
    return <>
        {reviewMessages.map((reviewMessage) => <ReviewMessageBox reviewMessage={reviewMessage} key={reviewMessage.reviewId} currentUserId={currentUserId}/>)}
    </>
}
// 個々のレビューメッセージ
type ReviewMessageBoxProps = {reviewMessage: ReviewMessage, currentUserId: string; }
const ReviewMessageBox = ({reviewMessage, currentUserId }: ReviewMessageBoxProps) => {
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