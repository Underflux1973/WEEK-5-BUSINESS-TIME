console.log(document);

const messageForm = document.getElementById("message-form");
const openPopupButton = document.getElementById("btn-open-popup");
const closePopupButton = document.getElementById("btn-close-popup");
const tabButtons = document.querySelectorAll(".tab-button");
const loadingIndicator = document.getElementById("loading");
let activeBoard = "chat";
const darkModeToggle = document.getElementById("darkMode");
const modeIcon = document.getElementById("modeIcon");
const foodContainer = document.getElementById("food-container");

// Function to toggle the message popup
function togglePopup() {
  const overlay = document.getElementById("popupOverlay");
  overlay.classList.toggle("show");
}

openPopupButton.addEventListener("click", togglePopup);
closePopupButton.addEventListener("click", togglePopup);

// Function to show loading indicator
function showLoadingIndicator() {
  loadingIndicator.style.display = "block"; // Show loading
}

// Function to hide loading indicator
function hideLoadingIndicator() {
  loadingIndicator.style.display = "none"; // Hide loading
}

messageForm.addEventListener("submit", handleSubmitButton);

// Tab switching logic
tabButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    foodContainer.innerHTML = "";
    document.querySelectorAll(".message-container").forEach((container) => {
      container.classList.remove("active");
    });
    document.querySelectorAll(".tab-button").forEach((btn) => {
      btn.classList.remove("active");
    });

    activeBoard = button.dataset.board; // Update active board
    document.getElementById(activeBoard).classList.add("active"); // Show selected board
    button.classList.add("active"); // Highlight clicked tab
    fetchData(activeBoard); // Fetch messages for the selected board

    // Check if the active board is 'health-and-wellness'
    if (activeBoard === "health-and-wellness") {
      // Fetch and display food image
      await addFoodToThePage();
    }
  });
});

// Function to add forum message to the page
function addForumMessageToPage(data, board) {
  const forumMessageElement = document.createElement("div");
  forumMessageElement.classList.add("forum-message");

  const date = new Date(data.timestamp);
  const formattedDate = date.toLocaleString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  forumMessageElement.innerHTML = `
        <p>
            Name: ${data.name} <br>
            Location: ${data.location} <br>
            Message: ${data.message_post} <br>
            Date: ${formattedDate} <br>
            Likes: <span class="like-count">${data.likes || 0}</span> <br>
        </p>
        <button class="likeButton" data-id="${data.id}">Like</button>
        <button class="deleteButton" data-id="${data.id}">Delete</button>
    `;
  document.getElementById(board).appendChild(forumMessageElement);

  // Event listeners for like and delete buttons
  forumMessageElement
    .querySelector(".likeButton")
    .addEventListener("click", () => handleLike(data.id, forumMessageElement));
  forumMessageElement
    .querySelector(".deleteButton")
    .addEventListener("click", () =>
      handleDelete(data.id, forumMessageElement)
    );
}

// Fetch data for the active board
async function fetchData(board) {
  showLoadingIndicator(); // Show loading indicator
  const response = await fetch(`http://localhost:8080/data?board=${board}`);
  const forumMessages = await response.json();
  forumMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  document.getElementById(board).innerHTML = ""; // Clear previous messages
  forumMessages.forEach((data) => {
    addForumMessageToPage(data, board);
  });
  hideLoadingIndicator(); // Hide loading indicator
}

