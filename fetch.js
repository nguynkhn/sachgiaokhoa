const fs = require('fs');
const path = require('path');

const VERSION = 1;

async function _request(url, method, headers = {}, body) {
  headers['Accept'] = 'application/json';
  if (typeof body == 'object') {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }

  const response = await fetch(url, { method, headers, body });
  const { data } = await response.json();
  return data;
}

async function fetchBooks(...fetchFns) {
  const bookSets = [];

  const removeVni = (str) => str
    .normalize('NFD')
    .replace(/Đ/g, 'D').replace(/đ/g, 'd') // distinct letter
    .replace(/[^\d\w\s-_]/g, '');
  const shortenStr = (str) => removeVni(str)
    .toLowerCase().match(/\b\w/g).join('');
  const strToSlug = str => removeVni(str)
    .toLowerCase().replace(/(\s|-|_)+/g, '-');

  for (const fetchFn of fetchFns) {
    const prefix = `[${fetchFn.name}]`;

    const addBookSet = (apiId, name, apiUrl, thumbUrl, pageUrl) => {
      const bookSet = {
        apiId, name, slug: shortenStr(name), apiUrl, thumbUrl, pageUrl, books: [],
      };
      bookSets.push(bookSet);
      console.info(`${prefix} Added ${name} (ID ${apiId})`);
      return bookSet;
    };
    const addBook = (bookSet, apiId, title, thumb, pages) => {
      bookSet.books.push({
        apiId, title, slug: `${strToSlug(title)}-${apiId}`, thumb, pages
      });
      console.info(
        `${prefix} [${bookSet.name}] Added ${title} (ID ${apiId})`
      );
    };

    await fetchFn({ addBookSet, addBook });
  }

  const bookCount = bookSets
    .reduce((counter, bookSet) => counter + bookSet.books.length, 0);
  console.info(`Fetched ${bookSets.length} book sets with ${bookCount} books`);
  return bookSets;
}

const Hoc10Fetch = async ({ addBookSet, addBook }) => {
  const apiUrl = 'https://api.hoc10.vn/api';
  const bookTypeFilter = [1, 3, 5]; // see: apiUrl source code
  const bookTypeIds = bookTypeFilter.join();
  const bookSet = addBookSet(
    null,
    'Cánh diều',
    apiUrl,
    'https://hoc10.monkeyuni.net/E_Learning',
    'https://hoc10.monkeyuni.net/E_Learning/page_public',
  );

  const bookList
    = await _request(`${apiUrl}/list-book?book_type_id=${bookTypeIds}`);
  for (const { id, title } of bookList.list_book) {
    const { thumb, list_page }
      = await _request(`${apiUrl}/get-detail-page?book_id=${id}`);
    if (!list_page) {
      continue;
    }

    addBook(
      bookSet, id, title, thumb.slice('E_Learning/'.length),
      list_page.map(
        ({ background }) => background.slice('E_Learning/page_public/'.length),
      ),
    );
  }
};

const HanhTrangSoFetch = async ({ addBookSet, addBook }) => {
  const apiUrl = 'https://apihanhtrangso.nxbgd.vn:8080/api';
  const account = {
    email: process.env.HANHTRANGSO_EMAIL,
    password: process.env.HANHTRANGSO_PASSWORD,
  };
  let headers = {};
  let expireTime = 0;
  const checkLogin = async () => {
    if (Date.now() < expireTime * 1000) {
      return;
    }

    const { accessToken }
      = await _request(`${apiUrl}/login`, 'POST', {}, account);
    headers['Authorization'] = `Bearer ${accessToken}`;

    const { exp } = JSON.stringify(atob(accessToken.split('.')[1]));
    expireTime = exp;
  };

  const bookSetIds = [];

  await checkLogin();
  const bookList
    = await _request(`${apiUrl}/book/book-list`, 'POST', headers, {});
  for (const { bookTypeId, name, bookGroups } of bookList) {
    if (bookSetIds.includes(bookTypeId)) {
      continue;
    }
    bookSetIds.push(bookTypeId);

    const bookSet = addBookSet(
      bookTypeId,
      name.trim(),
      apiUrl,
      'https://cdnelearning.nxbgd.vn/uploads',
      'https://cdnelearning.nxbgd.vn/uploads/books',
    );

    for (const { books } of bookGroups) {
      for (const { bookId, name } of books) {
        await checkLogin();
        const { imageUrl, totalPage, fileName }
          = await _request(`${apiUrl}/book/${bookId}`, 'GET', headers);
        if (!fileName) {
          continue;
        }

        addBook(
          bookSet, bookId, name, imageUrl.slice('uploads/'.length),
          [...Array(totalPage).keys()].map(
            index => `${fileName}-${index + 1}.jpg`,
          ),
        );
      }
    }
  }
};

function generateBooks(bookSets) {
  const writeP = (file, data) => {
    const dir = path.dirname(file);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(file, data);
  };
  const dir = path.join(`v${VERSION}`);

  bookSets.forEach(bookSet => {
    const bookSetDir = path.join(dir, bookSet.slug);

    writeP(
      path.join(bookSetDir, 'books'),
      JSON.stringify(bookSet.books.map(book => {
        writeP(path.join(bookSetDir, book.slug), JSON.stringify(book));

        // simplify by taking the essentials
        const { title, slug, thumb, pages } = book;
        return { title, slug, thumb, pageCount: pages.length };
      })),
    );
  });

  const lastUpdated = new Date;
  writeP(
    path.join(dir, 'booksets'),
    JSON.stringify(
      { lastUpdated, bookSets },
      // ignore `books`
      (key, value) => key == 'books' ? undefined : value,
    ),
  );
}

fetchBooks(Hoc10Fetch, HanhTrangSoFetch)
  .then(generateBooks)
  .then(_ => console.log('DONE'));
