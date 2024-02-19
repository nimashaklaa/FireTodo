
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDHTzuBTfRuqyCzrISYiKDN194TsZkYn68",
    authDomain: "todo-b283a.firebaseapp.com",
    projectId: "todo-b283a",
    storageBucket: "todo-b283a.appspot.com",
    messagingSenderId: "814657947820",
    appId: "1:814657947820:web:20db14711ace3f1917b709"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);

export const FIREBASE_AUTH = getAuth(FIREBASE_APP);