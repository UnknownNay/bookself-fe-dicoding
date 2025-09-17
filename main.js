const RENDER_EVENT = 'render-books';
const BOOKS_KEY = 'BOOKS';
const RENDER_SEARCH = 'render-search';
let searchResult = [];
let currentEditBookId = null;

if (typeof Storage !== 'undefined') {
  const editModal = document.getElementById('edit-modal');
  const editForm = document.getElementById('edit-form');
  const closeModalButton = document.getElementById('close-modal-button');
  const cancelButton = document.getElementById('cancel-button');
  const incompleteBookList = document.getElementById('incompleteBookList');

  const editTitleInput = document.getElementById('edit-title');
  const editAuthorInput = document.getElementById('edit-author');
  const editYear = document.getElementById('edit-year');

  function bookObject(id, title, author, year, isCompleted) {
    return {
      id,
      title,
      author,
      year,
      isCompleted,
    };
  }

  function initBookStorage() {
    if (localStorage.getItem(BOOKS_KEY) === null) {
      const arr = [];
      localStorage.setItem(BOOKS_KEY, JSON.stringify(arr));
    } else {
      document.dispatchEvent(new Event(RENDER_EVENT));
    }
  }

  function parseLocalStorage() {
    return JSON.parse(localStorage.getItem('BOOKS'));
  }

  function belumSelesaiBaca(id) {
    const bookData = parseLocalStorage();

    const index = bookData.findIndex((item) => item.id === id);
    bookData[index].isCompleted = false;

    localStorage.setItem(BOOKS_KEY, JSON.stringify(bookData));
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  function selesaiBaca(id) {
    const bookData = parseLocalStorage();

    const index = bookData.findIndex((item) => item.id === id);
    bookData[index].isCompleted = true;

    localStorage.setItem(BOOKS_KEY, JSON.stringify(bookData));
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  document.addEventListener(RENDER_SEARCH, () => {
    console.log(searchResult);
    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';
    for (const bookItem of searchResult) {
      const bookElement = displayBook(bookItem);
      const { isCompleted } = bookItem;
      if (!isCompleted) {
        incompleteBookList.append(bookElement);
      } else {
        completeBookList.append(bookElement);
      }
    }
  });

  function cariBuku(searchBookTitle) {
    let id = 0;
    const bookData = parseLocalStorage();
    const searchResult = bookData.filter((item) => {
      const bookTitle = item.title.toLowerCase();
      searchBookTitle = searchBookTitle.toLowerCase();

      return bookTitle.includes(searchBookTitle);
    });

    return searchResult;
  }

  function openModal(book) {
    editModal.classList.remove('hidden');
    // Isi form edit dengan data buku
    editTitleInput.value = book.title;
    editAuthorInput.value = book.author;
    editYear.value = book.year;
    currentEditBookId = book.id;
    // Event listener untuk tombol close modal
    closeModalButton.addEventListener('click', closeModal);
    cancelButton.addEventListener('click', closeModal);
  }

  function closeModal() {
    editModal.classList.add('hidden');
  }

  document.addEventListener(RENDER_EVENT, () => {
    const bookParse = parseLocalStorage();
    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';

    for (const bookItem of bookParse) {
      const bookElement = displayBook(bookItem);
      const { isCompleted } = bookItem;
      if (!isCompleted) {
        incompleteBookList.append(bookElement);
      } else {
        completeBookList.append(bookElement);
      }
    }
    console.log('Data berhasil ditampilkan');
  });

  function editDataBuku() {
    const bookData = parseLocalStorage();
    const index = bookData.findIndex((item) => item.id === currentEditBookId);
    if (index !== -1) {
      bookData[index].title = editTitleInput.value;
      bookData[index].author = editAuthorInput.value;
      bookData[index].year = editYear.value;
      localStorage.setItem(BOOKS_KEY, JSON.stringify(bookData));
      document.dispatchEvent(new Event(RENDER_EVENT));
      closeModal();
      console.log('Data buku berhasil diedit');
    }
  }

  function removeBooks(id) {
    const book = parseLocalStorage();
    const index = book.findIndex((e) => e.id === id);

    if (index !== -1) {
      book.splice(index, 1);
      console.log(book);
      console.log(`Buku berhasil dihapus`);
    }
    localStorage.setItem(BOOKS_KEY, JSON.stringify(book));
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  function displayBook(bookObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = `Penulis: ${bookObject.author}`;

    const textYear = document.createElement('p');
    textYear.innerText = `Tahun: ${bookObject.year}`;

    const btnDelete = document.createElement('button');
    btnDelete.innerText = 'Hapus Buku';
    btnDelete.classList.add('delete-btn');
    btnDelete.addEventListener('click', () => {
      removeBooks(bookObject.id);
    });

    const btnEdit = document.createElement('button');
    btnEdit.innerText = 'Edit Buku';
    btnEdit.addEventListener('click', () => {
      openModal(bookObject);
    });

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('btn-container');
    if (!bookObject.isCompleted) {
      const btnCompleted = document.createElement('button');
      btnCompleted.innerText = 'Selesai dibaca';
      btnCompleted.addEventListener('click', () => {
        selesaiBaca(bookObject.id);
      });
      buttonContainer.append(btnCompleted, btnDelete, btnEdit);
    } else {
      const btnNotCompleted = document.createElement('button');
      btnNotCompleted.innerText = 'Belum Selesai dibaca';
      btnNotCompleted.addEventListener('click', () => {
        belumSelesaiBaca(bookObject.id);
      });
      buttonContainer.append(btnNotCompleted, btnEdit, btnDelete);
    }

    const bookContainer = document.createElement('div');
    bookContainer.classList.add('book-item');
    bookContainer.setAttribute('id', `book-${bookObject.id}`);
    bookContainer.append(textTitle, textAuthor, textYear, buttonContainer);

    return bookContainer;
  }

  function addBook(id) {
    const inputTitle = document.getElementById('bookFormTitle').value;
    const inputAuthor = document.getElementById('bookFormAuthor').value;
    const inputYear = document.getElementById('bookFormYear').value;
    const status = document.getElementById('bookFormIsComplete').checked;
    console.log(status);
    const newBook = bookObject(id, inputTitle, inputAuthor, inputYear, status);
    const book = parseLocalStorage();
    book.push(newBook);
    localStorage.setItem('BOOKS', JSON.stringify(book));
    if (JSON.parse(localStorage.getItem('BOOKS')).length > 0) {
      console.log('Data berhasil ditambahkan');
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  function generateID() {
    return new Date().getTime();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initBookStorage();
    const completeBookList = document.getElementById('completeBookList');
    const bookForm = document.getElementById('bookForm');
    bookForm.addEventListener('submit', () => {
      event.preventDefault();
      addBook(generateID());
    });

    const searchBook = document.getElementById('searchBook');
    searchBook.addEventListener('submit', () => {
      const searchBookTitle = document.getElementById('searchBookTitle').value;
      event.preventDefault();
      searchResult = cariBuku(searchBookTitle);
      document.dispatchEvent(new Event(RENDER_SEARCH));
    });

    editForm.addEventListener('submit', (event) => {
      event.preventDefault();
      editDataBuku();
    });
  });
} else {
  alert('Browser yang anda gunakan tidak mendukung Web Storage');
}
