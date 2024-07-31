// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDaOiZbIDHWx8zusag_mx5bGruUevTGibA",
  authDomain: "mern-blog-2bc18.firebaseapp.com",
  projectId: "mern-blog-2bc18",
  storageBucket: "mern-blog-2bc18.appspot.com",
  messagingSenderId: "585103533715",
  appId: "1:585103533715:web:40ab75d6aaba8ed4dd0f66"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);