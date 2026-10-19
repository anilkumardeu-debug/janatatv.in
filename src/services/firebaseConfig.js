import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  projectId: "janatatv-media",
  appId: "1:885469593598:web:792925eccb297622e14aaf",
  storageBucket: "janatatv-media.firebasestorage.app",
  apiKey: "AIzaSyCcBfh6x9fqcpMDo1ZilnLc7sWhBwmeq64",
  authDomain: "janatatv-media.firebaseapp.com",
  messagingSenderId: "885469593598",
  projectNumber: "885469593598"
};

let app = null;
let firestoreDb = null;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  firestoreDb = getFirestore(app);
} catch (err) {
  console.warn('[Firebase] Initialization notice:', err.message);
}

export { app, firestoreDb };
