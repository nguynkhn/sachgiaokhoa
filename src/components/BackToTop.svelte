<script>
  let scrollY, scrollFar;
  $: scrollFar = scrollY > window.innerHeight / 2;
</script>

<style>
  .back_to_top {
    @apply p-1 fixed bottom-4 right-4 size-8 rounded-full transition-transform
      opacity-70 bg-sky-400 hover:scale-105 hover:contrast-125 hover:opacity-95;
  }

  .back_to_top_icon {
    @apply size-full text-slate-100;
  }
</style>

<svelte:window bind:scrollY={scrollY} />

<button class="back_to_top" on:click={() => window.scrollTo(0, 0)}
  style:display={scrollFar ? 'block' : 'none'}>
  <!-- from: https://icons.getbootstrap.com/icons/arrow-up/ -->
  <svg fill="currentColor" class="back_to_top_icon" viewBox="0 0 16 16">
    <path d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0
      .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5
      2.707V14.5a.5.5 0 0 0 .5.5"/>
  </svg>
  <span class="sr-only">Quay trở về trang đầu</span>
</button>
