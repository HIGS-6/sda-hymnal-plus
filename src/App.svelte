<script lang="ts">
  import PocketBase from "pocketbase";

  class Hymn {
    title: string;
    number: number;
    lyrics: Map<String, String>;
    constructor(title: string, number: number, lyrics: Map<String, String>) {
      this.title = title;
      this.number = number;
      this.lyrics = lyrics;
    }
  }
  const pb = new PocketBase("https://sda-api.pockethost.io/");

  let currentHymn: Hymn | undefined;
  let inputHymnNumber = 1;
  let currentStanzaIdx = 0;
  let currentHymnNumber = "";

  async function getHymn() {
    currentStanzaIdx = 0;
    try {
      // Get Hymn
      const hymn_result = await pb
        .collection("hymns")
        .getFirstListItem(
          `number=${inputHymnNumber} && language.langName="English"`,
        );

      // Get Lyrics
      const lyricsResult = await pb.collection("hymn_lyrics").getFullList({
        filter: `hymn="${hymn_result.id}"`,
      });

      // Instantiate an Hymn object
      let title = hymn_result.title;
      let number = hymn_result.number;
      let lyrics = new Map();

      lyricsResult.forEach((rawLyric) => {
        // Adds a Map for each Stanza
        lyrics.set(rawLyric.context, rawLyric.content);
      });

      let hymn = new Hymn(title, number, lyrics);

      // return hymn;
      currentHymn = hymn;
    } catch (error) {
      console.log(error);
    }
  }

  function getStanzaInfo(number: number, hymn: Hymn): Array<String> {
    let lyricValues = Array.from(hymn.lyrics.values());
    let lyricKeys = Array.from(hymn.lyrics.keys());

    if (number < 0 || number > hymn.lyrics.size) {
      console.log("Wrong Index");
    } else {
      return [lyricKeys[number], lyricValues[number]];
    }

    return ["Error", "Error"];
  }

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
        inputHymnNumber = parseInt(currentHymnNumber);
        await getHymn();
        currentHymnNumber = "";
      }

      console.log(`Current Hymn Number: ${currentHymnNumber}`);

      if (!currentHymn) return;
      // Left arrow pressed, so previous stanza is shown
      if (codeValue === "ArrowLeft") {
        if (currentStanzaIdx > 0) {
          currentStanzaIdx--;
        }
      }
      // Right arrow pressed, so next stanza is shown
      else if (codeValue === "ArrowRight") {
        if (currentStanzaIdx + 1 < currentHymn.lyrics.size) {
          currentStanzaIdx++;
        }
      }
    },
    false,
  );
</script>

<main class="container">
  <!-- <div class="center"> -->
  {#if currentHymn instanceof Hymn}
    <ul class="center">
      {#each getStanzaInfo(currentStanzaIdx, currentHymn)[1].split("\n") as line, _}
        <p class="stanza">{line}</p>
      {/each}
    </ul>
    <h3 style="text-align: center;">
      {getStanzaInfo(currentStanzaIdx, currentHymn)[0]}
    </h3>
  {:else}
    <h1 style="font-size: 100px;">SDA Hymnal+</h1>
  {/if}
  <!-- </div> -->
</main>

<style>
  .stanza {
    font-size: 75px;
    font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
    text-align: left;
    list-style: none;
  }
  .center {
    margin: auto;
  }
</style>
