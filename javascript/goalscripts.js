document.addEventListener("DOMContentLoaded", () => {
    // Open and Close Goal Modal
    document.getElementById("set-goal-btn").addEventListener("click", () => {
        document.getElementById("goal-modal").classList.remove("hidden");
    });

    document.getElementById("cancel-goal-btn").addEventListener("click", () => {
        document.getElementById("goal-modal").classList.add("hidden");
    });

    document.getElementById("confirm-goal-btn").addEventListener("click", () => {
        const description = document.getElementById("goal-description").value;
        const cost = document.getElementById("goal-cost").value;
        const timeline = document.getElementById("goal-timeline").value;

        if (description && cost && timeline) {
            // Format cost as monetary value
            const formattedCost = parseFloat(cost).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
            });

            const goalContainer = document.getElementById("goals-container");
            const goalDiv = document.createElement("div");
            goalDiv.className = "goal-rectangle";

            // Add goal with star, edit, and delete icons
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

            // Add event listeners for the new icons
            addGoalEventListeners(goalDiv);

            // Reset and hide modal
            document.getElementById("goal-description").value = "";
            document.getElementById("goal-cost").value = "";
            document.getElementById("goal-timeline").value = "";
            document.getElementById("goal-modal").classList.add("hidden");
        } else {
            alert("Please fill in all fields.");
        }
    });

    // Add event listeners for dynamically added goals
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

            // Show the modal for editing
            document.getElementById("goal-modal").classList.remove("hidden");

            // Handle save changes
            document.getElementById("confirm-goal-btn").onclick = () => {
                const updatedDescription = document.getElementById("goal-description").value;
                const updatedCost = document.getElementById("goal-cost").value;
                const updatedTimeline = document.getElementById("goal-timeline").value;

                if (updatedDescription && updatedCost && updatedTimeline) {
                    // Update goal data
                    event.target.setAttribute("data-description", updatedDescription);
                    event.target.setAttribute("data-cost", updatedCost);
                    event.target.setAttribute("data-timeline", updatedTimeline);

                    goalDiv.innerHTML = `
                        <span class="star-icon">
                            ★
                        </span>
                        ${updatedDescription} for ${parseFloat(updatedCost).toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                            minimumFractionDigits: 2,
                        })} by ${updatedTimeline}
                        <span class="edit-icon" data-description="${updatedDescription}" 
                            data-cost="${updatedCost}" 
                            data-timeline="${updatedTimeline}">
                            ✎
                        </span>
                        <span class="delete-icon">
                            🗑
                        </span>
                    `;

                    addGoalEventListeners(goalDiv);

                    // Hide modal
                    document.getElementById("goal-modal").classList.add("hidden");
                } else {
                    alert("Please fill in all fields.");
                }
            };
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
