// Import Firebase modules using the modular SDK (v9+)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
// Import the functions you need from the SDKs you need  
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// Google Sign-In Handling
function handleGoogleSignIn() {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            console.log("User signed in:", user);

            // Optionally save user data to Firestore
            saveUserData(user);

            // Redirect to main page after successful login
            window.location.href = "mainpage.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Error signing in with Google:", errorCode, errorMessage);
            alert("An error occurred: " + errorMessage);
        });
}

// Event listener for login button
const loginButton = document.getElementById("login-btn");
loginButton.addEventListener("click", handleGoogleSignIn);

// Function to save user data to Firestore (optional)
async function saveUserData(user) {
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
        name: user.displayName,
        email: user.email,
        profilePicture: user.photoURL,
        lastLogin: new Date()
    });
}