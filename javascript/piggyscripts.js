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
        updateBalance(currentBalance - dipAmount);
        closeModal(dipPiggyModal);
      }
    } else {
      alert("Please enter a valid amount.");
    }
  });

  cancelDipPiggyBtn?.addEventListener("click", () => closeModal(dipPiggyModal));

  // Empty Piggy
  emptyPiggyBtn?.addEventListener("click", () => {
    if (confirm("Are you sure you want to empty the piggy bank?")) {
      updateBalance(0);
    }
  });

  // Initialize Balance
  updateBalance(getCurrentBalance());
});
