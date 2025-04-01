// 認証状態を管理するコンテキスト

import React from "react";

export enum State {
  LOADING = 'loading',
  SIGNED_IN = 'signedIn',
  NEED_EMAIL_VERIFICATION = 'needEmailVerification',
  SIGNED_OUT = 'signedOut',
}

export function creatInitialAuthState() {
    return State.LOADING;
}

export const authContext = React.createContext({
  authState: creatInitialAuthState(),
  setAuthState: (_: State) => {},
});