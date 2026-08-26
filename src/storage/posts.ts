import { Post } from "@/api/types";
import { getJSON, setJSON } from ".";

const KEY = "posts-v1";

interface PostState {
  deleted: number[];
}

const defaultStore: PostState = {
  deleted: [],
};

const readStore = () => {
  return getJSON<typeof defaultStore>(KEY) ?? defaultStore;
};

const write = (store: typeof defaultStore) => {
  setJSON(KEY, store);
};

export function recordLocalDelete(id: number): void {
  const state = readStore();
  state.deleted.push(id);
  write(state);
}

export const postsStorage = {
  readStore,
  recordLocalDelete,
};
