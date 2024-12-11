// TODO: Add support for local database.

import PocketBase, { type RecordModel } from "pocketbase";
import { Hymn, Hymnal } from "$lib/models";

const LOCAL_API_URL = "http://127.0.0.1:8090";
const ONLINE_API_URL = "https://sda-api.pockethost.io";

const pb = new PocketBase(LOCAL_API_URL);

/**
 * Returns a full list of all the available hymnals that are currently available.
 *
 * @returns Hymnal[].
 *
 * @throws {ClientResponseError}.
 */
export async function getAvailableHymnals(): Promise<Hymnal[]> {
  const hymnalsRecord = await pb.collection("hymnals").getFullList();
  const hymnals = hymnalsRecord.map(
    (hymnalRecord) =>
      new Hymnal(hymnalRecord.id, hymnalRecord.name, hymnalRecord.language),
  );

  return hymnals;
}

/**
 * Returns an hymn that matches the given number and hymnal if there is one.
 *
 * @param {number} number - The Hymn number.
 * @param {Hymnal} hymnal - The Hymn Hymnal.
 *
 * @returns Hymn object.
 *
 * @throws {ClientResponseError}.
 */
export async function getHymnFromNumber(
  number: number,
  hymnal: Hymnal,
): Promise<Hymn> {
  const hymnRecord = await pb
    .collection("hymns")
    .getFirstListItem(`number = ${number} && version = "${hymnal.id}"`, {
      expand: "hymn_lyrics_via_hymn",
    });

  // Hymn Lyrics
  const hymnLyrics = new Map(
    hymnRecord.expand?.hymn_lyrics_via_hymn.map((lyric: any) => [
      lyric.context,
      lyric.content,
    ]),
  );

  // Hymn Data
  const hymn = new Hymn(
    hymnRecord.id,
    hymnRecord.title,
    hymnRecord.number,
    hymnLyrics as Map<string, string>,
    hymnRecord.version,
  );

  return hymn;
}

/**
 * Returns an hymn that matches the given number and hymnal if there is one.
 *
 * @param {Hymn} originalHymn - The Hymn number.
 * @param {Hymnal} targetHymnal - The Hymnal in which the equivalency tries to find.
 *
 * @returns a Hymn object.
 *
 * @throws {ClientResponseError}.
 */
export async function getHymnEquivalencyFromHymn(
  originalHymn: Hymn,
  targetHymnal: Hymnal,
): Promise<Hymn> {
  const equivalencyRecord = await pb
    .collection("better_hymn_equivalencies")
    .getFirstListItem(
      `
    originalHymn.number=${originalHymn.number}&&originalHymn.version="${originalHymn.hymnal}"&&equivalentHymn.version="${targetHymnal.id}"||
    equivalentHymn.number=${originalHymn.number}&&equivalentHymn.version="${originalHymn.hymnal}"&&originalHymn.version="${targetHymnal.id}"
    `,
      {
        expand:
          "equivalentHymn.hymn_lyrics_via_hymn,originalHymn.hymn_lyrics_via_hymn",
      },
    );

  let equivalentHymnRecord;
  if (originalHymn.number === equivalencyRecord.expand?.originalHymn.number) {
    equivalentHymnRecord = equivalencyRecord.expand?.equivalentHymn;
  } else {
    equivalentHymnRecord = equivalencyRecord.expand?.originalHymn;
  }

  const equivalentHymnLyricsRecord =
    equivalentHymnRecord.expand?.hymn_lyrics_via_hymn;

  const hymnLyrics = new Map(
    equivalentHymnLyricsRecord.map((lyric: any) => [
      lyric.context,
      lyric.content,
    ]),
  );

  const equivalentHymn = new Hymn(
    equivalentHymnRecord.id,
    equivalentHymnRecord.title,
    equivalentHymnRecord.number,
    hymnLyrics as Map<string, string>,
    equivalentHymnRecord.version,
  );

  return equivalentHymn;
}

/**
 * Returns an hymn that matches the given number and hymnal if there is one.
 *
 * @param {Hymn} originalHymnNumber - The Original Hymn number.
 * @param {Hymnal} originalHymnHymnal - The Original Hymnal.
 * @param {Hymnal} targetHymnal - The Hymnal in which the equivalency tries to find.
 *
 * @returns a Hymn object.
 *
 * @throws {ClientResponseError}.
 */
export async function getHymnEquivalencyFromNumber(
  originalHymnNumber: number,
  originalHymnHymnal: Hymnal,
  targetHymnal: Hymnal,
): Promise<Hymn> {
  const equivalencyRecord = await pb
    .collection("better_hymn_equivalencies")
    .getFirstListItem(
      `
    originalHymn.number=${originalHymnNumber}&&originalHymn.version="${originalHymnHymnal.id}"&&equivalentHymn.version="${targetHymnal.id}"||
    equivalentHymn.number=${originalHymnNumber}&&equivalentHymn.version="${originalHymnHymnal.id}"&&originalHymn.version="${targetHymnal.id}"
    `,
      {
        expand:
          "equivalentHymn.hymn_lyrics_via_hymn,originalHymn.hymn_lyrics_via_hymn",
      },
    );

  let equivalentHymnRecord;
  if (originalHymnNumber === equivalencyRecord.expand?.originalHymn.number) {
    equivalentHymnRecord = equivalencyRecord.expand?.equivalentHymn;
  } else {
    equivalentHymnRecord = equivalencyRecord.expand?.originalHymn;
  }

  const equivalentHymnLyricsRecord =
    equivalentHymnRecord.expand?.hymn_lyrics_via_hymn;

  const hymnLyrics = new Map(
    equivalentHymnLyricsRecord.map((lyric: any) => [
      lyric.context,
      lyric.content,
    ]),
  );

  const equivalentHymn = new Hymn(
    equivalentHymnRecord.id,
    equivalentHymnRecord.title,
    equivalentHymnRecord.number,
    hymnLyrics as Map<string, string>,
    equivalentHymnRecord.version,
  );

  return equivalentHymn;
}

/**
 * Returns an hymn that matches the given number and hymnal if there is one.
 *
 * @param {Hymn} originalHymnNumber - The Original Hymn number.
 * @param {Hymnal} targetHymnal - The Hymnal in which the equivalency tries to find.
 *
 * @returns a Hymn object.
 *
 * @throws {ClientResponseError}.
 */
export async function getEquivalentHymns(
  originalHymnNumber: number,
  originalHymnal: Hymnal,
  targetHymnal: Hymnal,
): Promise<{
  originalHymn: Hymn | undefined;
  equivalentHymn: Hymn | undefined;
}> {
  const results = await Promise.allSettled([
    getHymnFromNumber(originalHymnNumber, originalHymnal),
    getHymnEquivalencyFromNumber(
      originalHymnNumber,
      originalHymnal,
      targetHymnal,
    ),
  ]);

  console.log(results);

  const originalHymn =
    results[0].status === "fulfilled" ? results[0].value : undefined;
  const equivalentHymn =
    results[1].status === "fulfilled" ? results[1].value : undefined;

  return {
    originalHymn: originalHymn,
    equivalentHymn: equivalentHymn,
  };
}
