<script>
  import { writable } from 'svelte/store';
  import { setContext } from 'svelte';

  import { getBookSets } from '../lib/book';

  import Spinner from '../components/Spinner.svelte';
  import SearchForm from '../components/SearchForm.svelte';
  import BookGrid from '../components/BookGrid.svelte';
  import Error from '../components/Error.svelte';

  const bookSets = writable([]);
  const bookSet = writable();
  const bookList = writable([]);
  const searchBooks = writable([]);
  setContext('bookSets', bookSets);
  setContext('bookSet', bookSet);
  setContext('bookList', bookList);
  setContext('searchBooks', searchBooks);

  let lastUpdated;
  const promise = () => getBookSets()
    .then(data => ({ lastUpdated, bookSets: $bookSets } = data));
</script>

{#await promise()}
  <Spinner />
{:then}
  <p>
    Cập nhật lần cuối: {new Date(lastUpdated).toLocaleString()}
  </p>
  <SearchForm />
  <BookGrid />
{:catch error}
  <Error {error} />
{/await}
