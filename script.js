import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-database.js";

// ─── Firebase Setup ──────────────────────────────────────────────────────────
const firebaseConfig = {
    apiKey: "AIzaSyCzoXTsgRb4yETudtXTiHPs_6jsiI2uqzA",
    authDomain: "share-shelf-9409e.firebaseapp.com",
    databaseURL: "https://share-shelf-9409e-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "share-shelf-9409e",
    storageBucket: "share-shelf-9409e.firebasestorage.app",
    messagingSenderId: "22317070456",
    appId: "1:22317070456:web:03e1253fdf4a64a4c7558d"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ─── Animate card out then remove from DOM ───────────────────────────────────
function removeCard(card) {
    card.style.transition = "opacity 0.4s ease, transform 0.4s ease";
    card.style.opacity = "0";
    card.style.transform = "scale(0.95)";
    setTimeout(() => card.remove(), 400);
}

// ─── Form Submission ─────────────────────────────────────────────────────────
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
    await push(ref(db, "books"), book);
    alert("Book Added Successfully!");
    form.reset();
});

// ─── Read & Render Firebase Books ────────────────────────────────────────────
const bookContainer = document.getElementById("bookContainer");
const renderedIds = new Set();

onValue(ref(db, "books"), (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    for (let id in data) {
        if (renderedIds.has(id)) continue;

        const book = data[id];
        const card = document.createElement("div");
        card.classList.add("book-card");
        card.setAttribute("data-id", id);

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

        // Delete button — only on Firebase cards
        const deleteWrapper = document.createElement("div");
        deleteWrapper.style.cssText = "display:flex; justify-content:center; width:100%; padding:4px 0 12px;";

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "🗑 Delete";
        deleteBtn.style.cssText = "display:inline-block; width:auto; padding:8px 20px; background:transparent; color:#e05555; border:1.5px solid #e05555; border-radius:8px; font-size:13px; font-weight:normal; cursor:pointer;";
        deleteBtn.addEventListener("click", async () => {
            if (confirm(`Delete "${book.name}"?`)) {
                await remove(ref(db, `books/${id}`));
                renderedIds.delete(id);
                removeCard(card);
            }
        });

        deleteWrapper.appendChild(deleteBtn);
        card.appendChild(deleteWrapper);
        bookContainer.appendChild(card);
        renderedIds.add(id);
    }
});
