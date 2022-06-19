const {
  HandlerSimpanBuku,
  HandlerTampilSemuaBuku,
  HandlerDetailBuku,
  HandlerEditBuku,
  HandlerHapusBuku,
} = require('./handler');

const routes = [
  {
    // menyimpan buku
    method: 'POST',
    path: '/books',
    handler: HandlerSimpanBuku, // import fungsi handlernya
  },
  {
    // menampilkan seluruh buku
    method: 'GET',
    path: '/books',
    handler: HandlerTampilSemuaBuku, // import fungsi handlernya
  },
  {
    // detail buku
    method: 'GET',
    path: '/books/{id}',
    handler: HandlerDetailBuku, // import fungsi handlernya
  },
  {
    // mengubah data buku
    method: 'PUT',
    path: '/books/{bookId}',
    handler: HandlerEditBuku, // import fungsi handlernya
  },
  {
    // menghapus buku
    method: 'DELETE',
    path: '/books/{id}',
    handler: HandlerHapusBuku, // import fungsi handlernya
  },
];

module.exports = routes;
