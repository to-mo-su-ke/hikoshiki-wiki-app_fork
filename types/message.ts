import { Timestamp } from "firebase/firestore";

// メッセージの型定義
export type Message = {
  id: string; // メッセージの一意識別子
  text: string; // メッセージの内容
  createdAt: Timestamp; // 送信時間
  userId: string; // 送信者のユーザーID
  userName: string; // 送信者の名前
  isread: boolean; //既読かどうか
};
