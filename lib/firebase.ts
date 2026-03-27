import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDtOTG-LUabRBohHtXy2veHFHQfsP0GINY",
  authDomain: "rblx-rp-servers.firebaseapp.com",
  projectId: "rblx-rp-servers",
  storageBucket: "rblx-rp-servers.firebasestorage.app",
  messagingSenderId: "42920368528",
  appId: "1:42920368528:web:b112faf341adb670273b15",
  measurementId: "G-YCSM0BMZ0N"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new (require("firebase/auth").GoogleAuthProvider)();