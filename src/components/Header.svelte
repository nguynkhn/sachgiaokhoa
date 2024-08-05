<script>
  import ThemeSwitcher from './ThemeSwitcher.svelte';
</script>

<style>
  .header {
    @apply px-4 py-2 space-x-4 w-full min-h-12 flex justify-between
      items-center bg-zinc-100 dark:bg-neutral-900 shadow-md;
  }

  .header_title {
    @apply text-center text-2xl font-extrabold text-blue-800 dark:text-sky-50;
  }
</style>

<header class="header">
  <a class="header_title" href={import.meta.env.BASE_URL}>
    SÁCH GIÁO KHOA
  </a>
  <ThemeSwitcher />
</header>
