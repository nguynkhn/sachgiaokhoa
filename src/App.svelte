<header>
	<a class="header_title" href={base}>SÁCH GIÁO KHOA</a>
</header>

<svelte:window bind:scrollY />

<main>
	{#if lastUpdated}
	<p class="status_text">
		Cập nhật lần cuối: {new Date(lastUpdated).toLocaleString()}
	</p>
	<form class="search_form">
		<select class="search_select" bind:value={selectedBookSet}>
			<option value={-1} hidden>Bộ sách</option>
			{#each bookSets as bookSet, i}
			<option value={i}>{bookSet.name}</option>
			{/each}
		</select>
		<!-- TODO: make this functional -->
		<input class="search_input" bind:value={searchBook}
			placeholder="Tìm kiếm sách theo tên (sắp có)..." disabled>
	</form>
	<div class="book_grid">
		{#if selectedBookSet != -1}
		{#each bookLists[selectedBookSet] ?? [] as book}
		<div class="book_card">
			<img class="book_card_thumb" alt={book.title}
				src="{bookSets[selectedBookSet].cdnUrl}/{book.thumb}">
			<p class="book_card_title">{book.title}</p>
			<button class="book_card_download"
				on:click={() => downloadZip(book)}>
				TẢI VỀ (ZIP)
			</button>
		</div>
		{/each}
		{/if}
	</div>
	{:else}
	<spin class="spinner" />
	{/if}
	<button class="back_to_top" on:click={() => window.scrollTo(0, 0)}
		style:display={scrollFar ? 'block' : 'none'}>
		<svg class="back_to_top_icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
			<path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"/>
		</svg>
	</button>
</main>

<style>
	header {
		@apply px-4 w-full min-h-12 flex justify-between items-center shadow-md;
	}

	.header_title {
		@apply text-2xl text-center font-extrabold;
	}

	main {
		@apply px-4 py-6 text-center space-y-4;
	}

	.status_text {
		@apply h-fit;
	}

	.search_form {
		@apply space-x-2;
	}

	.search_select {
		@apply px-2 py-1 w-32 text-center;
	}

	.search_input {
		@apply px-2 py-1 w-64;
	}

	.book_grid {
		@apply grid 2xl:grid-cols-8 xl:grid-cols-6 lg:grid-cols-5
			md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-x-6 gap-y-4;
	}

	.book_card {
		@apply m-auto p-2 w-32 h-72 flex flex-col bg-slate-100 space-y-2
			rounded;
	}

	.book_card_thumb {
		@apply rounded min-h-40;
	}

	.book_card_title {
		@apply overflow-hidden;
	}

	.book_card_download {
		@apply p-1 text-sm font-bold border border-2 rounded-xl
			border-blue-200 bg-zinc-100 hover:bg-sky-100;
	}

	.spinner {
		@apply m-auto inline-block size-20 border-8 rounded-full animate-spin
			border-gray-600 border-t-blue-800;
	}

	.back_to_top {
		@apply p-2 fixed size-12 right-8 bottom-8 rounded-full bg-sky-400
			hover:scale-110 transition-transform;
	}

	.back_to_top_icon {
		@apply size-full text-zinc-100;
	}
</style>

<script>
	import { onMount } from 'svelte';
	import JSZip from 'jszip';
	import { saveAs } from 'file-saver';

	const { VITE_API_URL: API_URL, BASE_URL: base } = import.meta.env;
	const request = (endpoint) => fetch(`${API_URL}${endpoint}`)
		.then(res => res.json());

	let lastUpdated, bookSets;
	let selectedBookSet = -1, searchBook = '';
	const bookLists = [];

	let scrollY, scrollFar = false;

	$: (selectedBookSet == -1 || selectedBookSet in bookLists)
		|| request(`/${bookSets[selectedBookSet].slug}/books`)
			.then(bookList => bookLists[selectedBookSet] = bookList);
	$: scrollFar = scrollY > window.innerHeight / 2;

	onMount(async () => {
		({ lastUpdated, bookSets } = await request('/booksets'));
	});

	const downloadZip = (book) => {
		const { slug: bookSetSlug, cdnUrl } = bookSets[selectedBookSet];
		const bookSlug = book.slug;
		const padLength = book.pageCount.toString().length;
		const out = `${bookSetSlug}-${bookSlug}`;
		const zip = new JSZip;
		request(`/${bookSetSlug}/${bookSlug}`).then(book => {
			Promise.all(book.pages.map((page, i) =>
				fetch(`${cdnUrl}/${page}`)
					.then(res => res.blob())
					.then(image => zip.file(
						`${out}-${`${i + 1}`.padStart(padLength, '0')}.jpg`, image))
			))
				.then(() => zip.generateAsync({ type: 'blob' }))
				.then(content => saveAs(content, `${out}.zip`))
		});
	};
</script>
