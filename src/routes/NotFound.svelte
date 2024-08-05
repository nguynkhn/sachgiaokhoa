<style>
  .not_found {
    @apply space-y-2;
  }

  .not_found_title {
    @apply text-4xl font-black;
  }

  .not_found_hint {}

  .not_found_back {
    @apply font-bold hover:underline;
  }
</style>

<div class="not_found">
  <h1 class="not_found_title">KHÔNG TÌM THẤY TRANG</h1>
  <p class="not_found_hint">
    Bạn có thể muốn về
    <a class="not_found_back" href={import.meta.env.BASE_URL}>
      Trang chủ
    </a>
  </p>
</div>
