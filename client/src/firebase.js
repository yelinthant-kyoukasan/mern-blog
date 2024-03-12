// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-815b9.firebaseapp.com",
  projectId: "mern-blog-815b9",
  storageBucket: "mern-blog-815b9.appspot.com",
  messagingSenderId: "424026165039",
  appId: "1:424026165039:web:15191d7dac48468543dbda"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);