import "./style.css";
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

function handleSubmitButton(event) {
  event.preventDefault();
  const formData = new FormData(messageForm);
  const formValues = Object.fromEntries(formData);
  console.log(formValues);
}
fetch("http://localhost:8080/data", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ formValues }),
});
messageForm.addEventListener("submit", handleSubmitButton);
console.log(handleSubmitButton);

// from database to dom
// async function getData() {
//   const response = await fetch("http://localhost:8080/data");
//   console.log("HTTP Response:", response);
//   const json = await response.json();
//   console.log("JSON Data:", json);
//   return json;
// }

// async function createData() {
//   const data = await getData();
//   data.forEach((feedback) => {
//     const h1 = document.createElement("h1");
//     h1.textContent = feedback.name;
//     feedbackContainer.appendChild(h1);

//     const h2 = document.createElement("h2");
//     h2.textContent = feedback.date_visited;
//     feedbackContainer.appendChild(h2);

//     const h3 = document.createElement("h3");
//     h3.textContent = feedback.device_used;
//     feedbackContainer.appendChild(h3);

//     const p = document.createElement("p");
//     p.textContent = feedback.comments;
//     feedbackContainer.appendChild(p);
//   });
// }

// createData();

async function fetchReviews() {
  const response = await fetch(`${renderURL}data`);
  // "http://localhost:8080/data"
  const reviews = await response.json();
  reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
  reviewContainer.innerHTML = "";
  reviews.forEach((review) => {
    addReviewToPage(review);
  });
}

function addReviewToPage(review) {
  const reviewElement = document.createElement("p");
  const date = new Date(review.date);
  const formattedDate = date.toLocaleString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  reviewElement.innerHTML = `
  name: ${review.name} <br> 
  date: ${formattedDate} <br>
  review: ${review.review} <br>
  star: ${review.star} <br>
  `;
  reviewContainer.appendChild(reviewElement);
}
