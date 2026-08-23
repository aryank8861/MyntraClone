import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDI0jIHIlmj3EJTGrlpK5R_ydaxUzEFrHY",
  authDomain: "myntraclone-6e50e.firebaseapp.com",
  projectId: "myntraclone-6e50e",
  storageBucket: "myntraclone-6e50e.firebasestorage.app",
  messagingSenderId: "527252848315",
  appId: "1:527252848315:web:16f5b0ab19d74483eb339e",
};

const app =
  getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);