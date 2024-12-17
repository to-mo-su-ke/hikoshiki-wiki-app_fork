import {UserData, importUserData, editUserData} from "./UserData";
import {getUserId} from "../lib/firebase";
import { styles } from "../styles/styles";
import { useEffect, useState } from "react";
import { View, Text, TextInput } from "react-native";
import { User } from "react-native-gifted-chat";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const UserDataEditComponent = () => {
    const [uid, setUid] = useState<string | undefined>();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [userName, setUserName] = useState<string>("");
    
    const signin = async () => {
        const uid = await getUserId();
        setUid(uid);
    }    

    useEffect(() => {
        signin();
    }, []);

    return (
    <SafeAreaView>
        <View style={styles.inputContainer}>
            <Text>ユーザー名:</Text>
            <TextInput
            style={styles.textInput}
            placeholder="テキストを入力"
            value={userName}
            onChangeText={(value) => setUserName(value)}
            />
        </View>

        <TouchableOpacity
            style={styles.textInput}
            onPress={() => editUserData(uid, newUserData)}
        >
            <Text style={styles.textInput}>変更</Text>
        </TouchableOpacity>
    </SafeAreaView>
    );
};

export default UserDataEditComponent;