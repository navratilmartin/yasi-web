// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCugwlqnqYhJyO3_2od329-nY8xFT-SpKE",
    authDomain: "yasi-23d8e.firebaseapp.com",
    projectId: "yasi-23d8e",
    storageBucket: "yasi-23d8e.appspot.com",
    messagingSenderId: "133734155097",
    appId: "1:133734155097:web:463f9358ca4d3e7d548248",
    measurementId: "G-XKRG5JHW2G"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export default app;
export { auth };