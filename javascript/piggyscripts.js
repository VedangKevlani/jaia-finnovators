import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { db } from "./firebaseconf.js";

document.addEventListener("DOMContentLoaded", () => {
  const auth = getAuth();

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      alert("User is not logged in.");
      return;
    }

    const userId = user.uid;

    // Reference to the user's walletData
    const walletRef = doc(db, "users", userId, "walletData", "financialData");

    // Helper Functions
    const getCurrentBalance = () => {
      const piggyBalanceElement = document.getElementById("piggy-balance");
      return parseFloat(piggyBalanceElement.textContent.replace(/[^0-9.-]+/g, "")) || 0;
    };

    const updateBalance = (newBalance) => {
      const piggyBalanceElement = document.getElementById("piggy-balance");
      piggyBalanceElement.textContent = newBalance.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      });

      // Update piggy descriptive text
    updatePiggyDescriptiveText(newBalance);
    };

    const updatePiggyDescriptiveText = (balance) => {
      const piggyDescriptiveText = document.querySelector(".gradient-text-nu");
      if (balance >= 20000) {
        piggyDescriptiveText.textContent = "well-fed!";
      } else if (balance <= 10000) {
        piggyDescriptiveText.textContent = "hungry!";
      } else {
        piggyDescriptiveText.textContent = "average!";
      }
    };
  

    const loadSavings = async () => {
      try {
        const walletSnapshot = await getDoc(walletRef);
        if (walletSnapshot.exists()) {
          const data = walletSnapshot.data();
          updateBalance(data.savings || 0); // Initialize piggy-balance with savings
        } else {
          console.log("No wallet data found.");
        }
      } catch (error) {
        console.error("Error loading savings data:", error);
      }
    };

    const saveSavings = async (newBalance) => {
      try {
        await updateDoc(walletRef, { savings: newBalance });
        console.log("Savings updated in Firestore.");
      } catch (error) {
        console.error("Error updating savings in Firestore:", error);
      }
    };

    // Modal Elements
    const piggyModal = document.getElementById("piggy-bank-modal");
    const piggyText = document.querySelector(".see-piggy-text");
    const piggyImage = document.querySelector(".piggy-image");
    const closePiggyModalBtn = document.getElementById("close-piggy-modal-btn");

    const addPiggyModal = document.getElementById("add-to-piggy-modal");
    const addPiggyInput = document.getElementById("add-piggy-input");
    const confirmAddPiggyBtn = document.getElementById("confirm-add-piggy-btn");
    const cancelAddPiggyBtn = document.getElementById("cancel-add-piggy-btn");
    const addToPiggyBtn = document.getElementById("add-to-piggy-btn");

    const dipPiggyModal = document.getElementById("dip-in-piggy-modal");
    const dipPiggyInput = document.getElementById("dip-in-piggy-input");
    const confirmDipPiggyBtn = document.getElementById("confirm-dip-in-piggy-btn");
    const cancelDipPiggyBtn = document.getElementById("cancel-dip-in-piggy-btn");
    const dipInPiggyBtn = document.getElementById("dip-in-piggy-btn");

    const emptyPiggyBtn = document.getElementById("empty-piggy-btn");

    const openModal = (modal) => modal.classList.remove("hidden");
    const closeModal = (modal) => modal.classList.add("hidden");

    // Event Listeners for Piggy Modal
    piggyText?.addEventListener("click", () => openModal(piggyModal));
    piggyImage?.addEventListener("click", () => openModal(piggyModal));
    closePiggyModalBtn?.addEventListener("click", () => closeModal(piggyModal));

    // Add to Piggy
    addToPiggyBtn?.addEventListener("click", () => {
      addPiggyInput.value = ""; // Clear input field
      openModal(addPiggyModal);
    });

    confirmAddPiggyBtn?.addEventListener("click", async () => {
      const addedAmount = parseFloat(addPiggyInput.value);
      if (!isNaN(addedAmount) && addedAmount > 0) {
        const newBalance = getCurrentBalance() + addedAmount;
        updateBalance(newBalance);
        await saveSavings(newBalance); // Save to Firestore
        closeModal(addPiggyModal);
      } else {
        alert("Please enter a valid amount.");
      }
    });

    cancelAddPiggyBtn?.addEventListener("click", () => closeModal(addPiggyModal));

    // Dip in Piggy
    dipInPiggyBtn?.addEventListener("click", () => {
      dipPiggyInput.value = ""; // Clear input field
      openModal(dipPiggyModal);
    });

    confirmDipPiggyBtn?.addEventListener("click", async () => {
      const dipAmount = parseFloat(dipPiggyInput.value);
      if (!isNaN(dipAmount) && dipAmount > 0) {
        const currentBalance = getCurrentBalance();
        if (dipAmount > currentBalance) {
          alert("You can't dip more than the current balance.");
        } else {
          const newBalance = currentBalance - dipAmount;
          updateBalance(newBalance);
          await saveSavings(newBalance); // Save to Firestore
          closeModal(dipPiggyModal);
        }
      } else {
        alert("Please enter a valid amount.");
      }
    });

    cancelDipPiggyBtn?.addEventListener("click", () => closeModal(dipPiggyModal));

    // Empty Piggy
    emptyPiggyBtn?.addEventListener("click", async () => {
      if (confirm("Are you sure you want to empty the piggy bank?")) {
        updateBalance(0);
        await saveSavings(0); // Save to Firestore
      }
    });

    // Load initial savings data
    await loadSavings();
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