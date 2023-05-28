// Import the functions you need from the SDKs you need
import { initializeApp } from "@firebase/app";
import { getAuth } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "@firebase/storage";
// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyA9MxZ1DpurcOfLOyQ8FJGgSwzAfvwyE00",
  authDomain: "beastify-a57dc.firebaseapp.com",
  projectId: "beastify-a57dc",
  storageBucket: "beastify-a57dc.appspot.com",
  messagingSenderId: "56836766076",
  appId: "1:56836766076:web:8eade8950cadeaf70d4cf9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
