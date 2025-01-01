import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCF_iEABM1G_1mXcOIVWf8PuMm6wDCBW00",
  authDomain: "ai-aestrologer.firebaseapp.com",
  projectId: "ai-aestrologer",
  storageBucket: "ai-aestrologer.firebasestorage.app",
  messagingSenderId: "113037595805",
  appId: "1:113037595805:web:baa9b0b994b8d2e4883074",
  measurementId: "G-J3BBML53X9",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default app;
export { db };
