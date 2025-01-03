import React, { useCallback, useEffect, useState } from 'react';
import { Button, Text, Linking } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// 各コンポーネントの引数の型を設定
type StackParamList = {
    DummyScreen: {};
    SubjectDetailScreen: { subjectId: string };
}
// const Stack = createStackNavigator<StackParamList>();

// <wrapper>
// main compoentsをテストとして表示するためのダミーの遷移元．
// また，実際に使用する際の使い方の参考
type DummyScreenProps = NativeStackScreenProps<StackParamList, 'DummyScreen'>;
export const DummyScreen = ({ navigation, route }: DummyScreenProps) => {
    // * stackにSubjectDetailScreenという名前のスクリーンが登録されていることが前提
    return <>
        <Button title="sport" onPress={() => { navigation.navigate('SubjectDetailScreen', { subjectId: "sport" }) }} />
        <Button title="english" onPress={() => { navigation.navigate('SubjectDetailScreen', { subjectId: "english" }) }} />
    </>
}
// </wrapper>

// <main compenets>
// 本ファイルでwrapperを除いて一番外型のコンポーネント
// 本ファイル内では単一の画面を表示するのみ（遷移なし）なので，ここから直接内容を記述する
// 全部ここに書いてもいいが，見づらくなりそうなので適当な位置で分割しておく
type SubjectDetailScreenProps = NativeStackScreenProps<StackParamList, 'SubjectDetailScreen'>;
export const SubjectDetailScreen = ({ navigation, route }: SubjectDetailScreenProps) => {
    return <>
        <Button title='go back' onPress={() => { navigation.pop() }} />
        <SubjectDetailSection subjectId={route.params.subjectId} />
        <QuantitativeReviewSection subjectId={route.params.subjectId} />
        <ReviewMessageSection subjectId={route.params.subjectId} />
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
    getQuantitativeReview(subjectId: string): Promise<QuantitativeSubjectReview>;
    getReviewMessages(subjectId: string): Promise<ReviewMessage[]>;
    likeReviewMessage(subjectId: string, reviewId: string): Promise<void>;
    dislikeReviewMessage(subjectId: string, reviewId: string): Promise<void>;
}

// 抽象化されたデータ取得方法のダミーの実装
class MockSubjectDetailRepository implements SubjectDetailRepository {
    async getSubjectDetail(subjectId: string) {
        return {
            nameOfSubject: "スポーツ",
            nameOfTeacher: "山田太郎",
            linkOfSyllabus: "https://www.google.com",
            textbookDescription: "教科書なし",
            credits: 2,
            gradesDescription: "F,C-A,A+"
        }
    }
    async getQuantitativeReview(subjectId: string) {
        return {
            grossRating: 2.5,
            understandabilityOfClasses: 3,
            understandabilityOfDocs: 3,
            difficultyOfExam: 5,
            easinessOfObtainingCredit: 1,
            personalityOfTeacher: 1
        }
    }
    async getReviewMessages(subjectId: string) {
        return [
            {
                reviewId: "1",
                userName: "山田",
                whenTheUserTakesTheSubject: new Date(2023, 4, 1),
                content: "辛いです",
                likes: 10,
                liked: false,
            },
            {
                reviewId: "2",
                userName: "田中",
                whenTheUserTakesTheSubject: new Date(2024, 4, 1),
                content: "死ぬかと思った",
                likes: 10,
                liked: true,
            }
        ]
    }
    async likeReviewMessage(subjectId: string, reviewId: string) {
        // 何もしない
    }
    async dislikeReviewMessage(subjectId: string, reviewId: string) {
        // 何もしない
    }
}
// </repository>

// データ取得方法の（実装を）指定
const subjectDetailRepository = new MockSubjectDetailRepository();

// </data>

// <sub components>
// メインコンポーネントから呼び出されるサブコンポーネント（Section）を定義（適当なまとまりで分割）


type SubjectDetailSectionProps = { subjectId: string; }
const SubjectDetailSection = ({ subjectId }: SubjectDetailSectionProps) => {
    const [subjectDetail, setSubjectDetail] = useState<SubjectDetail | null>(null);
    useEffect(() => {
        subjectDetailRepository.getSubjectDetail(subjectId).then(setSubjectDetail);
    }, [subjectId]);
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


type QuantitativeReviewSectionProps = { subjectId: string; }
const QuantitativeReviewSection = ({ subjectId }: QuantitativeReviewSectionProps) => {
    const [review, setReview] = useState<QuantitativeSubjectReview | null>(null);
    useEffect(() => {
        subjectDetailRepository.getQuantitativeReview(subjectId).then(setReview);
    }, [subjectId]);
    if (review === null) {
        return <Text> ロード中 </Text>
    }
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


type ReviewMessageSectionProps = { subjectId: string; }
const ReviewMessageSection = ({ subjectId }: ReviewMessageSectionProps) => {
    const [reviewMessages, setReviewMessages] = useState<ReviewMessage[]>([]);
    useEffect(() => {
        subjectDetailRepository.getReviewMessages(subjectId).then(setReviewMessages);
    }, [subjectId]);
    return <>
        {reviewMessages.map((reviewMessage) => <ReviewMessageBox subjectId={subjectId} reviewMessage={reviewMessage} key={reviewMessage.reviewId}/>)}
    </>
}
type ReviewMessageBoxProps = { subjectId: string, reviewMessage: ReviewMessage; }
const ReviewMessageBox = ({ subjectId, reviewMessage }: ReviewMessageBoxProps) => {
    const [likes, setLikes] = useState(reviewMessage.likes);
    const [liked, setLiked] = useState(reviewMessage.liked);
    const handleLike = useCallback(() => {
        if (liked) {
            subjectDetailRepository.dislikeReviewMessage(subjectId, reviewMessage.reviewId).then(() => {
                setLikes(likes - 1);
                setLiked(false);
            });
        } else {
            subjectDetailRepository.likeReviewMessage(subjectId, reviewMessage.reviewId).then(() => {
                setLikes(likes + 1);
                setLiked(true);
            });
        }
    }, [reviewMessage,liked]);
    return <>
        <Text> {reviewMessage.whenTheUserTakesTheSubject.toISOString()} {reviewMessage.userName} </Text>
        <Text> {reviewMessage.content} </Text>
        <Button title={(liked ? '♥' : '♡') + likes.toString()} onPress={handleLike} />
    </>
}
// </sub components>