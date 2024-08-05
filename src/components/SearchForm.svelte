<script>
  import { getContext } from 'svelte';

  const bookSets = getContext('bookSets');
  const bookSet = getContext('bookSet');
  let selectedBookSet = -1;
  $: selectedBookSet != -1 && ($bookSet = $bookSets[selectedBookSet]);

  let searchBook;
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

<form class="search_form">
  <select class="search_form_select" bind:value={selectedBookSet}>
    <option value={-1} hidden>Bộ sách</option>
    {#each $bookSets as bookSet, i}
      <option value={i}>{bookSet.name}</option>
    {/each}
  </select>
  <input class="search_form_input" bind:value={searchBook} disabled
    placeholder="Tìm kiếm sách theo tên (sắp có)...">
</form>
