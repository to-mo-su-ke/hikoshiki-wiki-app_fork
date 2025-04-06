/*
ローディング画面
認証状態を確認中に表示する画面(現状最低1秒表示される)
認証状態に応じて遷移先を変更します

Firebase Authenticationを使用して認証状態を確認します
認証状態によって以下の遷移先を決定します:
- サインイン済み：HomeNavigator
- メール未確認：LoginOrSignUpScreen
- 未サインイン：LoginOrSignUpScreen
*/

import * as React from "react";
const { useState, useEffect, useRef } = React;
import { View, Text, Animated, Dimensions } from "react-native";
import { auth } from "../../004BackendModules/firebaseMetod/firebase";
import { onAuthStateChanged } from 'firebase/auth';
import { loadingStyles } from "../../002Styles/loginstyle";

const { width, height } = Dimensions.get('window');

const LoadingScreen = ({ navigation }) => {
  enum Status {
    LOADING = 'loading',
    SIGNED_IN = 'signedIn',
    NEED_EMAIL_VERIFICATION = 'needEmailVerification',
    SIGNED_OUT = 'signedOut',
  }
  const [user, setUser] = useState(null);
  const [authState, setAuthState] = useState(Status.LOADING);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('サインインしています:', user);
        setUser(user);
        if (user.emailVerified) {
          setAuthState(Status.SIGNED_IN);
        } else {
          setAuthState(Status.NEED_EMAIL_VERIFICATION);
        }
      } else {
        console.log('サインアウトしています');
        setUser(null);
        setAuthState(Status.SIGNED_OUT);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!minTimeElapsed) return;

    switch (authState) {
      case Status.SIGNED_IN:
        navigation.reset({
          index: 0,
          routes: [{ name: "HomeNavigator" }],
        });
        break;
      case Status.NEED_EMAIL_VERIFICATION:
        navigation.reset({
          index: 0,
          routes: [{ name: "LoginOrSignUpScreen" }],
        });
        console.log("メールアドレスの確認が必要です。");
        break;
      case Status.SIGNED_OUT:
        navigation.reset({
          index: 0,
          routes: [{ name: "LoginOrSignUpScreen" }],
        });
        break;
    }
  }, [user, authState, navigation, minTimeElapsed]);

  return (
    <View style={loadingStyles.container}>
      <Animated.View
        style={[
          loadingStyles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={loadingStyles.appTitle}>非公式Wiki</Text>
        <Text style={loadingStyles.appSubtitle}>大学生活をもっと便利に</Text>
      </Animated.View>

      <Animated.View
        style={[
          loadingStyles.loadingIndicator,
          {
            transform: [{ rotate: spin }],
          },
        ]}
      />

      <Animated.Text
        style={[
          loadingStyles.loadingText,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        読み込み中...
      </Animated.Text>
    </View>
  );
};

export default LoadingScreen;

