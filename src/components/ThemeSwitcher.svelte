<script>
  let darkMode = localStorage.theme === 'dark'
    || (!('theme' in localStorage)
    && window.matchMedia('(prefers-color-scheme: dark)').matches);

  $: {
    darkMode
      ? document.documentElement.classList.add('dark')
      : document.documentElement.classList.remove('dark');
    localStorage.theme = darkMode ? 'dark' : 'light';
  };
</script>

<style>
  .theme_switcher {
    @apply p-1 w-12 h-6 shadow-inner rounded-xl bg-indigo-950 dark:bg-sky-400;
  }

  .theme_switcher_circle {
    @apply block size-4 rounded-full ml-0 mr-6 dark:ml-6 dark:mr-0
      transition-[margin,background-color] ease-in-out
      bg-sky-50 dark:bg-yellow-400;
  }
</style>

<button class="theme_switcher" on:click={() => darkMode = !darkMode}>
  <span class="theme_switcher_circle" />
  <span class="sr-only">Chuyển màu giao diện</span>
</button>
