<script lang="ts">
    import { getHymnals } from "$lib/services/sdaApiService";
    import SdaIcon from "$lib/components/SdaIcon.svelte";
    import { closeModal } from "$lib/utils/modal";
    import { onMount } from "svelte";
    import {
        modalIsPrimaryHymnal,
        availableHymnals,
        secondaryHymnal,
        primaryHymnal,
    } from "$lib/stores/appStore";

    let allHymnals = $state($availableHymnals);
    let searchInput: HTMLElement | undefined = $state();

    onMount(async () => {
        if (!allHymnals) {
            availableHymnals.set(await getHymnals());
            allHymnals = $availableHymnals;
        }

        searchInput?.focus();
    });
</script>

<div class="flex flex-col items-center space-y-10">
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
        {#if !allHymnals}
            <SdaIcon loading={true} />
        {:else}
            <ul class="flex flex-col space-y-5">
                {#each allHymnals as hymnal}
                    <li>
                        <button
                            disabled={($modalIsPrimaryHymnal &&
                                $primaryHymnal === hymnal) ||
                                (!$modalIsPrimaryHymnal &&
                                    $secondaryHymnal === hymnal)}
                            onclick={() => {
                                if ($modalIsPrimaryHymnal) {
                                    primaryHymnal.set(hymnal);
                                    closeModal();
                                } else {
                                    secondaryHymnal.set(hymnal);
                                    closeModal();
                                }
                            }}
                        >
                            <h4>{hymnal.name}</h4>
                        </button>
                    </li>
                {/each}
            </ul>
        {/if}
    </div>
</div>
