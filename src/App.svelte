<script lang="ts">
  import { Hymn, Slide } from "./lib/models";
  import { getHymn } from "./lib/sda_api.ts"; 

  let currentHymn: Hymn | undefined;
  let currentStanzaIdx = 0;
  let currentHymnNumber = "";

  let currentSlides: Array<Slide> | undefined;
  let currentSlideIndex: number = 0;

  document.addEventListener(
    "keydown",
    async (event) => {
      var codeValue = event.code;
      var key = event.key;

      // Key Pressed is a number so its appended to the current number
      if (!Number.isNaN(parseInt(key))) {
        currentHymnNumber += key;
      }
      // Backspace is pressed, so the last digit of the number is deleted
      else if (codeValue === "Backspace") {
        currentHymnNumber = currentHymnNumber.slice(0, -1);
      }
      // Enter pressed so, the current number is used to load the hymn
      else if (codeValue === "Enter") {
        let currentHymn = await getHymn(parseInt(currentHymnNumber));
        currentHymnNumber = "";
        
        if (currentHymn instanceof Hymn) {
          currentSlides = currentHymn.getSlides();
        } // Aqui un else y hacer algo con el mensaje de error. 
      }
      
      if (!currentSlides) return;
      // Left arrow pressed, so previous stanza is shown
      if (codeValue === "ArrowLeft") {
        if (currentSlideIndex > 0) {
          currentSlideIndex--;
        }
      }
      // Right arrow pressed, so next stanza is shown
      else if (codeValue === "ArrowRight") {
        if (currentSlideIndex + 1 < currentSlides.length) {
          currentSlideIndex++;
        }
      }
    },
    false,
  );
</script>

<main class="container">
  {#if currentSlides}
    <ul class="center">
      {#each currentSlides[currentSlideIndex].primaryString.split("\n") as line, _}
        <p class="stanza">{line}</p>
      {/each}
    </ul>
    <h3 style="text-align: center;">
      {currentSlides[currentSlideIndex].secondaryString}
    </h3>
  {:else}
    <h1 style="font-size: 80px;">SDA Hymnal+</h1>
  {/if}
</main>

<style>
  .stanza {
    font-size: 70px;
    font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
    text-align: left;
    list-style: none;
  }
  .center {
    margin: auto;
  }
</style>
