import { StyleSheet } from 'react-native';

// タブ共通のスタイル
export const tabStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#000",
    justifyContent: "space-around",
    gap: 3,
    paddingVertical: 3,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ddd",
    paddingVertical: 15,
  },
  activeTab: {
    backgroundColor: "#aaa",
  },
  tabText: {
    fontSize: 8,
  },
  content: {
    flex: 1,
  },
});

// ホーム画面のスタイル
export const homeScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  notificationButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    zIndex: 100,
  },
  mainTabsContainer: {
    flexDirection: "row",
    backgroundColor: "#000",
    justifyContent: "space-around",
    gap: 3,
    paddingVertical: 0,
  },
  mainTab: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ddd",
    paddingVertical: 5,
  },
  mainTabImage: {
    width: 32,
    height: 32,
  },
  activeTab: {
    backgroundColor: "#aaa",
  },
  tabText: {
    fontSize: 8,
  },
});

// 部活タブ用の追加スタイル
export const bukatsuTabStyles = StyleSheet.create({
  shinkanContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 0,
  },
  shinkanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    width: '100%',
  },
  shinkanTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  createEventButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  createEventButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 12,
  },
});

// ホームタブ用の追加スタイル
export const homeTabStyles = StyleSheet.create({
  homeContentContainer: {
    flex: 1,
    width: "100%",
    position: "relative",
    paddingTop: 10,
  },
  button: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginVertical: 10,
    width: "50%",
    alignItems: "center",
    alignSelf: "center",
  },
  toggleButtonText: {
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  }
});
