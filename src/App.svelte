<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import {
    Hymn,
    HymnView,
    Hymnal,
    Slide,
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
  import { getHymnEquivalency } from "./lib/components/hymn-view/sda-api";

  let availableHymnals: Hymnal[] = [];
  let numbersPressed = "";

  let syncSlides = [];

  async function handleInput(event: KeyboardEvent) {
    const codeValue = event.code;
    const key = event.key;

    // Number Changed
    if (!Number.isNaN(parseInt(key))) {
      numbersPressed += key;
      return;
    }

    switch (codeValue) {
      case "Backspace":
        numbersPressed = numbersPressed.slice(0, -1);
        break;
      case "Enter":
        if (parseInt(numbersPressed) <= 0) return;

        mainHymn.set(
          (await getHymn(
            parseInt(numbersPressed),
            availableHymnals[0],
          )) as Hymn,
        );
        mainHymnSlides.set($mainHymn.getSlides());
        numbersPressed = "";

        if ($dualView) {
          console.log("Looking for equivalency for");

          let hymn = await getHymnEquivalency(
            $mainHymn.number,
            availableHymnals[0],
            availableHymnals[1],
          );

          if (hymn instanceof Hymn) {
            equivalentHymn.set(hymn);
            equivalentHymnSlides.set($equivalentHymn?.getSlides() as Slide[]);

            equivalentHymnSlideIndex.set(0);
          } else {
            console.log(`No Equivalent Hymn: ${hymn}`);
          }
        } else {
          equivalentHymn.set(undefined);
        }

        break;
      case "ArrowLeft":
        if ($mainHymnSlideIndex > 0)
          mainHymnSlideIndex.update((val) => (val -= 1));
        if ($dualView) {
          if ($equivalentHymnSlideIndex > 0)
            equivalentHymnSlideIndex.update((val) => (val -= 1));
        }
        break;
      case "ArrowRight":
        if ($mainHymnSlideIndex + 1 < $mainHymnSlides.length)
          mainHymnSlideIndex.update((val) => (val += 1));
        if ($dualView) {
          if ($equivalentHymnSlideIndex + 1 < $equivalentHymnSlides.length)
            equivalentHymnSlideIndex.update((val) => (val += 1));
        }
        break;
      case "KeyS":
        dualView.update((val) => (val = !val)); // Switch Dual View

        if ($equivalentHymn === undefined && $mainHymn) {
          console.log("Looking for equivalency for");

          let hymn = await getHymnEquivalency(
            $mainHymn.number,
            availableHymnals[0],
            availableHymnals[1],
          );

          if (hymn instanceof Hymn) {
            equivalentHymn.set(hymn);
            equivalentHymnSlideIndex.set(0);
          } else {
            console.log(`No Equivalent Hymn: ${hymn}`);
          }
        } else
          equivalentHymnSlides.set($equivalentHymn?.getSlides() as Slide[]);

        break;
    }
  }

  async function initialize() {
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
    <div class="horizontal">
      <HymnView slides={mainHymnSlides} slideIndex={mainHymnSlideIndex} />
      {#if $dualView && $equivalentHymn}
        <HymnView
          slides={equivalentHymnSlides}
          slideIndex={equivalentHymnSlideIndex}
        />
      {/if}
    </div>
    <h4 style="text-align: center;">
      {`Hymn Num: ${numbersPressed} | DualView: ${$dualView}`}
    </h4>
  {:else}
    <h1 style="font-size: 60px;">Loading...</h1>
  {/if}
</main>

<style>
  .horizontal {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
</style>
