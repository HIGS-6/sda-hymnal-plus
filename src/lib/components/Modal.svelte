<script lang="ts">
    import ChooseHymnalView from "$lib/components/ChooseHymnalView.svelte";
    import { modalMode, modalOpen, modalTitle } from "$lib/stores/appStore";
    import { closeModal } from "$lib/utils/modal";
</script>

{#if $modalOpen}
    <div
        class="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50"
    >
        <div
            class="flex flex-col p-6 mx-4 w-full max-w-[75%] h-full max-h-[75%] bg-primary dark:bg-primaryD rounded-lg shadow-lg"
        >
            <!-- Header -->
            <header class="flex justify-between pb-8">
                <h1 class="text-primaryD dark:text-primary font-bold text-3xl">
                    {$modalTitle}
                </h1>

                <button
                    class="text-black bg-inherit dark:text-primary"
                    onclick={closeModal}
                >
                    <span class="sr-only">Close modal</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </header>

            <!-- Main -->
            <main class="flex flex-col items-center space-y-10">
                {#if $modalMode === 1}
                    <ChooseHymnalView />
                {/if}
            </main>

            <!-- TOOD: Footer with buttons -->
        </div>
    </div>
{/if}
