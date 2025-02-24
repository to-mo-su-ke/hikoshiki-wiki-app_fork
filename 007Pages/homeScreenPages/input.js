import { uploadPhotoToFirestore } from "../../004BackendModules/mainMethod/uploadPhoto.js";

// HTML構造の生成(必要に応じてHTMLファイルへ分割可)
document.body.innerHTML = `
	<div id="uploadContainer">
		<h2>写真アップロードページ</h2>
		<input type="file" id="photoInput" accept="image/*" />
		<button id="sendButton">送信</button>
		<div id="status"></div>
	</div>
`;

document.addEventListener("DOMContentLoaded", () => {
	const fileInput = document.getElementById("photoInput");
	const sendButton = document.getElementById("sendButton");
	const statusDiv = document.getElementById("status");
	let selectedFile;

	fileInput.addEventListener("change", (event) => {
		selectedFile = event.target.files[0];
	});

	sendButton.addEventListener("click", async () => {
		if (!selectedFile) {
			statusDiv.textContent = "写真を選択してください";
			return;
		}
		statusDiv.textContent = "送信中...";
		try {
			const imageUri = URL.createObjectURL(selectedFile);
			const downloadUrl = await uploadPhotoToFirestore(imageUri);
			statusDiv.textContent = "送信完了: " + downloadUrl;
		} catch (error) {
			console.error(error);
			statusDiv.textContent = "エラーが発生しました";
		}
	});
});
