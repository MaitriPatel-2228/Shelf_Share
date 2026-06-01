import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {
    getDatabase,
    ref,
    push,
    onValue,
    remove
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-database.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";


// FIREBASE CONFIG
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
const auth = getAuth(app);
const loginModal = document.getElementById("loginModal");


// CLOUDINARY CONFIG
const CLOUDINARY_CLOUD_NAME = "dyqsjq9kl";
const CLOUDINARY_UPLOAD_PRESET = "bookshelf_preset";


// DOM ELEMENTS
const form = document.getElementById("bookForm");
const bookContainer = document.getElementById("bookContainer");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const userStatus = document.getElementById("userStatus");
const bookFormSection = document.querySelector(".form-section");


// CLOUDINARY UPLOAD
async function uploadToCloudinary(file) {

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
            method: "POST",
            body: formData
        }
    );

    if (!response.ok) {
        throw new Error("Cloudinary upload failed");
    }

    const data = await response.json();
    return data.secure_url;
}


// REMOVE CARD ANIMATION
function removeCard(card) {

    card.style.transition =
        "opacity 0.4s ease, transform 0.4s ease";

    card.style.opacity = "0";
    card.style.transform = "scale(0.95)";

    setTimeout(() => {
        card.remove();
    }, 400);
}


// SIGNUP
signupBtn.addEventListener("click", async () => {

    try {

        await createUserWithEmailAndPassword(
            auth,
            emailInput.value,
            passwordInput.value
        );

        alert("Account created successfully!");

    } catch (error) {

        alert(error.message);
    }
});


// LOGIN
loginBtn.addEventListener("click", async () => {

    try {

        await signInWithEmailAndPassword(
            auth,
            emailInput.value,
            passwordInput.value
        );

        alert("Login successful!");

    } catch (error) {

        alert(error.message);
    }
});


// LOGOUT
logoutBtn.addEventListener("click", async () => {

    try {

        await signOut(auth);

    } catch (error) {

        alert(error.message);
    }
});


// AUTH STATE


onAuthStateChanged(auth, (user) => {

    if (user) {

        userStatus.textContent = `Welcome ${user.email}`;

        logoutBtn.style.display = "inline-block";
        loginBtn.style.display = "none";
        signupBtn.style.display = "none";

        loginModal.style.display = "none";

        bookFormSection.style.display = "block";

    } else {

        userStatus.textContent = "Not Logged In";

        logoutBtn.style.display = "none";
        loginBtn.style.display = "inline-block";
        signupBtn.style.display = "inline-block";

        loginModal.style.display = "flex";

        bookFormSection.style.display = "none";
    }
});


// ADD BOOK
form.addEventListener("submit", async (e) => {

    e.preventDefault();

    if (!auth.currentUser) {

        alert("Please login first.");
        return;
    }

    const imageFile =
        document.getElementById("bookImage").files[0];

    if (!imageFile) {

        alert("Please select an image.");
        return;
    }

    const submitBtn =
        form.querySelector("button[type='submit']");

    submitBtn.disabled = true;
    submitBtn.textContent = "Uploading...";

    try {

        const imageURL =
            await uploadToCloudinary(imageFile);

        const book = {

            name:
                document.getElementById("bookName").value,

            author:
                document.getElementById("bookAuthor").value,

            image: imageURL,

            description:
                document.getElementById("bookDescription").value,

            experience:
                document.getElementById("bookExperience").value,

            userId: auth.currentUser.uid,
            userEmail: auth.currentUser.email
        };

        await push(ref(db, "books"), book);

        alert("Book Added Successfully!");

        form.reset();

    } catch (error) {

        console.error(error);

        alert(
            "Upload failed: " + error.message
        );

    } finally {

        submitBtn.disabled = false;
        submitBtn.textContent = "Add Book";
    }
});


// READ BOOKS
const renderedIds = new Set();

onValue(ref(db, "books"), (snapshot) => {

    const data = snapshot.val();

    bookContainer.querySelectorAll("[data-firebase='true']")
        .forEach(card => card.remove());

    renderedIds.clear();

    if (!data) return;

    for (let id in data) {

        const book = data[id];

        const card = document.createElement("div");

        card.classList.add("book-card");

        card.dataset.firebase = "true";

        card.setAttribute("data-id", id);

        card.innerHTML = `
            <h2>${book.name}</h2>

            <img src="${book.image}" alt="${book.name}">

            <div class="info">

                <h3>Author</h3>
                <p>${book.author}</p>

                <h3>Book Description</h3>
                <p>${book.description}</p>

                <h3>Reading Experience</h3>
                <p>${book.experience}</p>

            </div>
        `;

        if (
            auth.currentUser &&
            auth.currentUser.uid === book.userId
        ) {

            const deleteWrapper =
                document.createElement("div");

            deleteWrapper.style.cssText =
                "display:flex;justify-content:center;width:100%;padding:4px 0 12px;";

            const deleteBtn =
                document.createElement("button");

            deleteBtn.className = "delete-btn";

            deleteBtn.textContent = "🗑 Delete";

            deleteBtn.addEventListener(
                "click",
                async () => {

                    const confirmDelete =
                        confirm(
                            `Delete "${book.name}"?`
                        );

                    if (!confirmDelete) return;

                    try {

                        await remove(
                            ref(db, `books/${id}`)
                        );

                        removeCard(card);

                    } catch (error) {

                        alert(error.message);
                    }
                }
            );

            deleteWrapper.appendChild(deleteBtn);

            card.appendChild(deleteWrapper);
        }

        bookContainer.appendChild(card);

        renderedIds.add(id);
    }
});
