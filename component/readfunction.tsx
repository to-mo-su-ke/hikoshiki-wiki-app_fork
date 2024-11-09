import { Message } from "../types/message";
import { updateDoc } from "firebase/firestore";
import { getSpecificMessageDocRef } from "../lib/firebase"

// 一つのメッセージに既読を付ける関数
const markRead = async (message: Message, userId: string | undefined) =>{
    if (message.userId !== userId){
        const docref = await getSpecificMessageDocRef(message.id);
        await updateDoc(docref, {isread: true});
    }
}

// メッセージの配列に既読をつける関数
export const markReadMessages = async (messages: Message[], userId: string | undefined) =>{
    for (let message of messages){
        if (message.isread == false){
            markRead(message, userId)
        }
    }
}