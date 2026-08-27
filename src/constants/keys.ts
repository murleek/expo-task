export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (filters: { search: string }) =>
    filters ? ([...postKeys.lists(), filters] as const) : postKeys.lists(),
  details: () => [...postKeys.all, "detail"] as const,
  detail: (id: number) => [...postKeys.details(), id] as const,
};

export const commentKeys = {
  all: ["comments"] as const,
  byPost: (postId: number) => [...commentKeys.all, "post", postId] as const,
};
