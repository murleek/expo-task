export const postKeys = {
  all: ["posts"] as const,
  list: (filters: { search: string }) =>
    [...postKeys.all, "list", filters] as const,
  detail: (id: string) => [...postKeys.all, "detail", id] as const,
};
