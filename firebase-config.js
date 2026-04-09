import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCMuXqTYFjN1r1DMQZyCRkIWPQ529HUdPo",
  authDomain: "mediiquick-25a65.firebaseapp.com",
  projectId: "mediiquick-25a65",
  storageBucket: "mediiquick-25a65.firebasestorage.app",
  messagingSenderId: "480632265996",
  appId: "1:480632265996:web:d58747c0a12e780eddfd29"
};


let app;
try {
  app = initializeApp(firebaseConfig);
} catch (e) {

  const { getApp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
  app = getApp();
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export { app };
