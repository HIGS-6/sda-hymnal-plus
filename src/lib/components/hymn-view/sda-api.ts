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

export async function getHymnals(): Promise<Hymnal[] | string> {
  try {
    const availableHymnals: Hymnal[] = [];

    const hymnalsResult = await pb.collection("hymnals").getFullList();

    hymnalsResult.forEach(hymnalResult => {
      availableHymnals.push(
        new Hymnal(
          hymnalResult.id,
          hymnalResult.name,
          hymnalResult.language,
        ));
    });

    return availableHymnals;
  } catch (error) {
    return `${error}`;
  }
}

export async function getHymnEquivalency(number: number, originalHymnal: Hymnal, equivalentHymnal: Hymnal): Promise<Hymn | string> {
  try {
    const result = await pb.collection("hymn_equivalencies").getFirstListItem(
      `originalHymnNumber=${number}&&originalVersion.id="${originalHymnal.id}"&&equivalentVersion.id="${equivalentHymnal.id}" || equivalentHymnNumber=${number}&&equivalentVersion.id="${originalHymnal.id}"&&originalVersion.id="${equivalentHymnal.id}"`
    );

    console.log(`Equivalent Hymn Fetched, Retrieving\n${result}`);

    let hymn;
    if (number === result.originalHymnNumber) {
      hymn = await getHymn(result.equivalentHymnNumber, equivalentHymnal);
    }
    else {
      hymn = await getHymn(result.originalHymnNumber, equivalentHymnal);
    }

    return hymn;
  } catch (e) {
    return `${e}`
  }
}
