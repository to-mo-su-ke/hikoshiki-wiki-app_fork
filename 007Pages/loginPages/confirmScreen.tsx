//入力情報の確認とサインアップを行う画面です

import {
    StyleSheet,
    View,
    TextInput,
    Button,
    Alert,
    Text,
    TouchableOpacity,
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
        <ScrollView style={styles.container}>
            <Text style={styles.title}>登録情報の確認</Text>
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>アカウント情報</Text>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>メールアドレス:</Text>
                    <Text style={styles.infoValue}>{email}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>ユーザー名:</Text>
                    <Text style={styles.infoValue}>{username}</Text>
                </View>
            </View>
            
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>学籍情報</Text>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>学年:</Text>
                    <Text style={styles.infoValue}>{grade}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>学部:</Text>
                    <Text style={styles.infoValue}>{school}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>学科:</Text>
                    <Text style={styles.infoValue}>{department}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>コース:</Text>
                    <Text style={styles.infoValue}>{course}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>専攻:</Text>
                    <Text style={styles.infoValue}>{major}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>研究室:</Text>
                    <Text style={styles.infoValue}>{researchroom}</Text>
                </View>
            </View>
            
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>その他情報</Text>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>ロール:</Text>
                    <Text style={styles.infoValue}>{role}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>部活動:</Text>
                    <Text style={styles.infoValue}>{club}</Text>
                </View>
            </View>
            
            <TouchableOpacity style={styles.buttonContainer} onPress={signUp}>
                <Text style={styles.buttonText}>登録する</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}   

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f8f9fa",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#1e3a8a",
        textAlign: "center",
    },
    sectionContainer: {
        backgroundColor: "#ffffff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
        color: "#334155",
    },
    infoRow: {
        flexDirection: "row",
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#f1f5f9",
        paddingBottom: 8,
    },
    infoLabel: {
        width: 110,
        fontSize: 15,
        fontWeight: "500",
        color: "#64748b",
    },
    infoValue: {
        flex: 1,
        fontSize: 15,
        color: "#334155",
    },
    buttonContainer: {
        backgroundColor: "#1e3a8a",
        borderRadius: 12,
        padding: 14,
        marginVertical: 16,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
    },
});