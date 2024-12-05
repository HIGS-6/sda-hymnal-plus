<script>
    import FooterItem from "$lib/components/layout/FooterItem.svelte";
    import { viewMode } from "$lib/stores/appStore";

    function toggleViewMode() {
        if ($viewMode === 0) {
            viewMode.set(1);
        } else if ($viewMode === 1) {
            viewMode.set(0);
        }
    }
</script>

{#if $viewMode >= 0}
    <!-- Icons -->
    <FooterItem onclick={toggleViewMode}>
        <!-- Horizontal View -->
        {#if $viewMode === 0}
            <svg
                class="text-black size-4 dark:text-white"
                viewBox="0 0 16 16"
                fill="currentColor"
            >
                <path
                    d="M14 1H3L2 2v11l1 1h11l1-1V2l-1-1zM8 13H3V2h5v11zm6 0H9V2h5v11z"
                />
            </svg>
        {:else if $viewMode === 1}
            <!-- Vertical View -->
            <svg
                class="text-black size-4 dark:text-white"
                viewBox="0 0 16 16"
                fill="currentColor"
            >
                <path
                    d="M14 1H3L2 2v11l1 1h11l1-1V2l-1-1zm0 12H3V8h11v5zm0-6H3V2h11v5z"
                />
            </svg>
        {/if}
    </FooterItem>
{/if}
