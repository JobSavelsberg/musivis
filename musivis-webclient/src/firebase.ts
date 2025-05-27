// Import the functions you need from the SDKs you need
import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, type Analytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBTulWgvsYzjuVW_tQ73y0edKIjUmHmGLg",
  authDomain: "jobsavelsberg-musivis.firebaseapp.com",
  projectId: "jobsavelsberg-musivis",
  storageBucket: "jobsavelsberg-musivis.firebasestorage.app",
  messagingSenderId: "886313546969",
  appId: "1:886313546969:web:2303a36d6b981867c23ac8",
  measurementId: "G-E673K12C0Y"
};

let app: FirebaseApp | null = null;
let analytics: Analytics | null = null;

export function initializeAppIfNeeded() {
  if (!app) {
    app = initializeApp(firebaseConfig);
    analytics = getAnalytics(app);
    console.log("Firebase initialized and analytics obtained.");
  }
  return { app, analytics };
}

// Export analytics instance directly for use in other parts of the app if needed,
// though it's recommended to call initializeAppIfNeeded first.
export { analytics };
