import React from "react";
import { View, Text, Button, Alert, ScrollView, Image, StyleSheet } from "react-native";
import { submitDataToFirestore } from "../../../004BackendModules/mainMethod/submitdata";

const ClubConfirmSubmit = ({ route, navigation }) => {
	const { formData } = route.params;

	// 日本語の項目名マッピング
	const labelMapping = {
		searchText: "部活名",
		selectedClubType: "部活種別",
		selectedActivityPlaces: "活動場所",
		clubDetail: "部活動詳細",
		appealPoint: "アピールポイント",
		badPoint: "バッドポイント",
		membersNumber: "所属人数",
		searchTags: "検索用タグ",
		activityIntensity: "活動強制度",
		selectedActivityFrequency: "活動頻度",
		lineId: "LINE ID",
		lineQR: "LINE QR",
		instagramId: "Instagram ID",
		instagramQR: "Instagram QR",
		twitterId: "Twitter ID",
		twitterUrl: "Twitter URL",
		twitterQR: "Twitter QR",
		discordUrl: "Discord URL",
		websiteUrl: "Website URL",
		entryFee: "入会費",
		annualFee: "年会費",
		requiredItems: "必要物品",
		weeklyActivities: "週活動内容",
		annualSchedule: "年間スケジュール",
		photo1: "写真1",
		photo2: "写真2",
	};

	const handleSubmit = async () => {
		const collectionName = "clubtest"; // 必要に応じて変更
		try {
			await submitDataToFirestore(formData, collectionName);
			Alert.alert("送信が完了しました");
			navigation.goBack();
		} catch (error) {
			console.error("送信エラー：", error);
			Alert.alert("送信に失敗しました");
		}
	};

	// オブジェクトを見やすく表示する関数
	const renderObjectData = (data) => {
		if (!data || Object.keys(data).length === 0) return "未入力";
		
		return (
			<View style={styles.nestedContainer}>
				{Object.entries(data).map(([key, val]) => (
					<Text key={key} style={styles.nestedText}>
						{key}: {val ? String(val) : "未入力"}
					</Text>
				))}
			</View>
		);
	};

	// 配列の要素を見やすく表示する関数
	const renderArrayData = (data) => {
		if (!data || data.length === 0) return "未入力";
		
		if (typeof data[0] === "object") {
			return (
				<View style={styles.nestedContainer}>
					{data.map((item, index) => (
						<View key={index} style={styles.arrayItem}>
							<Text style={styles.arrayItemTitle}>項目 {index + 1}</Text>
							{renderObjectData(item)}
						</View>
					))}
				</View>
			);
		}
		
		return data.join(", ");
	};

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
			<Text style={styles.title}>全項目の入力内容の確認</Text>
			
			{Object.entries(formData).map(([key, value]) => {
				const label = labelMapping[key] || key;
				
				// 写真の表示
				if (key === "photo1" || key === "photo2") {
					return (
						<View key={key} style={styles.item}>
							<Text style={styles.itemLabel}>{label}:</Text>
							{value ? (
								<Image
									source={{ uri: String(value) }}
									style={styles.image}
								/>
							) : (
								<Text style={styles.itemValue}>未入力</Text>
							)}
						</View>
					);
				}
				
				// 配列データの表示
				if (Array.isArray(value)) {
					return (
						<View key={key} style={styles.item}>
							<Text style={styles.itemLabel}>{label}:</Text>
							{value.length > 0 ? (
								renderArrayData(value)
							) : (
								<Text style={styles.itemValue}>未入力</Text>
							)}
						</View>
					);
				}
				
				// オブジェクトデータの表示
				if (typeof value === "object" && value !== null) {
					return (
						<View key={key} style={styles.item}>
							<Text style={styles.itemLabel}>{label}:</Text>
							{renderObjectData(value)}
						</View>
					);
				}
				
				// 通常のテキストデータの表示
				return (
					<View key={key} style={styles.item}>
						<Text style={styles.itemLabel}>{label}:</Text>
						<Text style={styles.itemValue}>
							{value ? String(value) : "未入力"}
						</Text>
					</View>
				);
			})}
			
			<View style={styles.buttonContainer}>
				<Button title="送信" onPress={handleSubmit} />
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: "#f8f8f8",
	},
	contentContainer: {
		paddingBottom: 50,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 20,
		textAlign: "center",
		color: "#333",
	},
	item: {
		marginBottom: 16,
		padding: 10,
		backgroundColor: "#fff",
		borderRadius: 8,
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowOffset: { width: 0, height: 1 },
		shadowRadius: 2,
		elevation: 2,
	},
	itemLabel: {
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 6,
		color: "#555",
	},
	itemValue: {
		fontSize: 15,
		color: "#333",
	},
	image: {
		width: 200,
		height: 200,
		marginVertical: 8,
		resizeMode: "cover",
		borderRadius: 4,
	},
	nestedContainer: {
		padding: 8,
		backgroundColor: "#f5f5f5",
		borderRadius: 4,
	},
	nestedText: {
		fontSize: 14,
		marginBottom: 3,
	},
	arrayItem: {
		padding: 8,
		marginBottom: 8,
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
	},
	arrayItemTitle: {
		fontWeight: "bold",
		marginBottom: 4,
	},
	buttonContainer: {
		marginTop: 20,
		marginBottom: 30,
	},
});

export default ClubConfirmSubmit;
