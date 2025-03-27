import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import sendVerificationEmail from "../../004BackendModules/loginMethod/sendVerificationEmail";

export default function EmailResendScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>メール確認</Text>
        <Text style={styles.messageText}>
          登録確認メールを送信しました。メールが届かない場合は以下のボタンからメールを再送してください。
        </Text>
        
        <TouchableOpacity 
          style={styles.buttonContainer} 
          onPress={sendVerificationEmail}
        >
          <Text style={styles.buttonText}>メールを再送する</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonOutline}
          onPress={() => {
            navigation.navigate("LoginOrSignUpScreen");
          }}
        >
          <Text style={styles.buttonOutlineText}>ログイン画面に戻る</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f8f9fa",
        justifyContent: "center",
    },
    sectionContainer: {
        backgroundColor: "#ffffff",
        borderRadius: 12,
        padding: 24,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 16,
        color: "#1e3a8a",
        textAlign: "center",
    },
    messageText: {
        fontSize: 16,
        lineHeight: 24,
        color: "#475569",
        marginBottom: 24,
        textAlign: "center",
    },
    buttonContainer: {
        backgroundColor: "#1e3a8a",
        borderRadius: 12,
        padding: 14,
        marginBottom: 16,
        alignItems: "center",
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
    },
    buttonOutline: {
        backgroundColor: "#ffffff",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#1e3a8a",
        padding: 14,
        marginBottom: 8,
        alignItems: "center",
    },
    buttonOutlineText: {
        color: "#1e3a8a",
        fontSize: 16,
        fontWeight: "600",
    },
});