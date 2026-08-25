import { useInfiniteQuery } from "@tanstack/react-query";
import { getPosts } from "../api/posts";

const LIMIT = 5;

export function usePosts(search: string) {
  const queryKey = ["posts", "infinite", { search }];

  return useInfiniteQuery({
    queryKey: ["posts", "infinite", { search }],
    queryFn: ({ pageParam = 0 }) =>
      getPosts({ skip: pageParam, limit: LIMIT, search }),
    getNextPageParam: (lastPage) =>
      lastPage.skip + lastPage.limit < lastPage.total
        ? lastPage.skip + lastPage.limit
        : undefined,
    staleTime: 60_000,
    initialPageParam: 0,
  });
}
