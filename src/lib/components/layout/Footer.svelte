<script>
    import HymnNumberDisplay from "$lib/components/display/HymnNumberDisplay.svelte";
    import DualViewDisplay from "$lib/components/display/DualViewDisplay.svelte";
    import HymnalDisplay from "$lib/components/display/HymnalDisplay.svelte";
    import { remoteControl } from "$lib/stores/appStore";
</script>

{#if !$remoteControl}
    <footer
        class="h-[5vh] flex bg-lightSecondary bg-white dark:bg-secondaryD w-full items-center justify-center md:py-2 lg:py-2 sm:py-1 xl:py-3"
    >
        <HymnNumberDisplay />
        <HymnalDisplay />
        <DualViewDisplay />
    </footer>
{/if}
