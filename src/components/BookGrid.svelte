<script>
  import { getContext } from 'svelte';

  import { getAllBooks } from '../lib/book';

  import Spinner from './Spinner.svelte';
  import BookCard from './BookCard.svelte';
  import { writable } from 'svelte/store';

  const bookSet = getContext('bookSet');
  const bookList = getContext('bookList');
  const searchBooks = getContext('searchBooks');
  const displayBooks = writable([]);

  // reset book list
  $: $bookSet && ($bookList = $searchBooks = $displayBooks = [])
    && getAllBooks($bookSet.slug).then(data => $bookList = data);
  // if search then reset displaying books
  $: $searchBooks && ($displayBooks = []);

  let loadElement, observer;
  $: loadElement && (observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) {
      return;
    }
    if ($displayBooks.length == $searchBooks.length) {
      observer.unobserve(loadElement);
    }

    $displayBooks = $searchBooks.slice(0, $displayBooks.length + 1);
  })).observe(loadElement);
</script>

<style>
  .book_grid {
    @apply my-2 flex flex-wrap justify-evenly gap-x-6 gap-y-8;
  }
</style>

{#if $bookList}
  <div class="book_grid">
    {#each $displayBooks as book}
      <BookCard {book} />
    {/each}
  </div>
  {#if $displayBooks.length < $searchBooks.length}
    <Spinner />
  {/if}
  <p class="my-2" bind:this={loadElement}>
    Hiển thị {$displayBooks.length} / {$searchBooks.length} số sách
  </p>
{/if}
