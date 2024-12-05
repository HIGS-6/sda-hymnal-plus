<script>
    import {
        primaryHymnLoading,
        remoteControl,
        primaryHymn,
    } from "$lib/stores/appStore";
    import HymnView from "$lib/components/layout/HymnView.svelte";
    import Footer from "$lib/components/layout/Footer.svelte";
    import SdaIcon from "$lib/components/SdaIcon.svelte";
</script>

<div class="flex flex-col">
    <!-- Main View -->
    <div
        class="{!$remoteControl
            ? 'h-[95vh]'
            : 'h-screen'} flex justify-evenly items-center w-full"
    >
        {#if $primaryHymnLoading || $primaryHymn}
            <!-- Showing Hymns -->
            <HymnView />
        {:else if $primaryHymn === undefined && $primaryHymnLoading === false}
            <!-- No Selected Hymn -->
            <SdaIcon />
        {/if}
    </div>

    <Footer />
</div>
