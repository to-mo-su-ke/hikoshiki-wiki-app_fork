/*
個人情報をサーバーに送信する関数です

ユーザー情報についてのfirestoreのデータ構造

firestore
|--user(コレクション)
|  |--{uid}(ドキュメント)
|  |  |  以下はフィールド
|  |  |--username
|  |  |--grade
|  |  |--school
|  |  |--department
|  |  |--course
|  |  |--major
|  |  |--researchroom
|  |  |--role
|  |  |--club


*/

import { db } from "../messageMetod/firebase";
import { doc, setDoc } from "firebase/firestore";

//個人情報を登録する関数の引数の型定義のために定義します
interface PersonalInformation {
    username:string;
    grade:string;
    school: string;
    department:string;
    course:string;
    major: string;
    researchroom:string;
    role:string;
    club:string[];
}

//個人情報を登録する関数
export default async function submitPersonalInformation(uid: string, personalInformation: PersonalInformation) {
    try {
        const userDocRef = doc(db, "user", uid);
        await setDoc(userDocRef, personalInformation);
    } catch (error) {
        console.error("Error submitting data:", error);
    }
}
