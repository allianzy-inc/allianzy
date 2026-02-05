<script>
  import '../app.css';
  import { onMount } from 'svelte';
  import { updated } from '$app/stores';

  onMount(() => {
      // Check for version updates every minute
      const interval = setInterval(() => {
          updated.check();
      }, 60000);

      return () => clearInterval(interval);
  });

  // If a new version is detected, reload the page to get the latest assets
  $: if ($updated) {
      // We can show a toast here or just reload
      // For now, let's just reload to ensure consistency
      window.location.reload();
  }
</script>

<slot />
