import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"; // Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyDa6VTr-ZwtgZ3TNj7N57vgVeY7TB7w2N0",
  authDomain: "finalproject-faf31.firebaseapp.com",
  projectId: "finalproject-faf31",
  storageBucket: "finalproject-faf31.appspot.com",
  messagingSenderId: "575564415129",
  appId: "1:575564415129:web:8030c108cb198130733808",
  measurementId: "G-039L21DG71"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const imagedb = getStorage(app);
export const db = getFirestore(app); // Initialize Firestore and export it
