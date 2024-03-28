<script lang="ts">
  import type { Writable } from "svelte/store";
  import { Slide } from "./";

  // Slide System
  export let slides: Writable<Slide[]>;
  export let slideIndex: Writable<number>;
</script>

<div class="container">
  {#if $slides && $slides.length > 0}
    <ul class="center">
      {#each $slides[$slideIndex].primaryString.split("\n") as line}
        <p class="stanza">{line}</p>
      {/each}
    </ul>
    <h3 style="text-align: center;">
      {$slides[$slideIndex].secondaryString}
    </h3>
  {:else}
    <h1 style="font-size: 70px;">SDA Hymnal+</h1>
  {/if}
</div>

<style>
  .stanza {
    font-size: 60px;
    font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
    text-align: left;
    list-style: none;
  }
  .center {
    margin: auto;
  }
</style>
