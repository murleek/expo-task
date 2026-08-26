import { Post } from "@/api/types";
import { getJSON, setJSON } from ".";

const KEY = "posts-v1";

interface PostsState {
  created: Record<number, Post>;
  edited: Record<number, Partial<Post>>;
  deleted: number[];
  nextLocalId: number;
}

const defaultStore: PostsState = {
  created: {},
  edited: {},
  deleted: [],
  nextLocalId: -1,
};

const readStore = () => {
  return getJSON<typeof defaultStore>(KEY) ?? defaultStore;
};

const write = (store: typeof defaultStore) => {
  setJSON(KEY, store);
};

export const recordLocalPost = (post: Post) => {
  const state = readStore();
  const id = state.nextLocalId;
  const created: Post = { ...post, id, isLocalOnly: true };
  state.created[id] = created;
  state.nextLocalId -= 1;
  write(state);
  return created;
};

export function recordLocalEdit(id: number, patch: Partial<Post>): void {
  const state = readStore();
  if (id < 0 && state.created[id]) {
    state.created[id] = { ...state.created[id], ...patch };
  } else {
    state.edited[id] = { ...state.edited[id], ...patch };
  }
  write(state);
}

export function recordLocalDelete(id: number): void {
  const state = readStore();
  if (id < 0) {
    delete state.created[id];
  } else {
    state.deleted.push(id);
    delete state.edited[id];
  }
  write(state);
}

export function getLocalPosts(): Post[] {
  return Object.values(readStore().created);
}

export function getEditPatch(id: number): Partial<Post> | undefined {
  return readStore().edited[id];
}

export function isDeletedLocally(id: number): boolean {
  return readStore().deleted.includes(id);
}
