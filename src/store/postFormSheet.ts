import { Post } from "@/api/types";
import { create } from "zustand";

interface PostFormSheetState {
  isOpen: boolean;
  editingPost: Post | null;
  openForCreate: () => void;
  openForEdit: (post: Post) => void;
  close: () => void;
}

export const usePostFormSheetStore = create<PostFormSheetState>((set) => ({
  isOpen: false,
  editingPost: null,
  openForCreate: () => set({ isOpen: true, editingPost: null }),
  openForEdit: (post) => set({ isOpen: true, editingPost: post }),
  close: () => set({ isOpen: false }),
}));
