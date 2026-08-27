import { useInfiniteQuery } from "@tanstack/react-query";
import { getPosts } from "@/api/posts";
import { mapPost, Post } from "@/api/types";
import { postKeys } from "@/constants/keys";
import { getEditPatch, getLocalPosts, isDeletedLocally } from "@/storage/posts";

const LIMIT = 20;

export function usePosts(search: string) {
  return useInfiniteQuery({
    queryKey: search ? postKeys.list({ search }) : postKeys.lists(),
    queryFn: async ({ pageParam }) => {
      const page = await getPosts({
        skip: pageParam,
        limit: LIMIT,
        q: search,
      });

      return {
        ...page,
        posts: refactorPosts(page.posts.map(mapPost), page.skip, search),
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit;
      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
    staleTime: 30_000,
  });
}

export const refactorPosts = (
  posts: Post[],
  pageSkip: number,
  search: string,
) => {
  const withoutDeleted = posts.filter((p) => !isDeletedLocally(p.id));
  const withLocalEdits = withoutDeleted.map((p) => {
    const patch = getEditPatch(p.id);
    if (patch) return { ...p, ...patch };
    return p;
  });

  if (pageSkip !== 0) return withLocalEdits;

  const localOnly = getLocalPosts()
    .map(mapPost)
    .filter((p) => !isDeletedLocally(p.id))
    .filter(
      (p) =>
        p.title.includes(search) ||
        p.body.includes(search) ||
        p.tags.some((t) => t.includes(search)),
    );
  return [...localOnly, ...withLocalEdits];
};
