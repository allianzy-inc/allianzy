<script lang="ts">
	import { page } from '$app/stores';
	
	$: workspace = $page.params.workspace;
    $: isBeltix = workspace === 'beltix';
    $: isAllianzy = workspace === 'allianzy';
</script>

<div class={isBeltix ? 'font-merriweather' : (isAllianzy ? 'font-bricolage' : 'font-sans')} data-theme={workspace}>
	<slot />
</div>