async function handleSubmitButton(event) {
  event.preventDefault();
  const formData = new FormData(messageForm);
  const formValues = Object.fromEntries(formData);

  if (
    !formValues.name.trim() ||
    !formValues.location.trim() ||
    !formValues.message_post.trim()
  ) {
    showNotification("Please fill out all fields."); // Show notification for errors
    return;
  }

  formValues.board = activeBoard;

  try {
    const response = await fetch("http://localhost:8080/add-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    });
    const newMessage = await response.json();
    addForumMessageToPage(newMessage, activeBoard);
    messageForm.reset();
    togglePopup(); // Close the popup after submission
    showNotification("Message submitted successfully!"); // Notify user of success
  } catch (error) {
    console.error("Error submitting form:", error);
  }
}

async function handleLike(id, element) {
  const response = await fetch(`http://localhost:8080/data/${id}/like`, {
    method: "POST",
  });
  const updatedData = await response.json();
  element.querySelector(".like-count").textContent = updatedData.likes; // Update like count in the UI
}

async function handleDelete(id, element) {
  const confirmed = confirm("Are you sure you want to delete this post?");
  if (confirmed) {
    await fetch(`http://localhost:8080/data/${id}`, {
      method: "DELETE",
    });
    element.remove(); // Remove the message from the UI
    showNotification("Message deleted successfully!"); // Notify user of success
  }
}

// Notification function to show user feedback
function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.innerText = message;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.remove(); // Remove notification after 3 seconds
  }, 3000);
}

// Load the default board on startup
fetchData(activeBoard);

// Dark mode functionality
if (localStorage.getItem("dark-mode") === "enabled") {
  document.body.classList.add("dark-mode");
  modeIcon.classList.remove("fa-moon");
  modeIcon.classList.add("fa-sun");
}

// Toggle dark mode on button click
darkModeToggle.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");

  // Check if dark mode is enabled or not
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("dark-mode", "enabled");
    modeIcon.classList.remove("fa-moon");
    modeIcon.classList.add("fa-sun");
  } else {
    localStorage.removeItem("dark-mode");
    modeIcon.classList.remove("fa-sun");
    modeIcon.classList.add("fa-moon");
  }
});

// Fetch food data
async function getFood() {
  const response = await fetch("https://foodish-api.com/api/");
  const data = await response.json();
  const wrangledData = data.image;
  return wrangledData;
}

function createFood(foodUrl) {
  const foodImage = document.createElement("img");
  foodImage.src = foodUrl;
  foodImage.alt = "A random picture of food";
  foodContainer.appendChild(foodImage);
}

async function addFoodToThePage() {
  const foodUrl = await getFood();
  createFood(foodUrl);
}

// Load food when the health-and-wellness tab is activated
tabButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    if (button.dataset.board === "health-and-wellness") {
      await addFoodToThePage();
    }
  });
});

// Login functionality
const btnOpenLoginPopup = document.getElementById("btn-open-login-popup");
const btnCloseLoginPopup = document.getElementById("btn-close-login-popup");
const loginPopupOverlay = document.getElementById("login-popup-overlay");
const loginForm = document.getElementById("login-form");
const loginErrorMsgHolder = document.getElementById("login-error-msg-holder");
const createAccountButton = document.getElementById("create-account-button");
const registerHereButton = document.getElementById("register-here-button");
const createAccountSection = document.getElementById("create-account-section");

btnOpenLoginPopup.addEventListener("click", () => {
  loginPopupOverlay.style.display = "flex";
});

btnCloseLoginPopup.addEventListener("click", () => {
  loginPopupOverlay.style.display = "none";
  createAccountSection.style.display = "none";
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = document.getElementById("username-field").value;
  const password = document.getElementById("password-field").value;

  if (localStorage.getItem(username) === password) {
    alert("Login successful! Welcome, " + username + "!");
    loginPopupOverlay.style.display = "none";
  } else {
    loginErrorMsgHolder.style.display = "block";
  }
});

createAccountButton.addEventListener("click", () => {
  const newUsername = document.getElementById("new-username-field").value;
  const newPassword = document.getElementById("new-password-field").value;

  // Validation for username and password
  const usernameValid = newUsername.length >= 6;
  const passwordValid = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Za-z]).{1,}$/.test(
    newPassword
  );

  if (usernameValid && passwordValid) {
    localStorage.setItem(newUsername, newPassword);
    alert("Account created successfully! You can now log in.");
    document.getElementById("new-username-field").value = "";
    document.getElementById("new-password-field").value = "";
    createAccountSection.style.display = "none";
  } else {
    alert(
      "Username must be at least 6 characters long and password must contain at least one number and one special character."
    );
  }
});

registerHereButton.addEventListener("click", () => {
  createAccountSection.style.display = "block";
});
