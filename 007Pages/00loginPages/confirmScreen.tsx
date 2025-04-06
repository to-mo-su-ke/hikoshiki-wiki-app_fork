//入力情報の確認とサインアップを行う画面です

import {
    View,
    Alert,
    Text,
    TouchableOpacity,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import SignUpWithEmail from "../../004BackendModules/loginMethod/signUpWithEmail";
import sendVerificationEmail from "../../004BackendModules/loginMethod/sendVerificationEmail";
import submitPersonalInformation from "../../004BackendModules/loginMethod/submitPersonalInformation";
import { confirmScreenStyles } from "../../002Styles/loginstyle";

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
        <ScrollView style={confirmScreenStyles.container}>
            <Text style={confirmScreenStyles.title}>登録情報の確認</Text>
            <View style={confirmScreenStyles.sectionContainer}>
                <Text style={confirmScreenStyles.sectionTitle}>アカウント情報</Text>
                <View style={confirmScreenStyles.infoRow}>
                    <Text style={confirmScreenStyles.infoLabel}>メールアドレス:</Text>
                    <Text style={confirmScreenStyles.infoValue}>{email}</Text>
                </View>
                <View style={confirmScreenStyles.infoRow}>
                    <Text style={confirmScreenStyles.infoLabel}>ユーザー名:</Text>
                    <Text style={confirmScreenStyles.infoValue}>{username}</Text>
                </View>
            </View>
            
            <View style={confirmScreenStyles.sectionContainer}>
                <Text style={confirmScreenStyles.sectionTitle}>学籍情報</Text>
                <View style={confirmScreenStyles.infoRow}>
                    <Text style={confirmScreenStyles.infoLabel}>学年:</Text>
                    <Text style={confirmScreenStyles.infoValue}>{grade}</Text>
                </View>
                <View style={confirmScreenStyles.infoRow}>
                    <Text style={confirmScreenStyles.infoLabel}>学部:</Text>
                    <Text style={confirmScreenStyles.infoValue}>{school}</Text>
                </View>
                <View style={confirmScreenStyles.infoRow}>
                    <Text style={confirmScreenStyles.infoLabel}>学科:</Text>
                    <Text style={confirmScreenStyles.infoValue}>{department}</Text>
                </View>
                <View style={confirmScreenStyles.infoRow}>
                    <Text style={confirmScreenStyles.infoLabel}>コース:</Text>
                    <Text style={confirmScreenStyles.infoValue}>{course}</Text>
                </View>
                <View style={confirmScreenStyles.infoRow}>
                    <Text style={confirmScreenStyles.infoLabel}>専攻:</Text>
                    <Text style={confirmScreenStyles.infoValue}>{major}</Text>
                </View>
                <View style={confirmScreenStyles.infoRow}>
                    <Text style={confirmScreenStyles.infoLabel}>研究室:</Text>
                    <Text style={confirmScreenStyles.infoValue}>{researchroom}</Text>
                </View>
            </View>
            
            <View style={confirmScreenStyles.sectionContainer}>
                <Text style={confirmScreenStyles.sectionTitle}>その他情報</Text>
                <View style={confirmScreenStyles.infoRow}>
                    <Text style={confirmScreenStyles.infoLabel}>ロール:</Text>
                    <Text style={confirmScreenStyles.infoValue}>{role}</Text>
                </View>
                <View style={confirmScreenStyles.infoRow}>
                    <Text style={confirmScreenStyles.infoLabel}>部活動:</Text>
                    <Text style={confirmScreenStyles.infoValue}>{club}</Text>
                </View>
            </View>
            
            <TouchableOpacity style={confirmScreenStyles.buttonContainer} onPress={signUp}>
                <Text style={confirmScreenStyles.buttonText}>登録する</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}