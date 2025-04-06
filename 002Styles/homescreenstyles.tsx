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
  // HomeScreen.jsから移植した追加スタイル
  commonTabsContainer: {
    flexDirection: "row",
    backgroundColor: "#000",
    justifyContent: "space-around",
    gap: 3,
    paddingVertical: 3,
  },
  commonTab: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ddd",
    paddingVertical: 15,
  },
  commonContent: {
    flex: 1,
  },
  bottun: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginVertical: 10,
    width: "50%",
    alignItems: "center",
  },
  bukatsuContentContainer: {
    flex: 1,
    width: '100%',
  },
  bukatsuTabContent: {
    flex: 1,
    width: '100%',
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

// タイムテーブル用の共通スタイル
export const timeTableStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  headerConstainer: {
    marginBottom: 16,
    height: 50,
    flexDirection: "row",
    width: "100%",
  },
  headerLeft: {
    flex: 1,
    flexDirection: "row",
    marginRight: 8,
  },
  headerRight: {
    width: 110,
    flexDirection: "row",
  },
  degree: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  department: {
    flex: 2,
    borderWidth: 0,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginLeft: 8,
  },
  grade: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    borderWidth: 0,
  },
  drop: {
    borderWidth: 0,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  timetableContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 16,
  },
  daysRow: {
    flexDirection: "row",
    backgroundColor: "#e9ecef",
    paddingVertical: 10,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  periodsContainer: {
    paddingVertical: 8,
  },
  dayCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  timeCell: {
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    marginBottom: 0,
    paddingVertical: 4,
  },
  cell: {
    flex: 1,
    height: 85,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#ffffff",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
    margin: 2,
  },
  fullCellContainer: {
    flex: 1,
    width: "100%",
    position: "relative",
    justifyContent: "center",
    padding: 4,
    backgroundColor: "#f1f8ff",
  },
  quarterContainer: {
    flex: 1,
    position: "relative",
    justifyContent: "center",
    padding: 2,
    backgroundColor: "#fff8f1",
  },
  fullCell: {
    textAlign: "center",
    fontSize: 12,
    color: "#1e3a8a",
    fontWeight: "500",
  },
  splitCell: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
  },
  quarterCell: {
    textAlign: "center",
    fontSize: 10,
    color: "#7d3b00",
    fontWeight: "500",
  },
  verticalDivider: {
    width: 1,
    backgroundColor: "#e0e0e0",
  },
  closeButton: {
    position: "absolute",
    right: 2,
    top: 2,
    zIndex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    height: 16,
    width: 16,
    lineHeight: 16,
    color: "#ff5252",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 12,
  },
  totalContainer: {
    alignItems: "flex-end",
    marginTop: 16,
    marginRight: 8,
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    alignSelf: "flex-end",
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  emptyCell: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});
