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
