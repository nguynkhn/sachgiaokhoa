<script>
  export let error;
</script>

<style>
  .error {
    @apply space-y-2;
  }

  .error_code {
    @apply text-8xl font-black;
  }

  .error_message {}
</style>

<div class="error">
  <h1 class="error_code">{error.status}</h1>
  <p class="error_message">
    Lỗi khi tải trang
    {error.statusText ? `(${error.statusText})` : ''}
  </p>
</div>
