import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAmkvOY-OfT8gsHt1TGVGj-XfJd5wtAgVA",
    authDomain: "esim-zkp.firebaseapp.com",
    projectId: "esim-zkp",
    storageBucket: "esim-zkp.appspot.com",
    messagingSenderId: "693823945279",
    appId: "1:693823945279:web:5126ea58ae2f1530c7968a"
};

export const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const eSIMs = collection(db, "eSIM");

export default db;