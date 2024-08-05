<script>
  import { getContext } from 'svelte';

  import { getAllBooks } from '../lib/book';

  import Spinner from './Spinner.svelte';
  import BookCard from './BookCard.svelte';

  const bookSet = getContext('bookSet');
</script>

<style>
  .book_grid {
    @apply my-8 grid 2xl:grid-cols-8 xl:grid-cols-6 lg:grid-cols-5
      md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-x-6 gap-y-8;
  }
</style>

{#if $bookSet}
  {#await getAllBooks($bookSet.slug)}
    <Spinner />
  {:then books}
    <div class="book_grid">
      <!-- TODO: pagination -->
      {#each books as book}
        <BookCard {book} />
      {/each}
    </div>
    <p>Hiển thị {books.length} số sách</p>
  {/await}
{/if}
