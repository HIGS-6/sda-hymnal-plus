import { Hymn, Hymnal } from "./models";
import PocketBase from "pocketbase";

const pb = new PocketBase("https://sda-api.pockethost.io/");

export async function getHymn(number: number, hymnal: Hymnal): Promise<Hymn | string> {
  try {
    // Get Hymn
    const hymnResult = await pb
      .collection("hymns")
      .getFirstListItem(
        `number=${number} && version="${hymnal.id}"`,
      );

    // Get Lyrics
    const lyricsResult = await pb.collection("hymn_lyrics").getFullList({
      filter: `hymn="${hymnResult.id}"`,
    });

    // Instantiate an Hymn object
    let hTitle = hymnResult.title;
    let hNumber = hymnResult.number;
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

export async function getHymnals(): Promise<Array<Hymnal> | string> {
  try {
    const availableHymnals: Array<Hymnal> = [];

    const hymnalsResult = await pb.collection("hymnals").getFullList({
      expand: 'language'
    });

    hymnalsResult.forEach(hymnalResult => {
      availableHymnals.push(
        new Hymnal(
          hymnalResult.id,
          hymnalResult.name,
          hymnalResult.expand?.language.landName,
        ));
    });

    return availableHymnals;
  } catch (error) {
    return `${error}`;
  }
}

