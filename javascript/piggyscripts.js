document.addEventListener("DOMContentLoaded", () => {
  // Open and Close Goal Modal
  document.getElementById("set-goal-btn").addEventListener("click", () => {
      document.getElementById("goal-modal").classList.remove("hidden");
  });

  document.getElementById("cancel-goal-btn").addEventListener("click", () => {
      document.getElementById("goal-modal").classList.add("hidden");
      resetGoalModal();
  });

  document.getElementById("confirm-goal-btn").addEventListener("click", () => {
      const description = document.getElementById("goal-description").value;
      const cost = document.getElementById("goal-cost").value;
      const timeline = document.getElementById("goal-timeline").value;

      if (description && cost && timeline) {
          addOrUpdateGoal(description, cost, timeline);
          resetGoalModal();
          document.getElementById("goal-modal").classList.add("hidden");
      } else {
          alert("Please fill in all fields.");
      }
  });

  function resetGoalModal() {
      document.getElementById("goal-description").value = "";
      document.getElementById("goal-cost").value = "";
      document.getElementById("goal-timeline").value = "";
      document.getElementById("confirm-goal-btn").dataset.editing = "";
  }

  function addOrUpdateGoal(description, cost, timeline) {
      const formattedCost = parseFloat(cost).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
      });

      const goalContainer = document.getElementById("goals-container");
      const editing = document.getElementById("confirm-goal-btn").dataset.editing;

      if (editing) {
          // Update existing goal
          const goalDiv = document.querySelector(`[data-id="${editing}"]`);
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

          addGoalEventListeners(goalDiv);
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
