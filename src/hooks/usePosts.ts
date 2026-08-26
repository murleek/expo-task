import { useInfiniteQuery } from "@tanstack/react-query";
import { getPosts } from "../api/posts";
import { postKeys } from "@/constants/keys";

const LIMIT = 20;

export function usePosts(search: string) {
  return useInfiniteQuery({
    queryKey: postKeys.list({ search }),
    queryFn: async ({ pageParam }) =>
      await getPosts({ skip: pageParam, limit: LIMIT, search }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit;
      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
    staleTime: 30_000,
  });
}
