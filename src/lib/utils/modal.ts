import {
  modalBody,
  modalIsPrimaryHymnal,
  modalMode,
  modalOpen,
  modalTitle,
} from "$lib/stores/appStore";

export function closeModal() {
  modalOpen.set(false);
}

export function openModal(title: string, body: string) {
  modalTitle.set(title);
  modalBody.set(body);
  modalOpen.set(true);
  modalMode.set(0);
}

export function openChooseHymnalModal(title: string, isPrimaryHymnal: boolean) {
  modalIsPrimaryHymnal.set(isPrimaryHymnal);
  modalTitle.set(title);
  modalOpen.set(true);
  modalMode.set(1);
}
