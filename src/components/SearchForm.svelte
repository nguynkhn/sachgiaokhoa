<script>
  import { getContext } from 'svelte';
  import Fuse from 'fuse.js';

  const bookSets = getContext('bookSets');
  const bookSet = getContext('bookSet');
  const bookList = getContext('bookList');
  const searchBooks = getContext('searchBooks');

  let selectedBookSet = -1;
  let searchInput = '';
  $: selectedBookSet != -1
    && ($bookSet = $bookSets[selectedBookSet]);

  const fuse = new Fuse([], { keys: ['title'] });
  // load book list
  $: $bookList && fuse.setCollection($bookList);

  // search if there is input
  $: $bookSet && ($searchBooks = searchInput != ''
      ? fuse.search(searchInput)
        .map(result => result.item)
      : $bookList);
</script>

<style>
  .search_form {
    @apply my-4 flex md:flex-row justify-center flex-col items-center gap-2;
  }

  .search_form * {
    @apply px-2 py-1 h-8 bg-zinc-50 dark:bg-slate-800;
  }

  .search_form_select {
    @apply w-48 box-border text-center;
  }

  .search_form_input {
    @apply w-72;
  }
</style>

<form class="search_form" on:submit|preventDefault>
  <select class="search_form_select" bind:value={selectedBookSet}>
    <option value={-1} hidden>Bộ sách</option>
    {#each $bookSets as bookSet, i}
      <option value={i}>{bookSet.name}</option>
    {/each}
  </select>
  <input class="search_form_input" bind:value={searchInput}
    placeholder="Tìm kiếm sách theo tên...">
</form>
