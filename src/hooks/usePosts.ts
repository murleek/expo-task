import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getPost, getPosts } from "../api/posts";
import { postKeys } from "@/constants/keys";

const LIMIT = 5;

export function usePosts(search: string) {
  return useInfiniteQuery({
    queryKey: postKeys.list({ search }),
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
