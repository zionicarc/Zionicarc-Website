import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Actual Firebase Configuration provided by the user
const firebaseConfig = {
    apiKey: "AIzaSyCrkLXYcBAKntJe-u1PD13e0IF0mkqeRww",
    authDomain: "z-ionic-arc.firebaseapp.com",
    projectId: "z-ionic-arc",
    storageBucket: "z-ionic-arc.firebasestorage.app",
    messagingSenderId: "436666752422",
    appId: "1:436666752422:web:e3adc7db6c7e0df9c90367",
    measurementId: "G-J9YTF6X8BF"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
