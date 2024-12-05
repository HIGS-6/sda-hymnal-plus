// TODO: Add support for local database.

import PocketBase, { type RecordModel } from "pocketbase";
import { Hymn, Hymnal } from "$lib/models";

const pb = new PocketBase("https://sda-api.pockethost.io/");

export async function getHymn(number: number, hymnal: Hymnal): Promise<Hymn> {
  let lyricsRecord: RecordModel[];

  lyricsRecord = await pb.collection("hymn_lyrics").getFullList({
    filter: `hymn.number=${number}&&hymn.version="${hymnal.id}"`,
    expand: "hymn",
    sort: "context",
  });

  // Hymn Data
  const hymnLyrics = new Map<string, string>();
  const hymnId = lyricsRecord[0].expand!["hymn"].id;
  const hymnTitle = lyricsRecord[0].expand!["hymn"].title;
  const hymnNumber = lyricsRecord[0].expand!["hymn"].number;

  lyricsRecord.forEach((lyric) => {
    hymnLyrics.set(lyric.context, lyric.content);
  });

  return new Hymn(hymnId, hymnTitle, hymnNumber, hymnLyrics);
}

export async function getHymnals(): Promise<Hymnal[]> {
  const availableHymnals: Hymnal[] = [];

  const hymnalsResult = await pb.collection("hymnals").getFullList();
  hymnalsResult.forEach((hymnalResult) => {
    availableHymnals.push(
      new Hymnal(hymnalResult.id, hymnalResult.name, hymnalResult.language),
    );
  });

  return availableHymnals;
}

export async function getHymnEquivalency(
  number: number,
  originalHymnal: Hymnal,
  equivalentHymnal: Hymnal,
): Promise<Hymn> {
  const result = await pb
    .collection("hymn_equivalencies")
    .getFirstListItem(
      `originalHymnNumber=${number}&&originalVersion.id="${originalHymnal.id}"&&equivalentVersion.id="${equivalentHymnal.id}" || equivalentHymnNumber=${number}&&equivalentVersion.id="${originalHymnal.id}"&&originalVersion.id="${equivalentHymnal.id}"`,
    );

  console.log(`Equivalent Hymn Fetched, Retrieving\n${result}`);

  let hymn;
  if (number === result.originalHymnNumber) {
    hymn = await getHymn(result.equivalentHymnNumber, equivalentHymnal);
  } else {
    hymn = await getHymn(result.originalHymnNumber, equivalentHymnal);
  }

  return hymn;
}
