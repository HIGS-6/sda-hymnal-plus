import { getHymn, getHymnEquivalency } from "./sdaApiService";
import { get } from "svelte/store";
import {
  secondaryHymnLoading,
  primaryHymnLoading,
  primarySlideIndex,
  secondaryHymnal,
  secondaryHymn,
  primaryHymnal,
  primaryHymn,
  hymnNumber,
  viewMode,
} from "$lib/stores/appStore";

// keyboard event handler
export function handleKeyboardEvents(event: KeyboardEvent) {
  const target = event.target as HTMLElement; // Cast target to HTMLElement
  if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
    // Ignore key events when typing in input/textarea
    return;
  }

  // console.log(`Got Input: ${event.code}`);

  const codeValue = event.code;
  const key = event.key;

  // Number Changed
  if (!Number.isNaN(parseInt(key))) {
    addNumber(key);
    return;
  }

  switch (codeValue) {
    // Empty View
    case "Escape":
      resetView();
      break;
    // Delete Last Number
    case "Backspace":
      removeNumber();
      break;
    // Get Hymn
    case "Enter":
      findHymn();
      break;
    // Previous Slide
    case "ArrowLeft":
      previousSlide();
      break;
    // Next Slide
    case "ArrowRight":
      nextSlide();
      break;
    // Set Horizontal View
    case "KeyH":
      setHorizontalView();
      break;
    // Set Vertical View
    case "KeyV":
      setVerticalView();
      break;
    case "KeyS":
      swapHymnals();
      break;
  }
}

export function swapHymnals() {
  const temp = get(primaryHymnal);
  primaryHymnal.set(get(secondaryHymnal));
  secondaryHymnal.set(temp);
}

export function addNumber(newNumber: string) {
  hymnNumber.update((value) => value + newNumber);
}

export function removeNumber() {
  hymnNumber.update((value) => value.slice(0, -1));
}

export function resetView() {
  primaryHymn.set(undefined);
  secondaryHymn.set(undefined);
}

export async function findHymn() {
  if (get(primaryHymnLoading)) return;

  // Get Hymn Number
  const number = parseInt(get(hymnNumber));
  if (number <= 0) return;

  // Get Primary Hymnal
  const pHymnal = get(primaryHymnal);
  if (!pHymnal) return;

  // Get Primary Hymn Data
  primaryHymnLoading.set(true);
  try {
    const hymn = await getHymn(number, pHymnal);
    primaryHymn.set(hymn);
  } catch (error) {
    primaryHymn.set(undefined);
  }

  // DualView mode enabled
  if (get(viewMode) >= 0) {
    secondaryHymnLoading.set(true);
    const sHymnal = get(secondaryHymnal);
    // if (!sHymnal) continue;

    // Get Hymn Data
    try {
      const equivalentHymn = await getHymnEquivalency(
        number,
        pHymnal,
        sHymnal!,
      );
      secondaryHymn.set(equivalentHymn);
    } catch (error) {
      secondaryHymn.set(undefined);
    }
  }

  // Reset Numbers Pressed
  hymnNumber.set("");
  primaryHymnLoading.set(false);
  secondaryHymnLoading.set(false);
}

export function previousSlide() {
  if (get(primarySlideIndex) > 0) primarySlideIndex.update((val) => (val -= 1));
  if (get(viewMode) > 0) {
    // TODO: Equivalent Hymn Mode
  }
}

export function nextSlide() {
  const hymn = get(primaryHymn);
  if (!hymn) return;

  if (get(primarySlideIndex) + 1 < get(primaryHymn)!.slides.length)
    primarySlideIndex.update((val) => (val += 1));
  if (get(viewMode) > 0) {
    // TODO: Equivalent Hymn Mode
  }
}

export function setHorizontalView() {
  if (get(viewMode) === 1) {
    viewMode.set(-1);
    return;
  }

  viewMode.set(1);
  // TODO: Equivalent Hymn Mode
}

export function setVerticalView() {
  if (get(viewMode) === 0) {
    viewMode.set(-1);
    return;
  }

  viewMode.set(0);
  // TODO: Equivalent Hymn Mode
}
