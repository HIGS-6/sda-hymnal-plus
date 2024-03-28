import { Hymn, Slide } from "./components/hymn-view";
import { writable } from "svelte/store";

// App
export let isReady = writable(false);
export let dualView = writable(false);

// Hymns
export let mainHymn = writable<Hymn>();
export let equivalentHymn = writable<Hymn>();

// Slides
export let mainHymnSlides = writable<Slide[]>();
export let equivalentHymnSlides = writable<Slide[]>();

export let mainHymnSlideIndex = writable(0);
export let equivalentHymnSlideIndex = writable(0);