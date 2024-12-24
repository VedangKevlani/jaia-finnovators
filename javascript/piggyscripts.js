import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { db } from "./firebaseconf.js";

document.addEventListener("DOMContentLoaded", () => {
  // Piggy Bank Modal Elements
  const piggyModal = document.getElementById("piggy-bank-modal");
  const piggyText = document.querySelector(".see-piggy-text");
  const piggyImage = document.querySelector(".piggy-image");
  const closePiggyModalBtn = document.getElementById("close-piggy-modal-btn");

  // Add to Piggy Modal Elements
  const addPiggyModal = document.getElementById("add-to-piggy-modal");
  const addPiggyInput = document.getElementById("add-piggy-input");
  const confirmAddPiggyBtn = document.getElementById("confirm-add-piggy-btn");
  const cancelAddPiggyBtn = document.getElementById("cancel-add-piggy-btn");
  const addToPiggyBtn = document.getElementById("add-to-piggy-btn");

  // Dip in Piggy Modal Elements
  const dipPiggyModal = document.getElementById("dip-in-piggy-modal");
  const dipPiggyInput = document.getElementById("dip-in-piggy-input");
  const confirmDipPiggyBtn = document.getElementById("confirm-dip-in-piggy-btn");
  const cancelDipPiggyBtn = document.getElementById("cancel-dip-in-piggy-btn");
  const dipInPiggyBtn = document.getElementById("dip-in-piggy-btn");

  // Empty Piggy Button
  const emptyPiggyBtn = document.getElementById("empty-piggy-btn");

  // Helper Functions
  const openModal = (modal) => modal.classList.remove("hidden");
  const closeModal = (modal) => modal.classList.add("hidden");

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
  };

  // Open Piggy Modal
  piggyText?.addEventListener("click", () => openModal(piggyModal));
  piggyImage?.addEventListener("click", () => openModal(piggyModal));
  closePiggyModalBtn?.addEventListener("click", () => closeModal(piggyModal));

  // Add to Piggy
  addToPiggyBtn?.addEventListener("click", () => {
    addPiggyInput.value = ""; // Clear input
    openModal(addPiggyModal);
  });

  confirmAddPiggyBtn?.addEventListener("click", () => {
    const addedAmount = parseFloat(addPiggyInput.value);
    if (!isNaN(addedAmount) && addedAmount > 0) {
      updateBalance(getCurrentBalance() + addedAmount);
      closeModal(addPiggyModal);
    } else {
      alert("Please enter a valid amount.");
    }
  });

  cancelAddPiggyBtn?.addEventListener("click", () => closeModal(addPiggyModal));

  // Dip in Piggy
  dipInPiggyBtn?.addEventListener("click", () => {
    dipPiggyInput.value = ""; // Clear input
    openModal(dipPiggyModal);
  });

  confirmDipPiggyBtn?.addEventListener("click", () => {
    const dipAmount = parseFloat(dipPiggyInput.value);
    if (!isNaN(dipAmount) && dipAmount > 0) {
      const currentBalance = getCurrentBalance();
      if (dipAmount > currentBalance) {
        alert("You can't dip more than the current balance.");
      } else {
          // Add new goal
          const goalDiv = document.createElement("div");
          goalDiv.className = "goal-rectangle";
          goalDiv.dataset.id = `${Date.now()}`; // Unique ID for the goal

          goalDiv.innerHTML = `
              <span class="star-icon">
                  ★
              </span>
              ${description} for ${formattedCost} by ${timeline}
              <span class="edit-icon" data-description="${description}" data-cost="${cost}" data-timeline="${timeline}">
                  ✎
              </span>
              <span class="delete-icon">
                  🗑
              </span>
          `;

          goalContainer.appendChild(goalDiv);
          addGoalEventListeners(goalDiv);
      }
  }

  function addGoalEventListeners(goalDiv) {
      // Handle edit icon click
      goalDiv.querySelector(".edit-icon").addEventListener("click", (event) => {
          const description = event.target.getAttribute("data-description");
          const cost = event.target.getAttribute("data-cost");
          const timeline = event.target.getAttribute("data-timeline");

          // Populate the modal with existing goal data
          document.getElementById("goal-description").value = description;
          document.getElementById("goal-cost").value = cost;
          document.getElementById("goal-timeline").value = timeline;

          // Set editing ID
          document.getElementById("confirm-goal-btn").dataset.editing = goalDiv.dataset.id;

          // Show the modal for editing
          document.getElementById("goal-modal").classList.remove("hidden");
      });

      // Handle delete icon click
      goalDiv.querySelector(".delete-icon").addEventListener("click", () => {
          goalDiv.remove();
      });
  }

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
});
