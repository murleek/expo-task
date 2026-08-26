export const postKeys = {
  all: ["posts"] as const,
  list: (filters: { search: string }) =>
    [...postKeys.all, "list", filters] as const,
  detail: (id: string) => [...postKeys.all, "detail", id] as const,
};

export const commentKeys = {
  all: ["comments"] as const,
  byPost: (postId: string) => [...commentKeys.all, "post", postId] as const,
};
