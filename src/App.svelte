<script>
  import Header from './components/Header.svelte';
  import BackToTop from './components/BackToTop.svelte';

  import Home from './routes/Home.svelte';
</script>

<style>
  .main {
    @apply px-6 py-8 w-full min-h-screen text-center
    text-slate-950 dark:text-sky-50 bg-zinc-200 dark:bg-gray-900;
  }
</style>

<Header />

<main class="main">
  <!-- TODO: routes -->
  <Home />

  <BackToTop />
</main>
