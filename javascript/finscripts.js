// Import Firebase Authentication and Firestore functions
import { auth, provider } from './firebaseconf';
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Sentences for dynamic typing
const sentences = [
    "Let Finny help you be financially smarter!",
    "Save more, spend wisely with Finny.",
    "Achieve your financial goals with ease.",
    "Finny is here to make budgeting fun!"
];

// Wait for DOM content to load
document.addEventListener("DOMContentLoaded", () => {
    const dynamicText = document.getElementById("dynamic-text");
    const circle = document.querySelector(".green-circle");

    if (!dynamicText || !circle) {
        console.error("Dynamic text or circle element not found in the DOM.");
        return;
    }

    let i = 0;
    let j = 0;
    let isDeleting = false;

    // Typewriter Effect
    function typeEffect() {
        const currentSentence = sentences[i];

        if (isDeleting) {
            dynamicText.textContent = currentSentence.substring(0, j--);
        } else {
            dynamicText.textContent = currentSentence.substring(0, j++);
        }

        // Update the circle position
        const dynamicTextRect = dynamicText.getBoundingClientRect();
        circle.style.left = `${dynamicTextRect.width + 10}px`; // Adjust offset for better positioning

        if (!isDeleting && j === currentSentence.length) {
            isDeleting = true;
            setTimeout(typeEffect, 1000); // Pause before deleting
        } else if (isDeleting && j === 0) {
            isDeleting = false;
            i = (i + 1) % sentences.length;
            setTimeout(typeEffect, 500); // Pause before typing new sentence
        } else {
            const speed = isDeleting ? 50 : 100; // Typing speed
            setTimeout(typeEffect, speed);
        }
    }

    typeEffect();

    // Google Sign-In Handling
    const loginButton = document.getElementById("login-btn");

    loginButton?.addEventListener("click", () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                console.log("User signed in:", user);

                // Save user data to Firestore
                saveUserData(user);

                // Redirect to main page after successful login
                window.location.href = "mainpage.html";
            })
            .catch((error) => {
                console.error("Error during Google Sign-In:", error);
                alert("An error occurred. Please try again.");
            });
    });

    // Save user data to Firestore
    async function saveUserData(user) {
        try {
            const db = getFirestore();
            const userRef = doc(db, "users", user.uid); // Reference to user document
            await setDoc(userRef, {
                name: user.displayName,
                email: user.email,
                profilePicture: user.photoURL,
                lastLogin: new Date(),
            });
            console.log("User data saved successfully.");
        } catch (error) {
            console.error("Error saving user data to Firestore:", error);
        }
    }
});
