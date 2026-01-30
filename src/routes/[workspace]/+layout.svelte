<script lang="ts">
	import { page } from '$app/stores';
	
	$: workspace = $page.params.workspace;
    $: isBeltix = workspace === 'beltix';
</script>

<div class={isBeltix ? 'font-serif' : 'font-sans'} data-theme={workspace}>
	<slot />
</div>
