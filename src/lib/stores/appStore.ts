import { getHymnals } from "$lib/services/sdaApiService";
import type { Hymn, Hymnal } from "$lib/models";
import { get, writable } from "svelte/store";

// Hymnals
export const availableHymnals = writable<Hymnal[] | undefined>();
export const primaryHymnal = writable<Hymnal | undefined>();
export const secondaryHymnal = writable<Hymnal | undefined>();

// Hymns
export const primaryHymn = writable<Hymn | undefined>();
export const secondaryHymn = writable<Hymn | undefined>();

// Settings
export const hymnNumber = writable<string>("");
export const viewMode = writable<number>(-1);
export const remoteControl = writable<boolean>(false);

// Hymn View
export const primarySlideIndex = writable<number>(0);
export const primaryHymnLoading = writable<boolean>(false);
export const secondaryHymnLoading = writable<boolean>(false);

// Modal
export const modalOpen = writable<boolean>(false);
export const modalMode = writable<number>(0);
