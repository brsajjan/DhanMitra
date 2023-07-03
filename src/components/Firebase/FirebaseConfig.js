import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"

const firebaseConfig = {
    apiKey: "AIzaSyBAA4EozQqoCLjykWpH8bUeYH7CHvraGoQ",
    authDomain: "dhanmitra-a74c2.firebaseapp.com",
    databaseURL: "https://dhanmitra-a74c2-default-rtdb.firebaseio.com",
    projectId: "dhanmitra-a74c2",
    storageBucket: "dhanmitra-a74c2.appspot.com",
    messagingSenderId: "833570032921",
    appId: "1:833570032921:web:9f1a3baadfb53180d9c988"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app)