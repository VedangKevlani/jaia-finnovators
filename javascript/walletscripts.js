document.addEventListener("DOMContentLoaded", () => {
    // Event listener for action buttons
    document.querySelectorAll(".action-button").forEach((button) => {
      button.addEventListener("click", () => {
        let question = "";
  
        // Map button text to questions
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
            case "Piggy Savings":
              question = "What do I have in my Piggy Bank?";
              break;
        }
  
        // Store the question in localStorage and redirect
        localStorage.setItem("prefilledInput", question);
        window.location.href = "mainpage.html";
      });
    });
  
    // Get elements for wallet modal functionality
  const walletModal = document.getElementById("wallet-modal");
  const walletArrow = document.querySelector(".expand-icon");
  const walletText = document.querySelector(".see-wallet-text");
  const closeModalBtn = document.querySelector(".close-btn");

  // Open wallet modal on arrow or text click
  walletArrow?.addEventListener("click", () => {
    walletModal.classList.remove("hidden");
    walletModal.style.display = "block";
  });

  walletText?.addEventListener("click", () => {7
    walletModal.classList.remove("hidden");
    walletModal.style.display = "block";
  });

  // Close wallet modal on close button click
  closeModalBtn?.addEventListener("click", () => {
    walletModal.classList.add("hidden");
    walletModal.style.display = "none";
  });

  // Close wallet modal on outside click
  window.addEventListener("click", (event) => {
    if (event.target === walletModal) {
      walletModal.classList.add("hidden");
      walletModal.style.display = "none";
    }
  });

  // Sidebar toggle functionality
  const sidebar = document.querySelector(".sidebar");
  const sidebarToggle = document.querySelector(".sidebar-toggle");
  const sidebarShow = document.querySelector(".sidebar-show");

  sidebarToggle?.addEventListener("click", () => {
    sidebar.classList.add("hidden");
    sidebarShow.classList.remove("hidden");
    sidebarShow.classList.add("visible");
  });

  sidebarShow?.addEventListener("click", () => {
    sidebar.classList.remove("hidden");
    sidebarShow.classList.add("hidden");
    sidebarShow.classList.remove("visible");
  });

  
  });
  