const slides = document.querySelectorAll('.slider img'); // Select all slides
const dots = document.querySelectorAll('.nav-dots .dot'); // Select all dots
const header = document.getElementById('slider-header'); // Get the header element
const headerText = document.querySelector('.header-text'); // Get the header text container
let currentIndex = 0; // Start with the first slide

// Array of header texts corresponding to each slide
const headerTexts = [
    "Hey there, I am Finny",
    "and this is Piggy",
    "Together we help you plan your desires!"
];

function showSlide(index) {
    // Remove the 'active' class from all slides, dots, and text
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    headerText.classList.remove('active'); // Hide the text during transition

    // Add the 'active' class to the current slide, dot, and text
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    headerText.classList.add('active'); // Show the text after transition

    // Change the header text based on the current slide
    header.textContent = headerTexts[index];
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length; // Loop back to the first slide
    showSlide(currentIndex);
}

// Initialize the first slide as active
showSlide(currentIndex);

// Automatically transition to the next slide every 3 seconds
setInterval(nextSlide, 3000);

// Add event listeners to dots for manual navigation
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
        currentIndex = index; // Update the currentIndex for manual navigation
    });
});
