const BOOK_ITEM_ID = "itemId";
const STORAGE_KEY = "BOOKSHELF_APPS";

function isStorageAvailable() {
  if (typeof Storage === "undefined") {
    alert("Browser tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageAvailable()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }
}

function loadData() {
  if (isStorageAvailable()) {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      books.push(...JSON.parse(data));
    }
    renderAllBooks();
  }
}

function generateId() {
  return +new Date();
}

function createBook(title, author, year, isComplete) {
  return {
    id: generateId(),
    title,
    author,
    year,
    isComplete,
  };
}

function addBook() {
  const inputBookTitle = document.getElementById("inputBookTitle");
  const inputBookAuthor = document.getElementById("inputBookAuthor");
  const inputBookYear = document.getElementById("inputBookYear");
  const inputBookIsComplete = document.getElementById("inputBookIsComplete");

  const book = createBook(
    inputBookTitle.value,
    inputBookAuthor.value,
    parseInt(inputBookYear.value),
    inputBookIsComplete.checked
  );
  books.push(book);

  renderAllBooks();
  saveData();
  resetInputForm();
}

function resetInputForm() {
  document.getElementById("inputBookTitle").value = "";
  document.getElementById("inputBookAuthor").value = "";
  document.getElementById("inputBookYear").value = "";
  document.getElementById("inputBookIsComplete").checked = false;
}

function findBookIndex(bookId) {
  return books.findIndex((book) => book.id === bookId);
}

function moveBook(bookId, isNewStatusComplete) {
  const bookIndex = findBookIndex(bookId);
  if (bookIndex !== -1) {
    books[bookIndex].isComplete = isNewStatusComplete;
    renderAllBooks();
    saveData();
  }
}

function deleteBook(bookId) {
  const bookIndex = findBookIndex(bookId);
  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    renderAllBooks();
    saveData();
  }
}

function searchBook(title) {
  return books.filter((book) =>
    book.title.toLowerCase().includes(title.toLowerCase())
  );
}

function renderBooks(books, isComplete) {
  const bookshelfList = isComplete
    ? completeBookshelfList
    : incompleteBookshelfList;
  bookshelfList.innerHTML = "";

  books.forEach((book) => {
    const bookItem = document.createElement("article");
    bookItem.classList.add("book_item");
    bookItem.setAttribute("id", `book-${book.id}`);

    bookItem.innerHTML = `
        <h3>${book.title}</h3>
        <p>Penulis: ${book.author}</p>
        <p>Tahun: ${book.year}</p>

        <div class="action">
            <button class="green" onclick="moveBook(${
              book.id
            }, ${!isComplete})">
                ${isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}
            </button>
            <button class="red" onclick="deleteBook(${
              book.id
            })">Hapus buku</button>
        </div>
    `;

    bookshelfList.appendChild(bookItem);
  });
}

function renderAllBooks() {
  const incompleteBooks = books.filter((book) => !book.isComplete);
  const completeBooks = books.filter((book) => book.isComplete);

  renderBooks(incompleteBooks, false);
  renderBooks(completeBooks, true);
}

function renderSearchResults(searchResults) {
  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  const incompleteSearchResults = searchResults.filter(
    (book) => !book.isComplete
  );
  const completeSearchResults = searchResults.filter((book) => book.isComplete);

  renderBooks(incompleteSearchResults, false);
  renderBooks(completeSearchResults, true);
}

const books = [];
const incompleteBookshelfList = document.getElementById(
  "incompleteBookshelfList"
);
const completeBookshelfList = document.getElementById("completeBookshelfList");
const inputBookForm = document.getElementById("inputBook");
const searchBookForm = document.getElementById("searchBook");

document.addEventListener("DOMContentLoaded", loadData);
inputBookForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addBook();
});

searchBookForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const searchTitle = document.getElementById("searchBookTitle").value;
  const searchResults = searchBook(searchTitle);
  renderSearchResults(searchResults);
});
