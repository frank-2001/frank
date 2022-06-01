// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKkRSaNY4_kR54uDBAdlmzjduPmSZ31nI",
  authDomain: "mapathi-1b04f.firebaseapp.com",
  projectId: "mapathi-1b04f",
  storageBucket: "mapathi-1b04f.appspot.com",
  messagingSenderId: "245026187325",
  appId: "1:245026187325:web:06b74b50d096a1b46da254",
  measurementId: "G-ZEMKP4LQK7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);