// Import Firebase modules
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { db } from "./firebaseconf.js";

document.addEventListener("DOMContentLoaded", () => {
  const auth = getAuth();

  // Check authentication state
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      alert("User is not logged in.");
      return;
    }




    const userId = user.uid;
    const walletRef = doc(db, "users", userId, "walletData", "financialData");

    // Load wallet data from Firebase
    async function loadWalletData() {
      try {
        const walletSnapshot = await getDoc(walletRef);
        if (walletSnapshot.exists()) {
          const data = walletSnapshot.data();
          updateWalletDisplay(data);
        } else {
          console.log("No wallet data found for the user.");
        }
      } catch (error) {
        console.error("Error loading wallet data:", error);
      }
    }

    // Update wallet display dynamically
    function updateWalletDisplay(data) {
      const income = data.income || 0;
      const fixedExpenses = data.fixedExpenses || 0;
      const variableExpenses = data.variableExpenses || 0;
      const unplannedExpenses = data.unplannedExpenses || 0;
      const savings = data.savings || 0;

      const walletAmount = income - (fixedExpenses + variableExpenses + unplannedExpenses + savings);

      document.querySelector(".wallet-amount").textContent = `$${walletAmount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
      })}`;

      // Update descriptive text
      updateDescriptiveText(walletAmount);

      document.getElementById("wallet-income").value = income;
      document.getElementById("wallet-fixed-expenses").value = fixedExpenses;
      document.getElementById("wallet-variable-expenses").value = variableExpenses;
      document.getElementById("wallet-unplanned-expenses").value = unplannedExpenses;
      document.getElementById("wallet-savings").value = savings;
    }


    function updateDescriptiveText(walletAmount) {
      const descriptiveTextElement = document.querySelector(".gradient-text-nu");

      if (walletAmount > 50000) {
        descriptiveTextElement.textContent = "hefty!";
      } else if (walletAmount < 20000) {
        descriptiveTextElement.textContent = "scanty!";
      } else {
        descriptiveTextElement.textContent = "average!";
      }
    }
    // Open wallet modal
    const walletModal = document.getElementById("wallet-modal");
    document.querySelector(".expand-icon")?.addEventListener("click", () => {
      walletModal.classList.remove("hidden");
      walletModal.style.display = "block";
    });

    // Close wallet modal
    document.querySelector(".close-btn")?.addEventListener("click", () => {
      walletModal.classList.add("hidden");
      walletModal.style.display = "none";
    });

    // Save wallet data to Firebase
    document.getElementById("save-wallet")?.addEventListener("click", async () => {
      const income = parseFloat(document.getElementById("wallet-income").value) || 0;
      const fixedExpenses = parseFloat(document.getElementById("wallet-fixed-expenses").value) || 0;
      const variableExpenses = parseFloat(document.getElementById("wallet-variable-expenses").value) || 0;
      const unplannedExpenses = parseFloat(document.getElementById("wallet-unplanned-expenses").value) || 0;
      const savings = parseFloat(document.getElementById("wallet-savings").value) || 0;
      const walletData = {
        income,
        fixedExpenses,
        variableExpenses,
        unplannedExpenses,
        savings,
      };

      try {
        // Save to Firebase
        await setDoc(walletRef, walletData);
        
        // Update wallet display
        updateWalletDisplay(walletData);

        // Close modal
        walletModal.classList.add("hidden");
        walletModal.style.display = "none";
      } catch (error) {
        console.error("Error saving wallet data:", error);
      }
    });

    // Initialize wallet display
    await loadWalletData();
  });

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

  