import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
  } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
  import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
  import { db } from "./firebaseconf.js"; // Ensure this is correctly initialized with your Firebase config
  
  document.addEventListener("DOMContentLoaded", () => {
    const auth = getAuth(); // Initialize Firebase Authentication
    let userId = null;
  
    // Monitor authentication state
    onAuthStateChanged(auth, (user) => {
        if (user) {
            userId = user.uid;
            console.log("User is logged in:", user.email);
  
            // Load existing goals from Firebase
            loadGoals();
        } else {
            alert("User is not logged in.");
            window.location.href = "index.html"; // Redirect to login page
        }
    });
  
    // Function to load goals from Firebase
    async function loadGoals() {
        try {
            const goalsRef = collection(db, "users", userId, "goalData");
            const querySnapshot = await getDocs(goalsRef);
  
            const goalContainer = document.getElementById("goals-container");
            goalContainer.innerHTML = ""; // Clear existing goals in the UI
  
            querySnapshot.forEach((doc) => {
                const goal = doc.data();
                const goalId = doc.id;
  
                // Create a goal card
                const goalDiv = document.createElement("div");
                goalDiv.className = "goal-rectangle";
                goalDiv.innerHTML = `
                    <span class="star-icon">★</span>
                    ${goal.description} for ${goal.cost.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 2,
                    })} by ${new Date(goal.deadline.toDate()).toLocaleDateString()}
                    <span class="edit-icon" data-id="${goalId}" data-description="${goal.description}" data-cost="${goal.cost}" data-timeline="${goal.deadline.toDate()}">✎</span>
                    <span class="delete-icon" data-id="${goalId}">🗑</span>
                `;
  
                // Append goal to the container
                goalContainer.appendChild(goalDiv);
  
                // Add event listeners for the new icons
                addGoalEventListeners(goalDiv, userId);
            });
        } catch (error) {
            console.error("Error loading goals from Firebase:", error);
        }
    }
  
    // Open and Close Goal Modal
    document.getElementById("set-goal-btn").addEventListener("click", () => {
        document.getElementById("goal-modal").classList.remove("hidden");
    });
  
    document.getElementById("cancel-goal-btn").addEventListener("click", () => {
        document.getElementById("goal-modal").classList.add("hidden");
    });
  
    // Add event listener to confirm-goal-btn
    document.getElementById("confirm-goal-btn").addEventListener("click", async () => {
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
  
            // Create the goal object
            const goal = {
                description,
                cost: parseFloat(cost), // Store cost as a number (not a string)
                deadline: new Date(timeline),
                progress: 0,
            };
  
            // Save goal to Firebase
            try {
                const goalsRef = collection(db, "users", userId, "goalData");
                const docRef = await addDoc(goalsRef, goal);
                console.log("Goal saved successfully with ID:", docRef.id);
  
                // Add the new goal to the UI
                const goalContainer = document.getElementById("goals-container");
                const goalDiv = document.createElement("div");
                goalDiv.className = "goal-rectangle";
  
                // Add goal with star, edit, and delete icons
                goalDiv.innerHTML = `
                    <span class="star-icon">★</span>
                    ${description} for ${formattedCost} by ${new Date(goal.deadline).toLocaleDateString()}
                    <span class="edit-icon" data-id="${docRef.id}" data-description="${description}" data-cost="${cost}" data-timeline="${timeline}">✎</span>
                    <span class="delete-icon" data-id="${docRef.id}">🗑</span>
                `;
                goalContainer.appendChild(goalDiv);
  
                // Add event listeners for the new icons
                addGoalEventListeners(goalDiv, userId);
  
                // Reset and hide modal
                document.getElementById("goal-description").value = "";
                document.getElementById("goal-cost").value = "";
                document.getElementById("goal-timeline").value = "";
                document.getElementById("goal-modal").classList.add("hidden");
            } catch (error) {
                console.error("Error saving goal to Firebase:", error);
                alert("Failed to save the goal. Please try again.");
            }
        } else {
            alert("Please fill in all fields.");
        }
    });
  
    // Add event listeners for dynamically added goals
    function addGoalEventListeners(goalDiv, userId) {
        // Handle edit icon click
        goalDiv.querySelector(".edit-icon").addEventListener("click", async (event) => {
            const goalId = event.target.getAttribute("data-id");
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
            document.getElementById("confirm-goal-btn").onclick = async () => {
                const updatedDescription = document.getElementById("goal-description").value;
                const updatedCost = document.getElementById("goal-cost").value;
                const updatedTimeline = document.getElementById("goal-timeline").value;
  
                if (updatedDescription && updatedCost && updatedTimeline) {
                    // Update goal data in Firebase
                    const goalRef = doc(db, "users", userId, "goalData", goalId);
                    await updateDoc(goalRef, {
                        description: updatedDescription,
                        cost: parseFloat(updatedCost),
                        deadline: new Date(updatedTimeline),
                    });
  
                    // Update the goal on the UI
                    goalDiv.innerHTML = `
                        <span class="star-icon">★</span>
                        ${updatedDescription} for ${parseFloat(updatedCost).toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                            minimumFractionDigits: 2,
                        })} by ${new Date(updatedTimeline).toLocaleDateString()}
                        <span class="edit-icon" data-id="${goalId}" data-description="${updatedDescription}" data-cost="${updatedCost}" data-timeline="${updatedTimeline}">✎</span>
                        <span class="delete-icon" data-id="${goalId}">🗑</span>
                    `;
  
                    addGoalEventListeners(goalDiv, userId);
  
                    // Hide modal
                    document.getElementById("goal-modal").classList.add("hidden");
                } else {
                    alert("Please fill in all fields.");
                }
            };
        });
  
        // Handle delete icon click
        goalDiv.querySelector(".delete-icon").addEventListener("click", async (event) => {
            const goalId = event.target.getAttribute("data-id");
  
            // Delete the goal from Firebase
            const goalRef = doc(db, "users", userId, "goalData", goalId);
            await deleteDoc(goalRef);
            goalDiv.remove();
        });
    }
  
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
  