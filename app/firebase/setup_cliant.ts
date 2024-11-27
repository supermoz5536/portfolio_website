// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";
// import { getFirestore } from "firebase/firestore";

// import { getFunctions } from "firebase/functions";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_JmJm11l5Royplf6OWDhYjquNR-FUOA0",
  authDomain: "portfolio-website-4645b.firebaseapp.com",
  projectId: "portfolio-website-4645b",
  storageBucket: "portfolio-website-4645b.firebasestorage.app",
  messagingSenderId: "601782516983",
  appId: "1:601782516983:web:07fb6f556409e663d1a7f2",
  measurementId: "G-YRG1GQYN8D",
};

// Initialize Firebase
// appは、Firebaseアプリケーション全体の参照を持つ
// シングルトンのインスタンスです。
// このappインスタンスを通して、Firebaseの各サービスにアクセスします。
const app = initializeApp(firebaseConfig);

// Firebaseの各種サービスの「参照」を持つ
// シングルトンのインスタンスです。
// const storage = getStorage(app);
// const db = getFirestore(app);
// const analytics = getAnalytics(app);
// const auth = getAuth(app);
// const functions = getFunctions(app);

export { app };
