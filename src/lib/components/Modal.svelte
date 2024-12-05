<script lang="ts">
    import { modalOpen } from "$lib/stores/appStore";
    import { onMount } from "svelte";

    let searchInput: HTMLElement | undefined = $state();

    function closeModal() {
        modalOpen.set(false);
    }

    onMount(() => {
        searchInput?.focus();
    });
</script>

{#if $modalOpen}
    <div
        class="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50"
    >
        <div
            class="flex flex-col p-6 mx-4 w-full max-w-[75%] h-full max-h-[75%] bg-primary dark:bg-primaryD rounded-lg shadow-lg"
        >
            <header class="flex justify-between pb-8">
                <h1 class="text-primaryD dark:text-primary font-bold text-3xl">
                    Choose an Hymnal
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

            <main class="flex flex-col items-center space-y-10">
                <!-- Search -->
                <div
                    class="flex items-center max-w-screen-xl w-full bg-primary dark:bg-highlightD rounded-full shadow-md px-4 py-2"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        class="h-5 w-5 text-highlight dark:text-primary"
                    >
                        <path
                            d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"
                        />
                    </svg>
                    <input
                        bind:this={searchInput}
                        type="search"
                        placeholder="Search..."
                        class="ml-3 flex-1 bg-transparent focus:outline-none text-primaryD dark:text-primary h-10"
                    />
                </div>

                <div
                    class="max-w-screen-xl max-h-screen/2 w-full h-full bg-primary dark:bg-highlightD rounded-sm shadow-md px-4 py-2 text-primaryD dark:text-primary"
                >
                    <ul>
                        <li>Test</li>
                        <li>Test</li>
                        <li>Test</li>
                        <li>Test</li>
                        <li>Test</li>
                        <li>Test</li>
                        <li>Test</li>
                        <li>Test</li>
                        <li>Test</li>
                        <li>Test</li>
                    </ul>
                </div>
            </main>
        </div>
    </div>
{/if}
