import PocketBase from "pocketbase";
import { Hymn } from "./models";

const pb = new PocketBase("https://sda-api.pockethost.io/");

export async function getHymn(number: number, hymnal: string = "SDA Hymnal (1985)"): Promise<Hymn | string>{
    try {
      // Get Hymn
      const hymn_result = await pb
        .collection("hymns")
        .getFirstListItem(
          `number=${number} && version.name="${hymnal}"`,
        );

      // Get Lyrics
      const lyricsResult = await pb.collection("hymn_lyrics").getFullList({
        filter: `hymn="${hymn_result.id}"`,
      });

      // Instantiate an Hymn object
      let hTitle = hymn_result.title;
      let hNumber = hymn_result.number;
      let hLyrics = new Map();

      lyricsResult.forEach((rawLyric) => {
        // Adds a Map for each Stanza
        hLyrics.set(rawLyric.context, rawLyric.content);
      });

      let hymn = new Hymn(hTitle, hNumber, hLyrics);

      return hymn;
    } catch (error) {
      return `${error}`;
    }
  }

