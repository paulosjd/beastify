// Import the functions you need from the SDKs you need
import { initializeApp } from "@firebase/app";
import { getAuth } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "@firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA7WcmtmOBmlUDLLFYEzd-B6ksVD8K_8pU",
  authDomain: "fir-react-16b4d.firebaseapp.com",
  projectId: "fir-react-16b4d",
  storageBucket: "fir-react-16b4d.appspot.com",
  messagingSenderId: "457263847185",
  appId: "1:457263847185:web:d20095f49f62344b9f5eb0",
  measurementId: "G-67NB340CQE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
