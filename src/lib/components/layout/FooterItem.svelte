<script lang="ts">
    let { onclick = undefined, children } = $props();
</script>

<button
    {onclick}
    class="flex justify-between items-center px-2 mx-2 h-full align-middle rounded-md bg-primary dark:bg-highlightD {onclick
        ? 'cursor-pointer'
        : 'cursor-default'}"
>
    {@render children()}
</button>
