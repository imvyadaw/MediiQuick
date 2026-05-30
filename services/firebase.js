import { initializeApp, getApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-functions.js";

export const firebaseConfig = Object.freeze({
  apiKey: "AIzaSyCMuXqTYFjN1r1DMQZyCRkIWPQ529HUdPo",
  authDomain: "mediiquick-25a65.firebaseapp.com",
  projectId: "mediiquick-25a65",
  storageBucket: "mediiquick-25a65.firebasestorage.app",
  messagingSenderId: "480632265996",
  appId: "1:480632265996:web:d58747c0a12e780eddfd29"
});

let app;
try { app = getApp(); } catch (_) { app = initializeApp(firebaseConfig); }

export { app };
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app, 'asia-south1');

export const callFunction = (name) => httpsCallable(functions, name);
