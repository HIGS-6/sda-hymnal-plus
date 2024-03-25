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

  let currentHymn: Hymn | String = "SDA Hymnal+";
  let inputHymnNumber = 1;
  let currentStanzaIdx = 0;

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

  function getStanza(number: number, hymn: Hymn): Array<String> {
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
    (event) => {
      if (currentHymn instanceof Hymn === false) return;

      var codeValue = event.code;
      if (codeValue === "ArrowLeft") {
        if (currentStanzaIdx > 0) {
          currentStanzaIdx--;
        }
      } else if (codeValue === "ArrowRight") {
        if (currentStanzaIdx + 1 < currentHymn.lyrics.size) {
          currentStanzaIdx++;
        }
      }
    },
    false,
  );
</script>

<main class="container">
  <div class="center">
    <form
      on:submit|preventDefault={async () => {
        await getHymn();
      }}
    >
      <input bind:value={inputHymnNumber} type="number" name="hymnNumber" />
      <input type="submit" value="Load Hymn" />
    </form>

    {#if currentHymn instanceof Hymn}
      <h1>{`${currentHymn.number} | ${currentHymn.title}`}</h1>
      <p class="stanza">{`${getStanza(currentStanzaIdx, currentHymn)[0]} | ${getStanza(currentStanzaIdx, currentHymn)[1]}`}</p>
    {:else}
      <h1>{currentHymn}</h1>
    {/if}
  </div>
</main>

<style>
  .stanza {
    font-size: 25px;
    font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
    text-align: center;
  }
</style>
