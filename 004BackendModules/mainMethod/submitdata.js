import { firestore } from "../../firebaseConfig"; 

export const submitDataToFirestore = async (formData) => {
  try {
    await firestore.collection("information").add(formData);
  } catch (error) {
    console.error("Error submitting data:", error);
  }
};
