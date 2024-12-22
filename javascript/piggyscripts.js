document.querySelectorAll(".action-button").forEach((button) => {
    button.addEventListener("click", () => {
      let question = "";
  
      switch (button.textContent.trim()) {
        case "Add to Piggy":
          question = "I want to add to my Piggy Bank";
          break;
        case "Set Saving Goal":
          question = "I want to set a saving goal";
          break;
      }
  
      localStorage.setItem("prefilledInput", question);
      window.location.href = "mainpage.html";
    });
  });
  
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
