// Import Firebase modules using the modular SDK (v9+)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    collection,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAGA-H_wK1RIijn6WqIHt0322MUt9hzHa4",
    authDomain: "finnovators-bb552.firebaseapp.com",
    projectId: "finnovators-bb552",
    storageBucket: "finnovators-bb552.firebasestorage.app",
    messagingSenderId: "74279975494",
    appId: "1:74279975494:web:c92ff6fb01f1d58e35e847",
    measurementId: "G-EMQNRR0CS7"
};


// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app); // Export the auth instance
export const provider = new GoogleAuthProvider(); // Export the Google Auth provider
export const db = getFirestore(app); // Export the Firestore instance

// Google Sign-In Handling
export async function handleGoogleSignIn() {
    signInWithPopup(auth, provider)
        .then(async (result) => {
            const user = result.user;
            console.log("User signed in:", user);

            // Initialize user data and sub-collections
            await initializeUserData(user);

            // Redirect to the main page
            window.location.href = "mainpage.html";
        })
        .catch((error) => {
            console.error("Error signing in with Google:", error.code, error.message);
            alert("An error occurred: " + error.message);
        });
}

// Add event listener to the login button
document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("login-btn");
    if (loginButton) {
        loginButton.addEventListener("click", handleGoogleSignIn);
    }
});


// Initialize user data
export async function initializeUserData(user) {
    try {
        console.log("Initializing user data for:", user.uid); // Debug log
        const userRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
            console.log("Creating new user document for:", user.uid); // Debug log

            // Create the main user document
            await setDoc(userRef, {
                name: user.displayName,
                email: user.email,
                profilePicture: user.photoURL,
                lastLogin: new Date(),
            });

            // Create default walletData
            const walletRef = doc(db, "users", user.uid, "walletData", "financialData");
            await setDoc(walletRef, {
                income: 0,
                fixedExpenses: 0,
                variableExpenses: 0,
                plannedExpenses: 0,
                savings: 0,
            });

            // Create default goalData
            const goalRef = collection(db, "users", user.uid, "goalData");
            await setDoc(doc(goalRef), {
                description: "Example Goal",
                cost: 0,
                deadline: new Date(),
                progress: 0,
            });

            console.log("User document and sub-collections created successfully for:", user.uid);
        } else {
            console.log("User document already exists for:", user.uid); // Debug log

            // Update last login timestamp
            await setDoc(userRef, { lastLogin: new Date() }, { merge: true });
        }
    } catch (error) {
        console.error("Error initializing user data:", error);
    }
}
