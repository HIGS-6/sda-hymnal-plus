import type { Hymnal } from "$lib/models";
import { modalMode, modalOpen } from "$lib/stores/appStore";

export function openModal() {
  modalOpen.set(true);
}

export function openChooseHymnalModal(callback: any) {
  modalOpen.set(true);
  modalMode.set(1);
}
