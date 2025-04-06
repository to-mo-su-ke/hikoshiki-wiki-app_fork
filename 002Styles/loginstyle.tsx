import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

// 共通スタイル - 複数の認証関連画面で使用
export const commonAuthStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#1e3a8a",
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button: {
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  infoText: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 16,
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
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
    color: "#475569",
  },
});

// ローディング画面用スタイル
export const loadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#666666',
  },
  loadingIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#cccccc',
    borderTopColor: '#3498db',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
  },
});

// ログイン/サインアップ画面用スタイル
export const loginOrSignupStyles = StyleSheet.create({
  container: {
    ...commonAuthStyles.container,
    paddingHorizontal: 24,
  },
});

// サインアップ画面用スタイル
export const signupStyles = StyleSheet.create({
  container: {
    ...commonAuthStyles.container,
    paddingHorizontal: 24,
  }
});

// 個人情報入力画面1用スタイル
export const signUp1Styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  title: {
    ...commonAuthStyles.title,
  },
  sectionContainer: {
    ...commonAuthStyles.sectionContainer,
  },
  sectionTitle: {
    ...commonAuthStyles.sectionTitle,
  },
  inputLabel: {
    ...commonAuthStyles.inputLabel,
  },
  input: {
    ...commonAuthStyles.input,
  },
  buttonContainer: {
    ...commonAuthStyles.buttonContainer,
  },
  buttonText: {
    ...commonAuthStyles.buttonText,
  },
});

// 個人情報入力画面2用スタイル
export const signUp2Styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f0f0f0",
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  title: {
    ...commonAuthStyles.title,
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
});

// 部活動選択画面用スタイル
export const selectClubStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1e3a8a",
    textAlign: "center",
  },
  sectionContainer: {
    ...commonAuthStyles.sectionContainer,
  },
  input: {
    ...commonAuthStyles.input,
    marginBottom: 12,
  },
  buttonContainer: {
    ...commonAuthStyles.buttonContainer,
    padding: 12,
    marginVertical: 12,
  },
  buttonText: {
    ...commonAuthStyles.buttonText,
  },
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  selectedItem: {
    color: "#1e3a8a",
    fontWeight: "600",
  },
  normalItem: {
    color: "#475569",
  },
});

// 確認画面用スタイル
export const confirmScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  title: {
    ...commonAuthStyles.title,
  },
  sectionContainer: {
    ...commonAuthStyles.sectionContainer,
  },
  sectionTitle: {
    ...commonAuthStyles.sectionTitle,
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
    ...commonAuthStyles.buttonContainer,
  },
  buttonText: {
    ...commonAuthStyles.buttonText,
  },
});

// メール再送信画面用スタイル
export const emailResendStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
  },
  sectionContainer: {
    ...commonAuthStyles.sectionContainer,
    padding: 24,
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
    ...commonAuthStyles.buttonContainer,
    marginBottom: 16,
  },
  buttonText: {
    ...commonAuthStyles.buttonText,
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
