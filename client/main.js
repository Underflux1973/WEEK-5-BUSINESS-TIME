console.log(document);

const messageForm = document.getElementById("message-form");
const messageContainer = document.getElementById("message-container");
const submitButton = document.getElementById("submitButton");
const openPopupButton = document.getElementById("btn-open-popup");
const closePopupButton = document.getElementById("btn-close-popup");

function togglePopup() {
  const overlay = document.getElementById("popupOverlay");
  overlay.classList.toggle("show");
}

openPopupButton.addEventListener("click", togglePopup);
closePopupButton.addEventListener("click", togglePopup);

messageForm.addEventListener("submit", handleSubmitButton);
console.log(handleSubmitButton);

function addForumMessageToPage(data) {
  const forumMessageElement = document.createElement("p");
  const date = data.date ? new Date(data.date) : new Date();
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
  name: ${data.name} <br> 
  location: ${data.location} <br>
  message_post: ${data.message_post} <br>
  date: ${formattedDate} <br>
<button class="likeButton" data-id="${data.id}">like</button>
<button class="deleteButton" data-id="${data.id}">Delete</button>`;
  messageContainer.appendChild(forumMessageElement);
}

async function fetchData() {
  const response = await fetch("http://localhost:8080/data");
  const forumMessage = await response.json();
  forumMessage.sort((a, b) => new Date(b.date) - new Date(a.date));
  messageContainer.innerHTML = "";
  forumMessage.forEach((data) => {
    addForumMessageToPage(data);
  });
}

async function handleSubmitButton(event) {
  event.preventDefault();
  const formData = new FormData(messageForm);
  const formValues = Object.fromEntries(formData);
  formValues.date = new Date().toISOString();
  console.log(formValues);

  const response = await fetch("http://localhost:8080/add-data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formValues),
  });
  const newMessage = await response.json();
  addForumMessageToPage(newMessage);
  messageForm.reset();
}

messageForm.addEventListener("submit", handleSubmitButton);
fetchData();

//async function handleDelete(enter the id here) {
// const confirmed = confirm("Are you sure you want to delete this post?");
//if (confirmed) {
//  await fetch(`http://localhost:8080/data/${enter id here}`, {
//   method: 'DELETE',
// });
// Remove the review element from the DOM
// reviewElement.remove();
// console.log(`Deleted message with id: ${enter correct id here}`);
//}
//}
// these are the listener for the DOM buttons we will create when fetching the data from the server
//(correct id)Element.querySelector(".like-button").addEventlistener('click', () => handleLike(id));
//(put correct id here)Element.querySelector(".delete-button").addEventlistener('click', () => handleDelete(id));
//these need to be added to the addForumMessageToPage function
//<button class="likeButton" data-id='${corrct id here}'>like</button>
//<button class="deleteButton" data-id="${review.id}">Delete</button>
