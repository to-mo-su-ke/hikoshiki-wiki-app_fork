// データを暗号化して保存するexpo-secure-storeのラッパーです。
// 主にfirebaseの認証情報を初期化時に保存するときにつかいます。

import * as SecureStore from 'expo-secure-store';

/**
 * サニタイズ処理: キーに使える文字以外をアンダースコアに置換する
 * 例
 * firebase:authUser:AIzaSyDBUTuJaOcEdQvT2jAaoEdZV52IPQDKqH4:[DEFAULT]
 * ↓
 * firebase_authUser_AIzaSyDBUTuJaOcEdQvT2jAaoEdZV52IPQDKqH4__DEFAULT_
 */
function sanitizeKey(key: string): string {
  // キーが空の場合はエラーとなるので、適切なデフォルトを返すかエラーをスローする
  if (!key) {
    throw new Error('Key cannot be empty');
  }
  return key.replace(/[^a-zA-Z0-9.\-_]/g, '_');
}

export const ExpoSecureStore = {
  async getItem(key: string): Promise<string | null> {
    const sanitizedKey = sanitizeKey(key);
    return await SecureStore.getItemAsync(sanitizedKey);
  },
  async setItem(key: string, value: string): Promise<void> {
    const sanitizedKey = sanitizeKey(key);
    await SecureStore.setItemAsync(sanitizedKey, value);
  },
  async removeItem(key: string): Promise<void> {
    const sanitizedKey = sanitizeKey(key);
    await SecureStore.deleteItemAsync(sanitizedKey);
  }
};