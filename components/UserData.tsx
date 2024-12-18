import {db} from "../lib/firebase";
import {doc, collection, getDoc, setDoc} from "firebase/firestore";

export interface UserData {
    username:string;
    grade:string;
    school: string;
    department:string;
    course:string;
    major: string;
    researchroom:string;
    role:string;
    club:string[];
};

// データを取得
export const importUserData = async (uid: string | undefined): Promise<UserData | null> => {
    try {
        const docRef = doc(collection(db, "user"), uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data() as UserData;
            return data;
        } else {
            console.warn(`UID: ${uid} に該当するドキュメントが見つかりません。`);
            return null;
        }
    } catch (error) {
        console.error("ユーザーデータの取得中にエラーが発生しました:", error);
        return null;
    }
};

// データを保存
export const editUserData = async (uid: string | undefined, data: UserData) => {
    const docRef = doc(collection(db, "user"), uid);
    await setDoc(docRef, data);
}