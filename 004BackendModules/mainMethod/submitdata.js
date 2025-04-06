import { firestore } from "../firebaseMetod/firestore"; // 正しいパスにアップデート

export const submitDataToFirestore = async (formData, collectionName = "information") => {
  try {
    await firestore.collection(collectionName).add(formData);
  } catch (error) {
    console.error("Error submitting data:", error);
  }
};

export const checkDuplicateName = async (name, collectionName) => {
  try {
    const querySnapshot = await firestore.collection(collectionName).where("searchText", "==", name).get();
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking duplicate name:", error);
    return false;
  }
};