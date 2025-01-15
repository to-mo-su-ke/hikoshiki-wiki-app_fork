import React, { useCallback, useEffect, useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { firestore,submitDataToFirestore } from '../../004BackendModules/messageMetod/firestore';
import { getUserId } from '../../004BackendModules/messageMetod/firebase';
import { increment,Timestamp, collection, addDoc, getDocs, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";


//subjectId=シラバス番号として処理していることに注意
//また, 

//ここから型定義の領域
type QuantitativeSubjectReview = {
    grossRating: number;
    understandabilityOfClasses: number;
    understandabilityOfDocs: number;
    difficultyOfExam: number;
    easinessOfObtainingCredit: number;
    personalityOfTeacher: number;
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


//ここから関数設定の領域
interface PrvisionalFormRepository{
    getSubjectDetail(subjectId: string): Promise<SubjectDetail>;
    updateAveReview(subjectId: string, review: QuantitativeSubjectReview)
    saveMessageReview(subjectId: string, message: ReviewMessage, review: QuantitativeSubjectReview): Promise<void>;
}
interface CurrentUser {
    get id(): Promise<string>;
    get name(): Promise<string>;
}

class PrvisionalFormRepository implements PrvisionalFormRepository
{
    async getSubjectDetail(subjectId: string){
        const subjectRef=`syllabus/${subjectId}`;
        const syllabusDoc=await firestore.doc(subjectRef).get()
        return{
            nameOfSubject: syllabusDoc.get('courseTitle'),
            nameOfTeacher: syllabusDoc.get('instructor'),
            credits: syllabusDoc.get('credits'),  
        }
    }
    async saveMessageReview(subjectId: string, message: ReviewMessage, review: QuantitativeSubjectReview){
        const subjectdetail=await this.getSubjectDetail(subjectId);
        const messageCollection=firestore.collection(`DetailTemplate2/information/messages`)
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
        const reviewCollection=firestore.collection(`${messageDoc.path}/review`)
        reviewCollection.add({
            grossRating: review.grossRating,
            understandabilityOfClasses: review.understandabilityOfClasses,
            understandabilityOfDocs: review.understandabilityOfDocs,
            difficultyOfExam: review.difficultyOfExam,
            easinessOfObtainingCredit: review.easinessOfObtainingCredit,
            personalityOfTeacher: review.personalityOfTeacher
        })
    }
}


class CurrentUserRepositoryImpl implements CurrentUser {
    _id: string = '';
    _name: string = '';
    initialized: boolean = false;
    async init(): Promise<void> {
        if (this.initialized) return;
        this._id = await getUserId();
        var userDoc = await firestore.doc(`/user/${this._id}`).get();
        this._name = await userDoc.get('username');
    }
    get id(): Promise<string> {
        return this.init().then(()=>this._id)
    }
    get name(): Promise<string> {
        return this.init().then(()=>this._name)
    }
}

const PrvisionalForm=new PrvisionalFormRepository()
const currentUser: CurrentUser = new CurrentUserRepositoryImpl();


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
    // * stackにSubjectDetailScreenという名前のスクリーンが登録されていることが前提
    return <>
        <Button title='go back' onPress={() => { navigation.pop() }} />
        <Button title="sport" onPress={() => { navigation.navigate('PrvisionalFormScreen', { subjectId: "0010001" }) }} />
        <Button title="english" onPress={() => { navigation.navigate('PrvisionalFormScreen', { subjectId: "0011101" }) }} />
    </>
}

type PrvisionalFormScreenProps = NativeStackScreenProps<StackParamList, 'PrvisionalFormScreen'>;
export const PrvisionalFormScreen=({navigation,route} :PrvisionalFormScreenProps)=>{
    const subjectId=route.params.subjectId
    const [detail,setDetail]=useState<SubjectDetail>(null)
    const [review,setReview]=useState<QuantitativeSubjectReview>(null);
    const [message,setMessage]=useState<ReviewMessage>(null); 
    useEffect(()=>{
        PrvisionalForm.getSubjectDetail(subjectId).then(setDetail)
        currentUser.id.then((id) => {
            let date=new Date();
            let messageFirst: ReviewMessage={
                userId: id,
                whenTheUserTakesTheSubject: date,
                content: "",
            }
            setMessage(messageFirst)
        })
    },[subjectId])
    if (detail === null) {
        return <Text> ロード中 </Text>
    }
    return <>
        <Button title="goback" onPress={()=>{navigation.pop()}}/>
        <Text>{detail.nameOfSubject}</Text>
        <ReviewFormSection setReview={setReview}/>
        <MessageFormSection setMessage={setMessage}/>
        <Button title="test用" onPress={()=>{
            PrvisionalForm.saveMessageReview(subjectId,message,review)}}/>
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
