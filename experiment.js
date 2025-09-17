// Array asli kita
const books = [
  {
    id: 1,
    title: "Harry Potter and the Sorcerer's Stone",
    author: 'J.K. Rowling',
  },
  { id: 2, title: 'The Lord of the Rings', author: 'J.R.R. Tolkien' },
  { id: 3, title: 'Dilan 1990', author: 'Pidi Baiq' },
  {
    id: 4,
    title: 'Harry Potter and the Chamber of Secrets',
    author: 'J.K. Rowling',
  },
];

// Kata kunci yang ingin kita cari
const searchTerm = 'potter';

// Menggunakan filter untuk mendapatkan semua buku yang mengandung 'potter'
const searchResults = books.filter((book) => {
  const bookTitle = book.title.toLowerCase();
  const searchKeyword = searchTerm.toLowerCase();

  return bookTitle.includes(searchKeyword);
});

// Menampilkan hasilnya
console.log(searchResults);

const name;
console.log(name);
