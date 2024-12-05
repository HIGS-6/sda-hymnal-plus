<script lang="ts">
    import SdaIcon from "$lib/components/SdaIcon.svelte";
    import {
        secondaryHymnLoading,
        primaryHymnLoading,
        primarySlideIndex,
        secondaryHymn,
        primaryHymn,
        viewMode,
    } from "$lib/stores/appStore";

    let isDualView = $derived($viewMode >= 0 ? true : false);
</script>

<div
    class="{$viewMode === 0 ? 'flex' : 'flex-col'} justify-evenly items-center"
>
    <!-- Primary Hymn View -->
    <div class="flex flex-col items-center">
        {#if $primaryHymnLoading}
            <SdaIcon loading={true} />
        {:else if $primaryHymn}
            {#if isDualView && $secondaryHymn}
                <ul
                    class="p-5 w-full sm:text-2xl md:text-3xl lg:text-4xl xl:text-6xl"
                >
                    {#each $primaryHymn.slides[$primarySlideIndex].primaryString.split("\n") as line}
                        <p class="text-lSecondary dark:text-white">{line}</p>
                    {/each}
                </ul>
            {:else}
                <ul
                    class="p-5 w-full sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl"
                >
                    {#each $primaryHymn.slides[$primarySlideIndex].primaryString.split("\n") as line}
                        <p class="text-black dark:text-white">{line}</p>
                    {/each}
                </ul>
            {/if}

            <h3 class="font-black text-center text-black dark:text-white">
                {$primaryHymn.slides[$primarySlideIndex].secondaryString}
            </h3>
        {:else}
            <!-- Slides DO NOT Exist -->
            <SdaIcon />
        {/if}
    </div>

    <!-- Secondary Hymn View -->
    {#if isDualView && ($secondaryHymnLoading || $secondaryHymn)}
        <div class="flex flex-col items-center">
            {#if $secondaryHymnLoading}
                <SdaIcon loading={true} />
            {:else if $secondaryHymn}
                {#if isDualView && $secondaryHymn}
                    <ul
                        class="p-5 w-full sm:text-2xl md:text-3xl lg:text-4xl xl:text-6xl"
                    >
                        {#each $secondaryHymn.slides[$primarySlideIndex].primaryString.split("\n") as line}
                            <p class="text-lSecondary dark:text-white">
                                {line}
                            </p>
                        {/each}
                    </ul>
                {:else}
                    <ul
                        class="p-5 w-full sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl"
                    >
                        {#each $secondaryHymn.slides[$primarySlideIndex].primaryString.split("\n") as line}
                            <p class="text-black dark:text-white">{line}</p>
                        {/each}
                    </ul>
                {/if}

                <h3 class="font-black text-center text-black dark:text-white">
                    {$secondaryHymn.slides[$primarySlideIndex].secondaryString}
                </h3>
            {:else}
                <!-- Slides DO NOT Exist -->
                <SdaIcon />
            {/if}
        </div>
    {/if}
</div>
