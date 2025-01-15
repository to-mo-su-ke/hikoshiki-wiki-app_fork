import React, { useCallback, useEffect, useState } from 'react';
import { Button, Text, Linking, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { firestore,submitDataToFirestore } from '../../004BackendModules/messageMetod/firestore';
import { getUserId } from '../../004BackendModules/messageMetod/firebase';
import { increment,Timestamp, collection, addDoc, getDocs, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

type QuantitativeSubjectReview = {
    grossRating: number;
    understandabilityOfClasses: number;
    understandabilityOfDocs: number;
    difficultyOfExam: number;
    easinessOfObtainingCredit: number;
    personalityOfTeacher: number;
}

//ここから関数設定の領域
interface PrvisionalFormRepository{
    getSubjectTitle(subjectRef: string): Promise<string>;

}
interface CurrentUser {
    get id(): Promise<string>;
    get name(): Promise<string>;
}

class PrvisionalFormRepository implements PrvisionalFormRepository
{
    async getSubjectTitle(subjectRef: string)
    {
        return "aaa"
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
        <Button title="sport" onPress={() => { navigation.navigate('PrvisionalFormScreen', { subjectId: "dummyId" }) }} />
        <Button title="english" onPress={() => { navigation.navigate('PrvisionalFormScreen', { subjectId: "english" }) }} />
    </>
}

type PrvisionalFormScreenProps = NativeStackScreenProps<StackParamList, 'PrvisionalFormScreen'>;
export const PrvisionalFormScreen=({navigation,route} :PrvisionalFormScreenProps)=>{
    const subjectId=route.params.subjectId
    const subjectRef=`detail/${subjectId}`
    const [title,setTitle]=useState<string>("")
    useEffect(()=>{
        PrvisionalForm.getSubjectTitle(`detail/${subjectId}`).then(setTitle)
    },[subjectId])
    const [rate,setRate]=useState<QuantitativeSubjectReview>(null);
    const [message,setMessage]=useState<string>("");
    return(<>
    <Button title="goback" onPress={()=>{navigation.pop()}}/>
    <Text>{title}</Text>
    <RateFormSection setRate={setRate}></RateFormSection>
    </>)
}

type RateFormSectionProps={setRate: React.Dispatch<React.SetStateAction<QuantitativeSubjectReview>>}
const RateFormSection=({setRate}: RateFormSectionProps)=>{
    const [grossRating,setGrossRating]=useState<number>(0);
    const [understandabilityOfClasses,setUnderstandabilityOfClasses]=useState<number>(0);
    const [understandabilityOfDocs,setUnderstandabilityOfDocs]=useState<number>(0);
    const [difficultyOfExam,setDifficultyOfExam]=useState<number>(0);
    const [easinessOfObtainingCredit,setEasinessOfObtainingCredit]=useState<number>(0);
    const [personalityOfTeacher,setPersonalityOfTeacher]=useState<number>(0);
    //同じものたくさんつくる
    useEffect(()=>{
        setRate({    
            grossRating: grossRating,
            understandabilityOfClasses: understandabilityOfClasses,
            understandabilityOfDocs: understandabilityOfDocs,
            difficultyOfExam: difficultyOfExam,
            easinessOfObtainingCredit: easinessOfObtainingCredit,
            personalityOfTeacher: personalityOfTeacher
        })},[grossRating,understandabilityOfClasses,understandabilityOfDocs,difficultyOfExam,easinessOfObtainingCredit,personalityOfTeacher
        ])
    return(
    <>
    <Text>総合評価</Text>
    <StarsSelect eachrate={grossRating} setEachrate={setGrossRating}/>
    <Text>授業のわかりやすさ</Text>
    <StarsSelect eachrate={understandabilityOfClasses} setEachrate={setUnderstandabilityOfClasses}/>
    <Text>資料のわかりやすさ</Text>
    <StarsSelect eachrate={understandabilityOfDocs} setEachrate={setUnderstandabilityOfDocs}/>
    <Text>テストの難しさ</Text>
    <StarsSelect eachrate={difficultyOfExam} setEachrate={setDifficultyOfExam}/>
    <Text>単位の取りやすさ</Text>
    <StarsSelect eachrate={easinessOfObtainingCredit} setEachrate={setEasinessOfObtainingCredit}/>
    <Text>教授の人間性</Text>
    <StarsSelect eachrate={personalityOfTeacher} setEachrate={setPersonalityOfTeacher}/>
    </>
    )
}

type StarsSelectProps={eachrate: number,setEachrate: React.Dispatch<React.SetStateAction<number>>}
const StarsSelect=({eachrate,setEachrate}:StarsSelectProps)=>{
    const starjudge=(starnumber:number,grade:number)=>{
        return starnumber<grade ?"☆":"★";
    }
    const length=5
    return(
        <View style={{ flexDirection: 'row'}}> 
        {/* 横向きになるように一時的にcssで指定 */}
        {Array.from({length}).map((_,index)=>(
            <Button title={starjudge(eachrate,index+1)} onPress={()=>{
                setEachrate(index+1);
            }} key={index}/>
        ))}
        </View>
    )
}

type MessageFormProps={rate: QuantitativeSubjectReview,setMessage: React.Dispatch<React.SetStateAction<string>>}