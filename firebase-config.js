// firebase-config.js — Single source of truth for Firebase
import { initializeApp, getApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
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

// Singleton — prevent duplicate-app error (no top-level await needed)
let app;
try { app = getApp(); } catch (e) { app = initializeApp(firebaseConfig); }

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, app };

// Haversine distance
export const getDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371, dLat = (lat2-lat1)*Math.PI/180, dLon = (lon2-lon1)*Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};

// SHA-256 password hash
export const hashPassword = async (plain, salt = 'mq_salt_2024') => {
  const data = new TextEncoder().encode(plain + salt);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
};
