// Bookshelf App — Full JS (sesuai struktur HTML & data-testid)
const RENDER_EVENT = 'render-books';
const RENDER_SEARCH = 'render-search';
const BOOKS_KEY = 'BOOKS';

let searchResult = [];
let currentEditBookId = null;

if (typeof Storage !== 'undefined') {
  // ====== DOM refs (pastikan id ini ada di HTML) ======
  const editModal = document.getElementById('edit-modal');
  const editForm = document.getElementById('edit-form');
  const closeModalButton = document.getElementById('close-modal-button');
  const cancelButton = document.getElementById('cancel-button');

  const editTitleInput = document.getElementById('edit-title');
  const editAuthorInput = document.getElementById('edit-author');
  const editYear = document.getElementById('edit-year');

  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');

  // ====== Helpers ======
  function bookObject(id, title, author, year, isCompleted) {
    return { id, title, author, year, isCompleted };
  }

  function initBookStorage() {
    if (localStorage.getItem(BOOKS_KEY) === null) {
      localStorage.setItem(BOOKS_KEY, JSON.stringify([]));
    } else {
      document.dispatchEvent(new Event(RENDER_EVENT));
    }
  }

  function parseLocalStorage() {
    const raw = localStorage.getItem(BOOKS_KEY);
    try {
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveToStorage(data) {
    localStorage.setItem(BOOKS_KEY, JSON.stringify(data));
  }

  function generateID() {
    return new Date().getTime();
  }

  // ====== CRUD / Actions ======
  function addBook(id) {
    const inputTitle = document.getElementById('bookFormTitle').value.trim();
    const inputAuthor = document.getElementById('bookFormAuthor').value.trim();
    const inputYear = document.getElementById('bookFormYear').value.trim();
    const status = document.getElementById('bookFormIsComplete').checked;

    const newBook = bookObject(id, inputTitle, inputAuthor, inputYear, status);
    const books = parseLocalStorage();
    books.push(newBook);
    saveToStorage(books);

    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  function removeBooks(id) {
    const books = parseLocalStorage();
    const index = books.findIndex((e) => e.id === id);
    if (index !== -1) {
      books.splice(index, 1);
      saveToStorage(books);
      document.dispatchEvent(new Event(RENDER_EVENT));
    }
  }

  function selesaiBaca(id) {
    const books = parseLocalStorage();
    const index = books.findIndex((item) => item.id === id);
    if (index === -1) return;
    books[index].isCompleted = true;
    saveToStorage(books);
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  function belumSelesaiBaca(id) {
    const books = parseLocalStorage();
    const index = books.findIndex((item) => item.id === id);
    if (index === -1) return;
    books[index].isCompleted = false;
    saveToStorage(books);
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  function cariBuku(searchBookTitle) {
    const q = (searchBookTitle || '').toLowerCase();
    return parseLocalStorage().filter((item) =>
      String(item.title || '')
        .toLowerCase()
        .includes(q)
    );
  }

  // ====== Modal Edit ======
  function openModal(book) {
    if (!editModal) return;
    editModal.classList.remove('hidden');

    editTitleInput.value = book.title;
    editAuthorInput.value = book.author;
    editYear.value = book.year;
    currentEditBookId = book.id;

    closeModalButton?.addEventListener('click', closeModal, { once: true });
    cancelButton?.addEventListener('click', closeModal, { once: true });
  }

  function closeModal() {
    if (!editModal) return;
    editModal.classList.add('hidden');
  }

  function editDataBuku() {
    const books = parseLocalStorage();
    const index = books.findIndex((item) => item.id === currentEditBookId);
    if (index === -1) return;

    books[index].title = editTitleInput.value.trim();
    books[index].author = editAuthorInput.value.trim();
    books[index].year = editYear.value.trim();

    saveToStorage(books);
    document.dispatchEvent(new Event(RENDER_EVENT));
    closeModal();
  }

  // ====== Renderer (WAJIB sesuai struktur & data-testid) ======
  function displayBook(book) {
    // <div data-bookid="..." data-testid="bookItem">
    const bookContainer = document.createElement('div');
    bookContainer.setAttribute('data-bookid', String(book.id));
    bookContainer.setAttribute('data-testid', 'bookItem');

    // <h3 data-testid="bookItemTitle">Judul Buku</h3>
    const textTitle = document.createElement('h3');
    textTitle.setAttribute('data-testid', 'bookItemTitle');
    textTitle.innerText = book.title;

    // <p data-testid="bookItemAuthor">Penulis: ...</p>
    const textAuthor = document.createElement('p');
    textAuthor.setAttribute('data-testid', 'bookItemAuthor');
    textAuthor.innerText = `Penulis: ${book.author}`;

    // <p data-testid="bookItemYear">Tahun: ...</p>
    const textYear = document.createElement('p');
    textYear.setAttribute('data-testid', 'bookItemYear');
    textYear.innerText = `Tahun: ${book.year}`;

    // <div>...buttons...</div>
    const buttonContainer = document.createElement('div');

    // Toggle Complete / Not Complete -> pakai testid yang sama
    const btnToggleComplete = document.createElement('button');
    btnToggleComplete.setAttribute('data-testid', 'bookItemIsCompleteButton');
    if (!book.isCompleted) {
      btnToggleComplete.innerText = 'Selesai dibaca';
      btnToggleComplete.addEventListener('click', () => selesaiBaca(book.id));
    } else {
      btnToggleComplete.innerText = 'Belum Selesai dibaca';
      btnToggleComplete.addEventListener('click', () =>
        belumSelesaiBaca(book.id)
      );
    }

    // Delete
    const btnDelete = document.createElement('button');
    btnDelete.setAttribute('data-testid', 'bookItemDeleteButton');
    btnDelete.innerText = 'Hapus Buku';
    btnDelete.addEventListener('click', () => removeBooks(book.id));

    // Edit
    const btnEdit = document.createElement('button');
    btnEdit.setAttribute('data-testid', 'bookItemEditButton');
    btnEdit.innerText = 'Edit Buku';
    btnEdit.addEventListener('click', () => openModal(book));

    buttonContainer.append(btnToggleComplete, btnEdit, btnDelete);

    // Urutan PERSIS: h3, p(author), p(year), div(buttons)
    bookContainer.append(textTitle, textAuthor, textYear, buttonContainer);

    return bookContainer;
  }

  // ====== Event: RENDER_EVENT -> render semua buku ======
  document.addEventListener(RENDER_EVENT, () => {
    const books = parseLocalStorage();

    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';

    for (const bookItem of books) {
      const elm = displayBook(bookItem);
      if (bookItem.isCompleted) {
        completeBookList.append(elm);
      } else {
        incompleteBookList.append(elm);
      }
    }
  });

  // ====== Event: RENDER_SEARCH -> render hasil pencarian ======
  document.addEventListener(RENDER_SEARCH, () => {
    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';

    for (const bookItem of searchResult) {
      const elm = displayBook(bookItem);
      if (bookItem.isCompleted) {
        completeBookList.append(elm);
      } else {
        incompleteBookList.append(elm);
      }
    }
  });

  // ====== Boot ======
  document.addEventListener('DOMContentLoaded', () => {
    initBookStorage();

    const bookForm = document.getElementById('bookForm');
    bookForm?.addEventListener('submit', (event) => {
      event.preventDefault();
      addBook(generateID());
      bookForm.reset();
    });

    const searchBook = document.getElementById('searchBook');
    searchBook?.addEventListener('submit', (event) => {
      event.preventDefault();
      const searchBookTitle = document.getElementById('searchBookTitle').value;
      searchResult = cariBuku(searchBookTitle);
      document.dispatchEvent(new Event(RENDER_SEARCH));
    });

    editForm?.addEventListener('submit', (event) => {
      event.preventDefault();
      editDataBuku();
    });
  });
} else {
  alert('Browser yang anda gunakan tidak mendukung Web Storage');
}
