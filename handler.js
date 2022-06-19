const { nanoid } = require('nanoid');
const books = require('./books');

// API dapat menyimpan buku
const HandlerSimpanBuku = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload; // menyimpan data books dalam bentuk json melalui body request

  // jika nama kosong maka kembalikan handler dengan respons gagal
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);

    return response;
  }
  // Jika readPage lebih besar dari pageCount maka kembalikan handler dengan respons gagal
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);

    return response;
  }

  const id = nanoid(16); // id acak dengan panjang 16
  const finished = (pageCount === readPage);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);// memasukan nilai kedalam array
  // Jika bernilai true, maka beri respons berhasil. Jika false, maka beri respons gagal.
  const isSave = books.filter((book) => book.id === id).length > 0;

  // jika buku berhasil dimasukkan maka kembalikan handler dengan respons sukses
  if (isSave) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);

    return response;
  }
  // jika buku gagal di tambahkan maka kembalikan handler dengan respons gagal
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);

  return response;
};

// API dapat menampilkan seluruh buku
const HandlerTampilSemuaBuku = (request, h) => {
  let filterBuku = books;
  const { name, reading, finished } = request.query;

  // menampilkan nama
  if (name !== undefined) {
    filterBuku = filterBuku.filter((buku) => buku.name.toLowerCase().includes(name.toLowerCase()));
  }
  // buku sedang di baca
  if (reading !== undefined) {
    filterBuku = filterBuku.filter((buku) => buku.reading === true);
  }
  // buku selesai dibaca
  if (finished !== undefined) {
    filterBuku = filterBuku.filter((buku) => buku.finished === (finished === '1'));
  }

  // handler akan merespons sukses
  const response = h.response({
    status: 'success',
    data: {
      books: filterBuku.map((buku) => ({
        id: buku.id,
        name: buku.name,
        publisher: buku.publisher,
      })),
    },
  });
  response.code(200);

  return response;
};

// API dapat menampilkan detail buku
const HandlerDetailBuku = (request, h) => {
  // mendapatkan id dari parameter path
  const { id } = request.params;
  // buku merupakan object, jika filter tidak terpenuhi maka akan mnejadi undefined
  const book = books.filter((a) => a.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  // jika buku tidak ditemukan maka kembalikan handler dengan respons gagal
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

// API dapat mengubah data buku
const HandlerEditBuku = (request, h) => {
  // Get id from parameter path
  const { bookId } = request.params;
  // mendapatkan nilai edit dari user
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // jika name undefined maka kembalikan handler dengan respons gagal
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // jika readPage lebih besar dari pada pageCount maka kembalikan handler dengan respons gagal
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;

  // mencari buku berdasarkan idnya
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };
    // jika buku berhasil diperbarui maka kembalikan handler dengan respons sukses
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });

    response.code(200);
    return response;
  }
  // jika id buku tidak ditemukan maka kembalikan handler dengan respons gagal
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// API dapat menghapus buku
const HandlerHapusBuku = (request, h) => {
  // Get id from parameter path
  const { id } = request.params;

  // mencari buku berdasarkan idnya
  const index = books.findIndex((book) => book.id === id);

  // menghapus data pada array berdasarkan index
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  // jika index bernilai -1, maka kembalikan handler dengan respons gagal.
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  HandlerSimpanBuku,
  HandlerTampilSemuaBuku,
  HandlerDetailBuku,
  HandlerEditBuku,
  HandlerHapusBuku,
};
