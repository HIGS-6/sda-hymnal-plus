// TODO: Add support for local database.

import PocketBase, { type RecordModel } from "pocketbase";
import { Hymn, Hymnal } from "$lib/models";

const LOCAL_API_URL = "http://127.0.0.1:8090";
const ONLINE_API_URL = "http://127.0.0.1:8090";

const pb = new PocketBase(LOCAL_API_URL);

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

  let hymn;
  if (number === result.originalHymnNumber) {
    hymn = await getHymn(result.equivalentHymnNumber, equivalentHymnal);
  } else {
    hymn = await getHymn(result.originalHymnNumber, equivalentHymnal);
  }

  return hymn;
}

export async function getEquivalentHymns(
  originalNumber: number,
  originalHymnal: Hymnal,
  targetHymnal: Hymnal,
): Promise<{ original: Hymn; equivalent: Hymn }> {
  const result = await pb.collection("hymn_equivalencies").getFirstListItem(
    `
    originalHymn.number=${originalNumber}&&originalHymnal="${originalHymnal.id}"&&equivalentHymnal="${targetHymnal.id}"||
    equivalentHymn.number=${originalNumber}&&equivalentHymnal="${originalHymnal.id}"&&originalHymnal="${targetHymnal.id}"
    `,
    {
      expand:
        "originalHymn.version, equivalentHymn.version, originalHymn.hymn_lyrics_via_hymn, equivalentHymn.hymn_lyrics_via_hymn",
    },
  );

  let originalHymn;
  let equivalentHymn;

  if (result.expand?.originalHymn.number === originalNumber) {
    const rawOriginal = result.expand?.originalHymn;
    originalHymn = new Hymn(
      rawOriginal.id,
      rawOriginal.title,
      rawOriginal.number,
      rawOriginal.expand?.hymn_lyrics_via_hymn.map((lyric: any) => ({
        context: lyric.context,
        content: lyric.content,
      })),
    );

    const rawEquivalent = result.expand?.equivalentHymn;
    equivalentHymn = new Hymn(
      rawEquivalent.id,
      rawEquivalent.title,
      rawEquivalent.number,
      rawEquivalent.expand?.hymn_lyrics_via_hymn.map((lyric: any) => ({
        context: lyric.context,
        content: lyric.content,
      })),
    );
  } else {
    const rawOriginal = result.expand?.equivalentHymn;
    originalHymn = new Hymn(
      rawOriginal.id,
      rawOriginal.title,
      rawOriginal.number,
      rawOriginal.expand?.hymn_lyrics_via_hymn.map((lyric: any) => ({
        context: lyric.context,
        content: lyric.content,
      })),
    );

    const rawEquivalent = result.expand?.originalHymn;
    equivalentHymn = new Hymn(
      rawEquivalent.id,
      rawEquivalent.title,
      rawEquivalent.number,
      rawEquivalent.expand?.hymn_lyrics_via_hymn.map((lyric: any) => ({
        context: lyric.context,
        content: lyric.content,
      })),
    );
  }

  return { original: originalHymn, equivalent: equivalentHymn };
}
