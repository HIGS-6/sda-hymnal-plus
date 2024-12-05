<script lang="ts">
    import FooterItem from "$lib/components/layout/FooterItem.svelte";
    import { hymnNumber } from "$lib/stores/appStore";

    let actualNumber = $derived(
        Number.isNaN(Number.parseInt($hymnNumber))
            ? "0"
            : Number.parseInt($hymnNumber, 10).toString().padStart(3, "0"),
    );
</script>

{#if !Number.isNaN(Number.parseInt($hymnNumber))}
    <FooterItem>
        <!-- Icon -->
        <svg class="text-primaryD size-4 dark:text-white">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g
                    transform="translate(-382.000000, -7721.000000)"
                    fill="currentColor"
                >
                    <g id="icons" transform="translate(56.000000, 160.000000)">
                        <path
                            d="M332,7571 L336,7571 L336,7567 L332,7567 L332,7571 Z M342,7567 L342,7565 L338,7565 L338,7561 L336,7561 L336,7565 L332,7565 L332,7561 L330,7561 L330,7565 L326,7565 L326,7567 L330,7567 L330,7571 L326,7571 L326,7573 L330,7573 L330,7577 L332,7577 L332,7573 L336,7573 L336,7577 L338,7577 L338,7573 L342,7573 L342,7571 L338,7571 L338,7567 L342,7567 Z"
                            id="number_sign-[#110]"
                        >
                        </path>
                    </g>
                </g>
            </g>
        </svg>

        <!-- Text -->
        <p class="px-1 text-primaryD dark:text-white text-md">
            {actualNumber}
        </p>
    </FooterItem>
{/if}
