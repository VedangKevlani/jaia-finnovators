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
            <span class="star-icon" data-description="${description}">
                ★
            </span>
            ${description} for ${formattedCost} by ${timeline}
            <span class="edit-icon" data-description="${description}" data-cost="${cost}" data-timeline="${timeline}">
                ✎
            </span>
            <span class="delete-icon" data-description="${description}">
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
    // Handle star icon click
    goalDiv.querySelector(".star-icon").addEventListener("click", (event) => {
        const description = event.target.getAttribute("data-description");
        localStorage.setItem("prefilledInput", `What is the progress on my goal to ${description}?`);
        redirectToMainPageWithPrefilledInput();
    });

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
            // Update goal data
            event.target.setAttribute("data-description", document.getElementById("goal-description").value);
            event.target.setAttribute("data-cost", document.getElementById("goal-cost").value);
            event.target.setAttribute("data-timeline", document.getElementById("goal-timeline").value);

            goalDiv.innerHTML = `
                <span class="star-icon" data-description="${document.getElementById("goal-description").value}">
                    ★
                </span>
                ${document.getElementById("goal-description").value} for ${parseFloat(document.getElementById("goal-cost").value).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
            })} by ${document.getElementById("goal-timeline").value}
                <span class="edit-icon" data-description="${document.getElementById("goal-description").value}" 
                    data-cost="${document.getElementById("goal-cost").value}" 
                    data-timeline="${document.getElementById("goal-timeline").value}">
                    ✎
                </span>
                <span class="delete-icon" data-description="${document.getElementById("goal-description").value}">
                    🗑
                </span>
            `;

            addGoalEventListeners(goalDiv);

            // Hide modal
            document.getElementById("goal-modal").classList.add("hidden");
        };
    });

    // Handle delete icon click
    goalDiv.querySelector(".delete-icon").addEventListener("click", (event) => {
        const description = event.target.getAttribute("data-description");
        localStorage.setItem("prefilledInput", `Delete my goal to ${description}.`);
        redirectToMainPageWithPrefilledInput();
    });
}

// Redirect to main page and clear prefilled input
function redirectToMainPageWithPrefilledInput() {
    // Redirect to main page
    window.location.href = "mainpage.html";

    // Clear the prefilled input after use
    setTimeout(() => {
        localStorage.removeItem("prefilledInput");
        const inputBar = document.querySelector(".input-bar");
        if (inputBar) inputBar.value = "";
        console.log("Prefilled input cleared from localStorage and input field.");
    }, 1000); // Delay to ensure redirection occurs
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

document.getElementById("progress-goal-btn").addEventListener("click", () => {
    localStorage.setItem("prefilledInput", "Show me the progress of all my goals.");
    redirectToMainPageWithPrefilledInput();
});
