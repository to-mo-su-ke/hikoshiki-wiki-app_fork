import { Button, Text, View } from "react-native";
import sendVerificationEmail from "../../004BackendModules/loginMethod/sendVerificationEmail";


export default function EmailResendScreen() {
  return (
    <View>
        <Text>もしメールが届かない場合は以下のボタンからメールを再送してください</Text>
        <Button title="メールを再送する" onPress={sendVerificationEmail} />
    </View>
  );
}