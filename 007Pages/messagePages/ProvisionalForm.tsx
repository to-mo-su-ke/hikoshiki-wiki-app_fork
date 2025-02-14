import React, { useCallback, useEffect, useState } from 'react';
import { Button, Text, TextInput, View, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { firestore,submitDataToFirestore } from '../../004BackendModules/messageMetod/firestore';
import { getUserId } from '../../004BackendModules/messageMetod/firebase';
import { increment,runTransaction, Transaction, Timestamp, collection, addDoc, getDocs, QueryDocumentSnapshot, DocumentData,  } from "firebase/firestore";
import { ScrollView } from 'react-native-gesture-handler';

//担当ではないが, 必要な処理を整理するために便宜的に作成
//subjectId=シラバス番号として処理していることに注意
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
    getSubjectDetail(subjectId: string): Promise<SubjectDetail>;
    updateReview(subjectId: string, review: QuantitativeSubjectReview, key: string): Promise<void>;
    saveMessageReview(subjectId: string, message: ReviewMessage, review: QuantitativeSubjectReview): Promise<void>;
}

class PrvisionalFormRepository implements PrvisionalFormRepository
{
    async getSubjectDetail(subjectId: string){
        const subjectRef=`syllabus/${subjectId}`;
        const syllabusDoc=await firestore.doc(subjectRef).get()
        let instructor=syllabusDoc.get('instructor')
        let newInstructor=instructor.replace(/○[\s\S]*/u,"")
        return{
            nameOfSubject: syllabusDoc.get('courseTitle'),
            nameOfTeacher: newInstructor,
            credits: syllabusDoc.get('credits'),  
        }
    }
    async updateReview(subjectId: string, review: QuantitativeSubjectReview, key: string){
        const ArrayIncrement = (reviewNumber: number, arrayRating: number[]=[0,0,0,0,0]) => (arrayRating[reviewNumber-1]++, arrayRating);
        //☆1は配列のindex0として保存(配列で保管)
        const subjectdetail=await this.getSubjectDetail(subjectId);
        let name = key=="s"?subjectdetail.nameOfSubject:subjectdetail.nameOfTeacher;
        let colname = key=="s"?"subjectReview":"teacherReview";
        let reviewDoc = await firestore.doc(`DetailTemplate3/information/${colname}/${name}`);
        await firestore.runTransaction(async (transaction)=>{
            let reviewSnap=await transaction.get(reviewDoc);
            if(reviewSnap.exists){
                transaction.update(reviewDoc,{
                    grossRating: ArrayIncrement(review.grossRating, reviewSnap.get("grossRating")),
                    understandabilityOfClasses: ArrayIncrement(review.understandabilityOfClasses, reviewSnap.get("understandabilityOfClasses")),
                    understandabilityOfDocs: ArrayIncrement(review.understandabilityOfDocs, reviewSnap.get("understandabilityOfDocs")),
                    difficultyOfExam: ArrayIncrement(review.difficultyOfExam, reviewSnap.get("difficultyOfExam")),
                    easinessOfObtainingCredit: ArrayIncrement(review.easinessOfObtainingCredit, reviewSnap.get("easinessOfObtainingCredit")),
                    personalityOfTeacher: ArrayIncrement(review.personalityOfTeacher, reviewSnap.get("personalityOfTeacher")),
                    attendance: ArrayIncrement(review.attendance, reviewSnap.get("attendance")),
                    criteria: ArrayIncrement(review.criteria, reviewSnap.get("criteria"))
                })
            }else{
                transaction.set(reviewDoc,{
                    grossRating: ArrayIncrement(review.grossRating),
                    understandabilityOfClasses: ArrayIncrement(review.understandabilityOfClasses),
                    understandabilityOfDocs: ArrayIncrement(review.understandabilityOfDocs),
                    difficultyOfExam: ArrayIncrement(review.difficultyOfExam),
                    easinessOfObtainingCredit: ArrayIncrement(review.easinessOfObtainingCredit),
                    personalityOfTeacher: ArrayIncrement(review.personalityOfTeacher),
                    attendance: ArrayIncrement(review.attendance),
                    criteria: ArrayIncrement(review.criteria)
                })  
            } 
        })
    }
    async saveMessageReview(subjectId: string, message: ReviewMessage, review: QuantitativeSubjectReview){
        const subjectdetail=await this.getSubjectDetail(subjectId);
        const messageCollection=firestore.collection(`DetailTemplate3/information/messages`)
        const messageDoc=messageCollection.doc();
        messageDoc.set
        ({
            content: message.content,
            term: message.whenTheUserTakesTheSubject,
            userRef: `/user/${message.userId}`, 
            likes: 0,
            instructor: subjectdetail.nameOfTeacher,
            courseTitle: subjectdetail.nameOfSubject
        })
    }
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

type DummyFormScreenProps = NativeStackScreenProps<StackParamList, 'DummyFormScreen'>;
export const DummyFormScreen = ({ navigation, route }: DummyFormScreenProps) => {
    return <>
        <Button title='go back' onPress={() => { navigation.pop() }} />
        <Button title="sport" onPress={() => { navigation.navigate('PrvisionalFormScreen', { subjectId: "0010001" }) }} />
        <Button title="english" onPress={() => { navigation.navigate('PrvisionalFormScreen', { subjectId: "0011101" }) }} />
    </>
}

type PrvisionalFormScreenProps = NativeStackScreenProps<StackParamList, 'PrvisionalFormScreen'>;
export const PrvisionalFormScreen=({navigation,route} :PrvisionalFormScreenProps)=>{
    const submitData=()=>{ //読み込んだ時の結果を関数にしておく(もっときれいに変更したい)
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
        }
        PrvisionalForm.saveMessageReview(subjectId,message,review);
        PrvisionalForm.updateReview(subjectId,review,"s");
        PrvisionalForm.updateReview(subjectId,review,"t");
        navigation.pop();
        return;
    }
    const subjectId=route.params.subjectId
    const [detail,setDetail]=useState<SubjectDetail>(null)
    const [review,setReview]=useState<QuantitativeSubjectReview>(null);
    const [message,setMessage]=useState<ReviewMessage>(null); 
    useEffect(()=>{
        PrvisionalForm.getSubjectDetail(subjectId).then(setDetail)
        let date=new Date();
        getUserId().then((uid)=>{
            setMessage({
                userId: uid,
                whenTheUserTakesTheSubject: date, //変更予定　detail.termDayPeriod利用
                content: ""})
        })
        setReview({
            grossRating: 0,
            understandabilityOfClasses: 0,
            understandabilityOfDocs: 0,
            difficultyOfExam: 0,
            easinessOfObtainingCredit: 0,
            personalityOfTeacher: 0,
            attendance: 0,
            criteria: 0
        })},[subjectId])
    if (detail === null) {
        return <Text> ロード中 </Text>
    }
    return <>
    <ScrollView>
        <Button title="goback" onPress={()=>{navigation.pop()}}/>
        <Text>{detail.nameOfSubject}</Text>
        <ReviewFormSection setReview={setReview}/>
        <MessageFormSection setMessage={setMessage}/>
        <Button title="送信" onPress={submitData}/>
        {/* transactionの利用をする */}
        </ScrollView>
        </>
}

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
