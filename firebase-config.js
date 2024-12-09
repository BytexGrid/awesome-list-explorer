// Firebase configuration
const firebaseConfig = {
  // You'll need to replace these with your Firebase project config
  apiKey: "AIzaSyATQAyH5VzjKtyhgZ65d7hu7ZR6bfRvz1g",
  authDomain: "awesome-list-explorer.firebaseapp.com",
  databaseURL: "https://awesome-list-explorer-default-rtdb.firebaseio.com",
  projectId: "awesome-list-explorer",
  storageBucket: "awesome-list-explorer.firebasestorage.app",
  messagingSenderId: "914407744587",
  appId: "1:914407744587:web:a1c7b8b92de7b574a259ce"
};

// Import Firebase modules from CDN
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Handle anonymous authentication
async function handleAnonymousSignIn() {
  try {
    await signInAnonymously(auth);
  } catch (error) {
    console.error("Error signing in anonymously:", error);
  }
}

// Initialize user authentication
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("User signed in anonymously");
  } else {
    handleAnonymousSignIn();
  }
});

export { database, auth };
