document.querySelectorAll(".action-button").forEach((button) => {
    button.addEventListener("click", () => {
      let question = "";
  
      switch (button.textContent.trim()) {
        case "Income":
          question = "What is my income?";
          break;
        case "Fixed Expenses":
          question = "What are my fixed expenses?";
          break;
        case "Variable Expenses":
          question = "What are my variable expenses?";
          break;
        case "Unplanned Expenses":
          question = "What are my unplanned expenses?";
          break;
      }
  
      localStorage.setItem("prefilledInput", question);
      window.location.href = "mainpage.html";
    });
  });
  
  // Get elements
const walletModal = document.getElementById("wallet-modal");
const walletArrow = document.querySelector(".expand-icon");
const walletText = document.querySelector(".see-wallet-text");
const closeModalBtn = document.querySelector(".close-btn");

// Open modal when wallet arrow or gradient text is clicked
walletArrow.addEventListener("click", () => {
  walletModal.style.display = "block";
});

walletText.addEventListener("click", () => {
  walletModal.style.display = "block";
});

// Close modal
closeModalBtn.addEventListener("click", () => {
  walletModal.style.display = "none";
});

// Close modal on outside click
window.addEventListener("click", (event) => {
  if (event.target === walletModal) {
    walletModal.style.display = "none";
  }
});

// Sidebar toggle functionality
const sidebar = document.querySelector(".sidebar");
const sidebarToggle = document.querySelector(".sidebar-toggle");
const sidebarShow = document.querySelector(".sidebar-show");

sidebarToggle.addEventListener("click", () => {
  sidebar.classList.add("hidden");
  sidebarShow.classList.remove("hidden");
  sidebarShow.classList.add("visible");
});

sidebarShow.addEventListener("click", () => {
  sidebar.classList.remove("hidden");
  sidebarShow.classList.add("hidden");
  sidebarShow.classList.remove("visible");
});
