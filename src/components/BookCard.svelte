<script>
  export let book;

  import { getContext } from 'svelte';
  import { getBook } from '../lib/book';
  import { fetchImages, generateZip } from '../lib/archive';
  import FileSaver from 'file-saver';

  const bookSet = getContext('bookSet');

  const lazyLoad = (node) => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || book.thumb.length == 0) {
        return;
      }
      const thumb = encodeURI(`${$bookSet.thumbUrl}/${book.thumb}`);
      node.style.backgroundImage = `url("${thumb}")`;

      observer.unobserve(node);
    });

    observer.observe(node);

    return {
      destroy() {
        observer.unobserve(node);
      },
    };
  };

  let ok, zip, bookInfo;
  const downloadZip = async () => {
    if (ok === false) {
      return;
    }
    ok = false;
    const slug = `${$bookSet.slug}-${book.slug}`;

    if (!zip) {
      if (!bookInfo) {
        bookInfo = await getBook($bookSet.slug, book.slug);
      }
      const images = await fetchImages($bookSet.pageUrl, slug, bookInfo.pages);
      zip = await generateZip(images);
    }

    FileSaver.saveAs(zip, `${slug}.zip`);
    ok = true;
  };
  // TODO: downloading queue with progression

</script>

<style>
  .book_card {
    @apply p-2 w-36 h-72 flex flex-col space-y-2 rounded shadow-lg
      bg-slate-50 dark:bg-slate-800;
  }

  .book_card_title {
    @apply font-semibold mb-auto overflow-hidden text-ellipsis;
  }

  .book_card_thumb {
    @apply w-full min-h-44 rounded-md bg-cover bg-slate-200 dark:bg-slate-900;
  }

  .book_card_download {
    @apply p-1 w-full text-sm font-bold border-2 rounded-xl
    border-blue-200 dark:border-violet-200
    hover:bg-sky-100 dark:hover:bg-slate-500;
  }
</style>

<div class="book_card">
  <p class="book_card_title">{book.title}</p>
  <div class="book_card_thumb" use:lazyLoad />
  <button class="book_card_download" on:click={downloadZip}>
    {ok == undefined ? 'Tải về (ZIP)' : (ok ? 'Hoàn thành' : 'Đang tạo...')}
  </button>
</div>
