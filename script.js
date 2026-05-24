
function changeBook(num){
    const images = [
        "hp1.jpg",
        "hp2.jpg",
        "hp3.jpg",
        "hp4.jpg",
        "hp5.jpg",
        "hp6.jpg",
        "hp7.jpg"
    ];

    document.getElementById("bookImage").src = images[num - 1];

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

// Form
const form = document.getElementById("bookForm");

form.addEventListener("submit", async function(e) {

  e.preventDefault();

  const book = {

    name: document.getElementById("bookName").value,

    author: document.getElementById("bookAuthor").value,

    image: document.getElementById("bookImage").value,

    description: document.getElementById("bookDescription").value,

    experience: document.getElementById("bookExperience").value
  };

  // Save to Firebase
  await push(ref(db, "books"), book);

  alert("Book Added Successfully!");

  form.reset();

});
}
