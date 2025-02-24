//入力情報の確認とサインアップを行う画面です

import {
    StyleSheet,
    View,
    TextInput,
    Button,
    Alert,
    Text,
  } from "react-native";

import {
    getAuth,
    setPersistence,
    browserLocalPersistence,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    applyActionCode,
} from "firebase/auth";
import submitPersonalInformation from "../../004BackendModules/loginMethod/submitPersonalInformation";
import { ScrollView } from "react-native-gesture-handler";
import SignUpWithEmail from "../../004BackendModules/loginMethod/signUpWithEmail";
import { auth } from "../../004BackendModules/messageMetod/firebase";
import sendVerificationEmail from "../../004BackendModules/loginMethod/sendVerificationEmail";

export default function ConfirmScreen({ navigation, route }) {
    const email = route.params.email;
    const password = route.params.password;
    const username = route.params.information.username;
    const grade = route.params.information.grade;
    const school = route.params.information.school;
    const department = route.params.information.department;
    const course = route.params.information.course;
    const major = route.params.information.major;
    const researchroom = route.params.information.researchroom;
    const role = route.params.information.role;
    const club = route.params.information.club;
    const information = route.params.information;

    const signUp = async () => { //　画面遷移までの間「通信中」のポップアップを出して元画面を操作不可にする
        try {
            const uid = await SignUpWithEmail(email, password); // サインアップする
            await sendVerificationEmail(); // メールアドレスの確認メールを送信する
            await submitPersonalInformation(uid, information); // ユーザー情報をfirestoreに保存する
            Alert.alert("送信が完了しました。確認メールをチェックしてください。");
            navigation.navigate("EmailResendScreen"); // emailResendScreenに遷移する
        } catch (error) {
            console.error("Error during sign up or submitting information:", error);
            Alert.alert("エラーが発生しました。もう一度お試しください。");
        }
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text>メールアドレス: {email}</Text>
                <Text>ユーザー名: {username}</Text>
                <Text>学年: {grade}</Text>
                <Text>学部: {school}</Text>
                <Text>学科: {department}</Text>
                <Text>コース: {course}</Text>
                <Text>専攻: {major}</Text>
                <Text>研究室: {researchroom}</Text>
                <Text>ロール: {role}</Text>
                <Text>部活動: {club}</Text>
                <Button title="登録" onPress={signUp} />
            </View>
        </ScrollView>
    );
}   

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});