import { Comment } from "@/api/types";
import { getJSON, setJSON } from ".";

const KEY = "comments-v1";

interface CommentsState {
  created: Record<number, Comment>;
  nextLocalId: number;
}

const defaultStore: CommentsState = {
  created: {},
  nextLocalId: -1,
};

const readStore = () => {
  return getJSON<typeof defaultStore>(KEY) ?? defaultStore;
};

const write = (store: typeof defaultStore) => {
  setJSON(KEY, store);
};

export const recordLocalComment = (comment: Comment) => {
  const state = readStore();
  const id = state.nextLocalId;
  const created: Comment = { ...comment, id, isLocalOnly: true };
  state.created[id] = created;
  state.nextLocalId -= 1;
  write(state);
  return created;
};

export function getLocalComments(id: number): Comment[] {
  return Object.values(readStore().created || [])
    .filter((comment) => comment.postId === id)
    .sort((a, b) => a.id - b.id);
}
