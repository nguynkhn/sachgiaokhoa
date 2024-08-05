const API_URL = import.meta.env.VITE_API_URL;

const cache = new Map;
const request = async (endpoint) => {
  if (endpoint in cache) {
    return Promise.resolve(cache[endpoint]);
  }

  const res = await fetch(`${API_URL}${endpoint}`);
  if (res.ok) {
    const data = await res.json();
    return cache[endpoint] = data;
  }

  return Promise.reject(res);
};

export const getBookSets = () => request('/booksets');
export const getAllBooks = (bookSet) => request(`/${bookSet}/books`);
export const getBook = (bookSet, book) => request(`/${bookSet}/${book}`);
