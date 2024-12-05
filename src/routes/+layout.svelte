<script lang="ts">
    import { handleKeyboardEvents } from "$lib/services/keybindsService";
    import Modal from "$lib/components/Modal.svelte";
    import { onMount } from "svelte";
    import "../app.css";

    let { children } = $props();

    // Attach listener on mount
    onMount(() => {
        window.addEventListener("keydown", handleKeyboardEvents);

        // Cleanup listener on destroy
        return () => {
            window.removeEventListener("keydown", handleKeyboardEvents);
        };
    });
</script>

<Modal />
<main>
    {@render children()}
</main>

<style lang="postcss">
    main {
        @apply bg-primary dark:bg-primaryD;
    }
</style>
