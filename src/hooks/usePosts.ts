import { useInfiniteQuery } from "@tanstack/react-query";
import { getPosts } from "@/api/posts";
import { mapPost, Post } from "@/api/types";
import { postKeys } from "@/constants/keys";
import { isDeletedLocally } from "@/storage/posts";

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
    select: (data) => ({
      pageParams: data.pageParams,
      pages: data.pages.map((page) => ({
        ...page,
        posts: refactorPosts(page.posts.map(mapPost)),
      })),
    }),
  });
}

export const refactorPosts = (posts: Post[]) => {
  // hide deleted posts from the feed
  posts = posts.filter((p) => !isDeletedLocally(p.id));
  return posts;
};
