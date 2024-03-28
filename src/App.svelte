<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import {
    Hymn,
    HymnView,
    Hymnal,
    getHymn,
    getHymnals,
  } from "./lib/components/hymn-view";
  import {
    dualView,
    equivalentHymn,
    equivalentHymnSlideIndex,
    equivalentHymnSlides,
    isReady,
    mainHymn,
    mainHymnSlideIndex,
    mainHymnSlides,
  } from "./lib/store";

  let availableHymnals: Array<Hymnal> = [];
  let numbersPressed = "";

  async function handleInput(event: KeyboardEvent) {
    const codeValue = event.code;
    const key = event.key;

    console.log(`Key Pressed: ${codeValue}.`);

    // Key Pressed is a number so its appended to the current number
    if (!Number.isNaN(parseInt(key))) {
      numbersPressed += key;
    }
    // Backspace is pressed, so the last digit of the number is deleted
    else if (codeValue === "Backspace") {
      numbersPressed = numbersPressed.slice(0, -1);
    }
    // Enter pressed so, the current number is used to load the Main Hymn and its slides
    else if (codeValue === "Enter") {
      console.log("Loading Hymn...");

      let hymn = (await getHymn(
        parseInt(numbersPressed),
        availableHymnals[0],
      )) as Hymn;
      mainHymn.set(hymn);

      mainHymnSlides.set($mainHymn.getSlides());

      numbersPressed = "";
      return;
    }

    // Left arrow pressed, so previous stanza is shown
    if (codeValue === "ArrowLeft" && $mainHymnSlideIndex > 0) {
      console.log("Main Hymn Slide Index Going Down!");

      mainHymnSlideIndex.update((val) => (val -= 1));
    }
    // Right arrow pressed, so next stanza is shown
    else if (
      codeValue === "ArrowRight" &&
      $mainHymnSlideIndex + 1 < $mainHymnSlides.length
    ) {
      console.log("Main Hymn Slide Index Going Up!");

      mainHymnSlideIndex.update((val) => (val += 1));
    }
  }

  async function initialize() {
    // TODO: Implement Equivalent Hymn as well

    // Load Available Hymnals
    availableHymnals = (await getHymnals()) as Hymnal[];

    // Manage Input
    document.addEventListener("keydown", handleInput, false);

    isReady.set(true);
  }

  // Life-cylce events
  onMount(initialize);
  onDestroy(() => {
    document.removeEventListener("keydown", handleInput);
  });
</script>

<main>
  {#if $isReady}
    <div>
      <HymnView slides={mainHymnSlides} slideIndex={mainHymnSlideIndex} />
      {#if $dualView && $equivalentHymn}
        <HymnView
          slides={equivalentHymnSlides}
          slideIndex={equivalentHymnSlideIndex}
        />
      {/if}
    </div>
  {:else}
    <h1 style="font-size: 60px;">Loading...</h1>
  {/if}
</main>