export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (filters: { search: string }) =>
    filters ? ([...postKeys.lists(), filters] as const) : postKeys.lists(),
  detail: (id: number) => [...postKeys.all, "detail", id] as const,
};

export const commentKeys = {
  all: ["comments"] as const,
  byPost: (postId: number) => [...commentKeys.all, "post", postId] as const,
};
