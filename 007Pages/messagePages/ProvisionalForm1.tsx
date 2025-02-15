import React, { useCallback, useEffect, useState } from 'react';
import { Button, Text, TextInput, View, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { firestore,submitDataToFirestore } from '../../004BackendModules/messageMetod/firestore';
import { getUserId } from '../../004BackendModules/messageMetod/firebase';
import { increment,runTransaction,Timestamp, collection, addDoc, getDocs, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { ScrollView } from 'react-native-gesture-handler';

//担当ではないが, 必要な処理を整理するために便宜的に作成
//レビューを入力するフォーム画面
//subjectDetail1に対応
//subjectId=教科名で処理

//ここから型定義の領域
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
    userId: string;
    whenTheUserTakesTheSubject: Date;
    content: string;
}

type SubjectDetail = {
    nameOfSubject: string;
    nameOfTeacher: string;
    credits: number;
}

const textArray = ["テスト","課題","両方","不明","その他"] //アンケート結果(評価基準)

//ここから関数設定の領域
interface PrvisionalFormRepository{
    getSubjectName(subjectId: string): Promise<string>; //シラバスから教科名を受け取る
    updateReview(subjectId: string, review: QuantitativeSubjectReview): Promise<void>; //入力されたレビューに関する処理
    saveMessageReview(subjectId: string, message: ReviewMessage, review: QuantitativeSubjectReview): Promise<void>; //入力されたメッセージに関する処理
}

class PrvisionalFormRepository implements PrvisionalFormRepository
{
    async getSubjectName(subjectId: string){
        let subjectRef = `DetailTemplate1/${subjectId}`
        let subjectDoc = await firestore.doc(subjectRef).get();
        let syllabus_ref = subjectDoc.get('syllabus');
        const syllabusDoc=await firestore.doc(syllabus_ref).get()
        return syllabusDoc.get('courseTitle')
    }

    async updateReview(subjectId: string, review: QuantitativeSubjectReview){
        let subjectDoc = await firestore.doc(`DetailTemplate1/${subjectId}`);
        await firestore.runTransaction(async (transaction)=>{ //transactionの利用でデータの損失を防ぐ
            let subjectSnap=await subjectDoc.get();
            if(subjectSnap.exists){
                transaction.update(subjectDoc,{
                    grossRating: increment(review.grossRating),
                    understandabilityOfClasses: increment(review.understandabilityOfClasses),
                    understandabilityOfDocs: increment(review.understandabilityOfDocs),
                    difficultyOfExam: increment(review.difficultyOfExam),
                    easinessOfObtainingCredit: increment(review.easinessOfObtainingCredit),
                    personalityOfTeacher: increment(review.personalityOfTeacher),
                    attendance: increment(review.attendance),
                    criteria: increment(review.criteria), 
                    documentNumber: increment(1) //それぞれの評価値を合計する
                })
            }else{
                transaction.set(subjectDoc,{
                    grossRating: review.grossRating,
                    understandabilityOfClasses: review.understandabilityOfClasses,
                    understandabilityOfDocs: review.understandabilityOfDocs,
                    difficultyOfExam: review.difficultyOfExam,
                    easinessOfObtainingCredit: review.easinessOfObtainingCredit,
                    personalityOfTeacher: review.personalityOfTeacher,
                    attendance: review.attendance,
                    criteria: review.criteria,
                    documentNumber: 1 //存在しない場合は新しいドキュメントを作成
                })  
            } 
        })
    }
    async saveMessageReview(subjectId: string, message: ReviewMessage, review: QuantitativeSubjectReview){
        const messageCollection=firestore.collection(`DetailTemplate1/${subjectId}/message`)
        const messageDoc=messageCollection.doc();
        messageDoc.set
        ({
            content: message.content,
            term: message.whenTheUserTakesTheSubject,
            userRef: `/user/${message.userId}`, 
            likes: 0
        })
    } //メッセージを保存
}

const PrvisionalForm=new PrvisionalFormRepository()


//ここからページ遷移の領域
type StackParamList = {
    DummyScreen: {};
    DummyCheckScreen: {};
    DummyFormScreen: {};
    SubjectDetailScreen: { subjectId: string };
    PrvisionalFormScreen: { subjectId: string };
}

//科目検索に対する仮のページ(最終的には削除)
type DummyFormScreenProps = NativeStackScreenProps<StackParamList, 'DummyFormScreen'>;
export const DummyFormScreen = ({ navigation, route }: DummyFormScreenProps) => {
    return <>
        <Button title='go back' onPress={() => { navigation.pop() }} />
        <Button title="sport" onPress={() => { navigation.navigate('PrvisionalFormScreen', { subjectId: "sport" }) }} />
        <Button title="english" onPress={() => { navigation.navigate('PrvisionalFormScreen', { subjectId: "english" }) }} />
    </>
}

//一番外側の階層
type PrvisionalFormScreenProps = NativeStackScreenProps<StackParamList, 'PrvisionalFormScreen'>;
export const PrvisionalFormScreen=({navigation,route} :PrvisionalFormScreenProps)=>{
    const submitData=()=>{ //入力をdatabaseに保存する関数(もっときれいに変更したい)
        if (
            !review.difficultyOfExam ||
            !review.easinessOfObtainingCredit ||
            !review.grossRating ||
            !review.personalityOfTeacher ||
            !review.understandabilityOfClasses ||
            !review.understandabilityOfDocs ||
            !message.content
        ) {
            Alert.alert("全てのフィールドを入力してください");
            return;
        } //すべての入力項目が入力されていることを確認
        PrvisionalForm.saveMessageReview(subjectId,message,review);
        PrvisionalForm.updateReview(subjectId,review); //レビュー, メッセージそれぞれを保存
        navigation.pop();
        return;
    }
    const subjectId=route.params.subjectId
    const [subjectName,setSubjectName]=useState<string>(null)
    const [review,setReview]=useState<QuantitativeSubjectReview>(null);
    const [message,setMessage]=useState<ReviewMessage>(null); 
    useEffect(()=>{
        PrvisionalForm.getSubjectName(subjectId).then(setSubjectName)
        let date=new Date();
        getUserId().then((uid)=>{
            setMessage({
                userId: uid,
                whenTheUserTakesTheSubject: date, //変更予定　detail.termDayPeriod利用
                content: ""})
        })
        setReview({
            grossRating: null,
            understandabilityOfClasses: null,
            understandabilityOfDocs: null,
            difficultyOfExam: null,
            easinessOfObtainingCredit: null,
            personalityOfTeacher: null,
            attendance: null,
            criteria: null
        })},[subjectId])
    if (subjectName === null) {
        return <Text> ロード中 </Text>
    }
    return <>
    <ScrollView>
        <Button title="goback" onPress={()=>{navigation.pop()}}/>
        <Text>{subjectName}</Text>
        <ReviewFormSection setReview={setReview}/>
        <MessageFormSection setMessage={setMessage}/>
        <Button title="送信" onPress={submitData}/>
        </ScrollView>
        </>
}

//レビューを入力するセクション
type ReviewFormSectionProps={setReview: React.Dispatch<React.SetStateAction<QuantitativeSubjectReview>>}
const ReviewFormSection=({setReview}: ReviewFormSectionProps)=>{
    return(
    <>
    <Text>総合評価</Text>
    <StarsSelect setReview={setReview} title="grossRating"/>
    <Text>授業のわかりやすさ</Text>
    <StarsSelect setReview={setReview} title="understandabilityOfClasses"/>
    <Text>資料のわかりやすさ</Text>
    <StarsSelect setReview={setReview} title="understandabilityOfDocs"/>
    <Text>テストの難しさ</Text>
    <StarsSelect setReview={setReview} title="difficultyOfExam"/>
    <Text>単位の取りやすさ</Text>
    <StarsSelect setReview={setReview} title="easinessOfObtainingCredit"/>
    <Text>教授の人間性</Text>    
    <StarsSelect setReview={setReview} title="personalityOfTeacher"/>
    <Text>出席確認の頻度</Text>    
    <StarsSelect setReview={setReview} title="attendance"/>
    <Text>評価基準</Text>    
    <CriteriaSelect setReview={setReview}/>
    </>
    )
}

//☆型のボタン列を作成
type StarsSelectProps={setReview: React.Dispatch<React.SetStateAction<QuantitativeSubjectReview>>,title:string}
const StarsSelect=({setReview,title}:StarsSelectProps)=>{
    const updateReview = (value: number) => {
        setReview((prev) => ({ ...prev, [title]: value }));
    };
    const starjudge=(starnumber:number,grade:number)=>{
        return starnumber<grade ?"☆":"★";
    }
    const [eachreview,setEachReview]=useState<number>(0)
    const length=5
    return(
        <View style={{ flexDirection: 'row'}}> 
        {/* 横向きになるように一時的にcssで指定 */}
        {Array.from({length}).map((_,index)=>(
            <Button title={starjudge(eachreview,index+1)} onPress={()=>{
                updateReview(index+1);
                setEachReview(index+1);
            }} key={index}/>
        ))}
        </View>
    )
}

//評価基準選択用の○型のボタン列作成
type CriteriaSelectProps={setReview: React.Dispatch<React.SetStateAction<QuantitativeSubjectReview>>}
const CriteriaSelect=({setReview}:CriteriaSelectProps)=>{
    const updateReview = (value: number) => {
        setReview((prev) => ({ ...prev, ["criteria"]: value }));
    };
    const [choice,setChoice]=useState<number>(0)
    const length=5
    return(
        <View style={{ flexDirection: 'row'}}> 
        {/* 横向きになるように一時的にcssで指定 */}
        {Array.from({length}).map((_,index)=>(
            <View key={index}>
            <Text >{textArray[index]}</Text>
            <Button title= {choice==index+1? "●":"○"} onPress={()=>{
                updateReview(index+1);
                setChoice(index+1);
            }} />
            </View>
        ))}
        </View>
    )
}

//メッセージを入力するセクション
type MessageFormSectionProps={setMessage: React.Dispatch<React.SetStateAction<ReviewMessage>>}
const MessageFormSection=({setMessage}:MessageFormSectionProps)=>{
    const updateReview = (value: string) => {
        setMessage((prev) => ({ ...prev, "content": value }));
    };
    const [newMessage,setNewMessage]=useState<string>(null)
    return(
        <>
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
                onChangeText={(text) => {setNewMessage(text);updateReview(text)}}
                //改行する場合はmultilineを入れる
            />
        </>
    )
}
