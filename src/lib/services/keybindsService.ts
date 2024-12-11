import {
  getHymnEquivalencyFromHymn,
  getEquivalentHymns,
  getHymnFromNumber,
} from "./sdaApiService";
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

  const codeValue = event.code;
  const key = event.key;

  // Number Changed
  if (!Number.isNaN(parseInt(key))) {
    addNumber(key);
    return;
  }

  // Actula Keyboard Events
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
  // Hymnals
  const tempHymnal = get(primaryHymnal);
  primaryHymnal.set(get(secondaryHymnal));
  secondaryHymnal.set(tempHymnal);

  // Hymns
  const tempHymn = get(primaryHymn);
  primaryHymn.set(get(secondaryHymn));
  secondaryHymn.set(tempHymn);
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
  const pHymnal = get(primaryHymnal);
  if (!pHymnal) {
    // TODO: Add User Feedback
    console.error("No Hymnal Selected Error.");
    return;
  }

  const pHymn = get(primaryHymn);
  const sHymnal = get(secondaryHymnal);
  const multipleView = get(viewMode) >= 0;

  // Get Hymn Number
  const number = parseInt(get(hymnNumber));
  if (isNaN(number) || number <= 0 || number > 999) {
    // TODO: Add User Feedback
    console.error("Invalid Hymn Number Error.");
    // Reset Numbers Pressed
    hymnNumber.set("");
    return;
  }

  // No Primary Hymn | Single View Mode -> Only Get Primary Hymn
  if ((!pHymn && !multipleView) || (pHymn?.number != number && !multipleView)) {
    console.log("Finding Primary Hymn...");
    // Loading
    primaryHymnLoading.set(true);

    // Get Hymn
    try {
      const hymn = await getHymnFromNumber(number, pHymnal);
      primaryHymn.set(hymn);
      secondaryHymn.set(undefined);
    } catch (error) {
      console.error(`No Hymn Found:\n${error}`);
      // TODO: Add User Feedback
    }

    primaryHymnLoading.set(false);
  }
  // No Primary Hymn or Current Primary Hymn Number is different from new | Multiple View Mode -> Get Both Primary and Equivalent Hymn
  else if ((!pHymn || pHymn?.number !== number) && multipleView) {
    console.log("Finding Primary And Equivalent Hymn...");

    if (!sHymnal) {
      // TODO: Add User Feedback
      console.error("No Secondary Hymnal Selected Error.");
      return;
    }

    // Loading
    primaryHymnLoading.set(true);
    secondaryHymnLoading.set(true);

    try {
      // Get Both Primary and Equivalent Hymn from a single request
      const { originalHymn, equivalentHymn } = await getEquivalentHymns(
        number,
        pHymnal,
        sHymnal,
      );

      primaryHymn.set(originalHymn);
      secondaryHymn.set(equivalentHymn);
    } catch (error) {
      console.error(`No Hymn and/or Equivalent Hymn Found:\n${error}`);
      // TODO: Add User Feedback
    }

    primaryHymnLoading.set(false);
    secondaryHymnLoading.set(false);
  }
  // Re-entered the same Hymn Number
  else if (pHymn && pHymn.number === number) {
    console.error("Hymn Number is the same");
  }

  // Reset Numbers Pressed
  hymnNumber.set("");
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

export async function setHorizontalView() {
  if (get(viewMode) === 1) {
    viewMode.set(-1);
    return;
  }

  viewMode.set(1);

  // Get Equivalent Hymn Data
  const pHymn = get(primaryHymn);
  const sHymnal = get(secondaryHymnal);
  if (!get(secondaryHymn) && pHymn && sHymnal) {
    console.log("Enabled Horizontal View with an Hymn, loading equivalency...");
    secondaryHymnLoading.set(true);

    try {
      const equivalentHymn = await getHymnEquivalencyFromHymn(pHymn, sHymnal);

      secondaryHymn.set(equivalentHymn);
    } catch (error) {
      secondaryHymn.set(undefined);
    }

    secondaryHymnLoading.set(false);
  }
}

export async function setVerticalView() {
  if (get(viewMode) === 0) {
    viewMode.set(-1);
    return;
  }

  viewMode.set(0);

  // Get Equivalent Hymn Data
  const pHymn = get(primaryHymn);
  const sHymnal = get(secondaryHymnal);
  if (!get(secondaryHymn) && pHymn && sHymnal) {
    console.log("Enabled Vertical View with an Hymn, loading equivalency...");
    secondaryHymnLoading.set(true);

    try {
      const equivalentHymn = await getHymnEquivalencyFromHymn(pHymn, sHymnal);

      secondaryHymn.set(equivalentHymn);
    } catch (error) {
      secondaryHymn.set(undefined);
    }

    secondaryHymnLoading.set(false);
  }
}
