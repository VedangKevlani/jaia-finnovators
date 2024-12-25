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
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        userId = user.uid;
        console.log("User is logged in:", user.email);
  
        // Load existing goals and display random tip
        await loadGoals();
        displayRandomTip();
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
          addGoalEventListeners(goalDiv, goalId);
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
        // Create the goal object
        const goal = {
          description,
          cost: parseFloat(cost), // Store cost as a number (not a string)
          deadline: new Date(timeline),
        };
  
        // Save goal to Firebase
        try {
          const goalsRef = collection(db, "users", userId, "goalData");
          const docRef = await addDoc(goalsRef, goal);
          console.log("Goal saved successfully with ID:", docRef.id);
  
          // Reload goals
          await loadGoals();
  
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
    function addGoalEventListeners(goalDiv, goalId) {
      // Handle edit icon click
      goalDiv.querySelector(".edit-icon").addEventListener("click", async () => {
        const goalRef = doc(db, "users", userId, "goalData", goalId);
        const goalSnapshot = await getDoc(goalRef);
        const goal = goalSnapshot.data();
  
        // Populate the modal with existing goal data
        document.getElementById("goal-description").value = goal.description;
        document.getElementById("goal-cost").value = goal.cost;
        document.getElementById("goal-timeline").value = new Date(goal.deadline.toDate())
          .toISOString()
          .split("T")[0];
  
        // Show the modal for editing
        document.getElementById("goal-modal").classList.remove("hidden");
  
        // Handle save changes
        document.getElementById("confirm-goal-btn").onclick = async () => {
          const updatedDescription = document.getElementById("goal-description").value;
          const updatedCost = parseFloat(document.getElementById("goal-cost").value);
          const updatedTimeline = new Date(document.getElementById("goal-timeline").value);
  
          if (updatedDescription && updatedCost && updatedTimeline) {
            // Update goal data in Firebase
            await updateDoc(goalRef, {
              description: updatedDescription,
              cost: updatedCost,
              deadline: updatedTimeline,
            });
  
            // Reload goals
            await loadGoals();
  
            // Hide modal
            document.getElementById("goal-modal").classList.add("hidden");
          } else {
            alert("Please fill in all fields.");
          }
        };
      });
  
      // Handle delete icon click
      goalDiv.querySelector(".delete-icon").addEventListener("click", async () => {
        if (confirm("Are you sure you want to delete this goal?")) {
          const goalRef = doc(db, "users", userId, "goalData", goalId);
          await deleteDoc(goalRef);
          await loadGoals();
        }
      });
    }
  
    // Random Goal Tip of the Day
    const goalTips = [
      "Setting clear and achievable goals helps you stay focused and motivated. Write down your goals and break them into actionable steps to track progress.",
      "Review your financial goals regularly to stay on track. Adjust timelines or savings amounts if needed, but keep your eyes on the prize.",
      "Big goals are daunting, but dividing them into smaller milestones makes them more manageable. Celebrate each small win along the way to maintain motivation.",
      "Automate savings for your financial goals whenever possible. It ensures you stay consistent and helps you avoid unnecessary spending.",
      "Every goal requires a deadline. A clear timeline keeps you accountable and helps you measure progress effectively. Start now and don't delay your dreams.",
      "Investing in your goals now pays dividends later. Prioritize them and allocate resources wisely to ensure long-term success.",
      "Your goals are unique, just like you. Customize your savings and spending plans to reflect your priorities and values.",
    ];
  
    function displayRandomTip() {
      const randomIndex = Math.floor(Math.random() * goalTips.length);
      const tipContainer = document.getElementById("tips-container");
      tipContainer.textContent = goalTips[randomIndex];
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
  