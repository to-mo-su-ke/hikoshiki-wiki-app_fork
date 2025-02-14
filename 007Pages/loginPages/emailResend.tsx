import { Button, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import sendVerificationEmail from "../../004BackendModules/loginMethod/sendVerificationEmail";


export default function EmailResendScreen() {
  const navigation = useNavigation();
  return (
    <View>
        <Text>もしメールが届かない場合は以下のボタンからメールを再送してください</Text>
        <Button title="メールを再送する" onPress={sendVerificationEmail} />

        <Button
          title="ログイン画面に戻る"
          onPress={() => {
            navigation.navigate("LoginOrSignUpScreen");
          }}
        />
    </View>
  );
}