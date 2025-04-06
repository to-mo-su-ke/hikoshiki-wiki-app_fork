/*
確認メール再送信画面です
ユーザー登録後に確認メールが届かない場合に再送信する機能を提供します

Firebase Authenticationの機能を使用してメール認証を行います
ユーザーは認証後にアプリの全機能を利用できるようになります
*/

import { Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import sendVerificationEmail from "../../004BackendModules/loginMethod/sendVerificationEmail";
import { emailResendStyles } from "../../002Styles/loginstyle";

// ナビゲーション型の定義
type RootStackParamList = {
  LoginOrSignupScreen: undefined;
};

export default function EmailResendScreen() {
  // 適切な型を指定してナビゲーションを使用
  const navigation = useNavigation<any>();
  
  return (
    <View style={emailResendStyles.container}>
      <View style={emailResendStyles.sectionContainer}>
        <Text style={emailResendStyles.sectionTitle}>メール確認</Text>
        <Text style={emailResendStyles.messageText}>
          登録確認メールを送信しました。メールが届かない場合は以下のボタンからメールを再送してください。
        </Text>
        
        <TouchableOpacity 
          style={emailResendStyles.buttonContainer} 
          onPress={() => sendVerificationEmail()} // 関数を呼び出す形に変更
        >
          <Text style={emailResendStyles.buttonText}>メールを再送する</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={emailResendStyles.buttonOutline}
          onPress={() => {
            // 画面名を確認（大文字小文字の違いに注意）
            navigation.navigate("LoginOrSignupScreen");
          }}
        >
          <Text style={emailResendStyles.buttonOutlineText}>ログイン画面に戻る</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}