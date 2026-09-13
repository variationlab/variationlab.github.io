<script lang="ts">
	import type { HTMLImgAttributes } from 'svelte/elements';

	type ImageProps = Omit<HTMLImgAttributes, 'src' | 'alt'> & {
		src: string;
		alt: string;
	};

	let { src, alt, ...attributes }: ImageProps = $props();
</script>

<img {...attributes} {src} {alt} />
