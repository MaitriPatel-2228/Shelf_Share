import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-database.js";


// -------------------- HARRY POTTER SLIDER --------------------

window.changeBook = function(num){

    const images = [
        "hp1.jpg",
        "hp2.jpg",
        "hp3.jpg",
        "hp4.jpg",
        "hp5.jpg",
        "hp6.jpg",
        "hp7.jpg"
    ];

    document.getElementById("harryImage").src = images[num - 1];
};


// -------------------- FIREBASE CONFIG --------------------

const firebaseConfig = {
  apiKey: "AIzaSyCzoXTsgRb4yETudtXTiHPs_6jsiI2uqzA",
  authDomain: "share-shelf-9409e.firebaseapp.com",
  databaseURL: "https://share-shelf-9409e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "share-shelf-9409e",
  storageBucket: "share-shelf-9409e.firebasestorage.app",
  messagingSenderId: "22317070456",
  appId: "1:22317070456:web:03e1253fdf4a64a4c7558d"
};


// -------------------- INITIALIZE FIREBASE --------------------

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);


// -------------------- FORM SUBMIT --------------------

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


// -------------------- DISPLAY FIREBASE BOOKS --------------------

const bookContainer = document.getElementById("bookContainer");

onValue(ref(db, "books"), (snapshot) => {

    const data = snapshot.val();

    if(!data) return;

    // Remove only previously generated Firebase cards
    const oldCards = document.querySelectorAll(".firebase-card");

    oldCards.forEach(card => card.remove());

    // Create cards
    for(let id in data){

        const book = data[id];

        const card = document.createElement("div");

        card.classList.add("book-card");
        card.classList.add("firebase-card");

        card.innerHTML = `
            <h2>${book.name}</h2>

            <img src="${book.image}" alt="${book.name}">

            <div class="info">

                <h3>Author</h3>
                <p>${book.author}</p>

                <h3>Description</h3>
                <p>${book.description}</p>

                <h3>Experience</h3>
                <p>${book.experience}</p>

            </div>
        `;

        bookContainer.appendChild(card);
    }

});
