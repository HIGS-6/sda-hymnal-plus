<script>
    import FooterItem from "$lib/components/layout/FooterItem.svelte";
    import {
        secondaryHymnal,
        primaryHymnal,
        viewMode,
    } from "$lib/stores/appStore";
    import { openChooseHymnalModal, openModal } from "$lib/utils/modal";
</script>

<!-- Primary Hymnal -->
<FooterItem
    onclick={() => {
        openChooseHymnalModal(() => {
            // primaryHymnal.set();
        });
    }}
>
    <!-- Icon -->
    <svg
        viewBox="0 0 50 50"
        xml:space="preserve"
        class="text-secondaryD size-4 dark:text-white"
    >
        <g fill="currentColor">
            <path
                d="M42.838,0H9.56C7.444,0,5.713,1.731,5.713,3.845v2.4H3.766c-0.248,0-0.451,0.202-0.451,0.45v4.953
            c0,0.248,0.203,0.451,0.451,0.451h1.948v4.697H3.766c-0.248,0-0.451,0.202-0.451,0.45V22.2c0,0.248,0.203,0.45,0.451,0.45h1.948
            v4.698H3.766c-0.248,0-0.451,0.201-0.451,0.449v4.954c0,0.248,0.203,0.45,0.451,0.45h1.948V37.9H3.766
            c-0.248,0-0.451,0.203-0.451,0.451v4.953c0,0.247,0.203,0.449,0.451,0.449h1.948v2.4C5.713,48.27,7.444,50,9.56,50h33.278
            c2.115,0,3.847-1.73,3.847-3.845V3.845C46.685,1.731,44.954,0,42.838,0z M37.813,24.973c-0.43-5.22-7.042-2.728-10.184-5.188
            v13.541c0.002,2.58-2.614,4.672-5.837,4.669c-3.223,0-5.838-2.089-5.837-4.669c0-2.571,2.614-4.668,5.837-4.668
            c1.018,0,1.958,0.224,2.792,0.593V12.005h3.045C29.738,15.608,39.674,14.307,37.813,24.973z"
            />
        </g>
    </svg>

    <!-- Hymnal Name -->
    <p class="px-1 text-primaryD dark:text-white text-md">
        {$primaryHymnal ? $primaryHymnal.name : "No Hymnal Selected"}
    </p>
</FooterItem>

{#if $viewMode >= 0}
    <!-- Swap Hymnals -->
    <FooterItem onclick={() => {}}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 16"
            class="text-secondaryD size-4 dark:text-white"
        >
            <path
                fill-rule="evenodd"
                d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"
            />
        </svg>
    </FooterItem>

    <!-- Secondary Hymnal -->
    <FooterItem onclick={() => {}}>
        <!-- Icon -->
        <svg
            class="text-secondaryD size-4 dark:text-white"
            viewBox="0 0 50 50"
            xml:space="preserve"
        >
            <g fill="currentColor">
                <path
                    d="M42.838,0H9.56C7.444,0,5.713,1.731,5.713,3.845v2.4H3.766c-0.248,0-0.451,0.202-0.451,0.45v4.953
            c0,0.248,0.203,0.451,0.451,0.451h1.948v4.697H3.766c-0.248,0-0.451,0.202-0.451,0.45V22.2c0,0.248,0.203,0.45,0.451,0.45h1.948
            v4.698H3.766c-0.248,0-0.451,0.201-0.451,0.449v4.954c0,0.248,0.203,0.45,0.451,0.45h1.948V37.9H3.766
            c-0.248,0-0.451,0.203-0.451,0.451v4.953c0,0.247,0.203,0.449,0.451,0.449h1.948v2.4C5.713,48.27,7.444,50,9.56,50h33.278
            c2.115,0,3.847-1.73,3.847-3.845V3.845C46.685,1.731,44.954,0,42.838,0z M37.813,24.973c-0.43-5.22-7.042-2.728-10.184-5.188
            v13.541c0.002,2.58-2.614,4.672-5.837,4.669c-3.223,0-5.838-2.089-5.837-4.669c0-2.571,2.614-4.668,5.837-4.668
            c1.018,0,1.958,0.224,2.792,0.593V12.005h3.045C29.738,15.608,39.674,14.307,37.813,24.973z"
                />
            </g>
        </svg>

        <!-- Text -->
        <p class="px-1 text-primaryD dark:text-white text-md">
            {$secondaryHymnal ? $secondaryHymnal.name : "No Hymnal Selected"}
        </p>
    </FooterItem>
{/if}
