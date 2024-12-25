// Import Firebase Authentication and Firestore functions
import { auth, provider } from './firebaseconf.js'; // Firebase auth and provider from firebaseconf.js
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js"; // Add signInWithPopup import
// Sentences for dynamic typing
const sentences = [
    "Let Finny help you be financially smarter!",
    "Save more, spend wisely with Finny.",
    "Achieve your financial goals with ease.",
    "Finny is here to make budgeting fun!"
];

const dynamicText = document.getElementById("dynamic-text");
const circle = document.querySelector(".green-circle");

let i = 0;
let j = 0;
let currentSentence = "";
let isDeleting = false;

// Typewriter Effect
function typeEffect() {
    currentSentence = sentences[i];

    if (isDeleting) {
        dynamicText.textContent = currentSentence.substring(0, j--);
    } else {
        dynamicText.textContent = currentSentence.substring(0, j++);
    }

    // Move the circle right before the current letter
    const textWidth = dynamicText.offsetWidth;
    circle.style.left = `${textWidth - 10}px`;

    if (!isDeleting && j === currentSentence.length) {
        isDeleting = true;
        setTimeout(typeEffect, 1000);
    } else if (isDeleting && j === 0) {
        isDeleting = false;
        i = (i + 1) % sentences.length;
        setTimeout(typeEffect, 500);
    } else {
        const speed = isDeleting ? 50 : 100;
        setTimeout(typeEffect, speed);
    }
}

typeEffect();

// Google Sign-In Handling
const loginButton = document.getElementById("login-btn");

function handleGoogleSignIn() {
    loginButton.disabled = true; // Disable the button to prevent multiple clicks

    signInWithPopup(auth, provider)
        .then(async (result) => {
            const user = result.user;
            console.log("User signed in:", user);

            // Save user data to Firestore
            await saveUserData(user);

            // Redirect to main page after successful login
            console.log("Redirecting to mainpage.html...");
            window.location.href = "mainpage.html"; // Ensure this is right after successful sign-in
        })
        .catch((error) => {
            console.error("Error during sign-in:", error.message);
            alert("An error occurred: " + error.message);
        })
        .finally(() => {
            loginButton.disabled = false; // Re-enable button
        });
}

// Event listener for login button
loginButton.addEventListener("click", handleGoogleSignIn);

// Save user data to Firestore
async function saveUserData(user) {
    const db = getFirestore();
    const userRef = doc(db, "users", user.uid); // Reference to the user document
    try {
        await setDoc(userRef, {
            name: user.displayName,
            email: user.email,
            profilePicture: user.photoURL,
            lastLogin: new Date()
        });
        console.log("User data saved successfully.");
    } catch (error) {
        console.error("Error saving user data:", error.message);
    }
}