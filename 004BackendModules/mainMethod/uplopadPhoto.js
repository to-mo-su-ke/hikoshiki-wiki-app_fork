import { firestore, storage } from "../../firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const uploadPhotoToFirestore = async (imageUri) => {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const storageRef = ref(storage, `photos/${Date.now()}.jpg`);
    await uploadBytes(storageRef, blob);

    const downloadUrl = await getDownloadURL(storageRef);
    await firestore.collection("photos").add({ url: downloadUrl });
  } catch (error) {
    console.error("Error uploading photo:", error);
  }
};
