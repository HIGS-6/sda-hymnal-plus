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
  // What's Hymn 100 from Hymnal "SDA Hymnal (1985)"  in the Spanish Hymnal "Himnario Adventista (2010)"? - 55
  try {
    const result = await pb.collection("hymn_equivalencies").getFirstListItem(
      `originalHymnNumber=${number}&&originalVersion="${originalHymnal.id}"&&
      equivalentVersion="${equivalentHymnal.id}"||equivalentHymnNumber=${number}&&
      equivalentVersion="${originalHymnal.id}"&&originalVersion="${equivalentHymnal.id}"
      `
    );


    let hymn = await getHymn(number === result.originalHymnNumber ? result.equivalentHymnNumber : number, number === result.originalHymnNumber ? equivalentHymnal : originalHymnal) as Hymn;
    console.log(`Equivalent Hymn is: ${hymn.title}`);

    return hymn;
  } catch (e) {
    return `${e}`
  }
}
