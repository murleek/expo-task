import { getPost } from "@/api/posts";
import { mapPost, Post, PostsPageDto } from "@/api/types";
import { postKeys } from "@/constants/keys";
import { InfiniteData, useQuery, useQueryClient } from "@tanstack/react-query";

export function usePostDetails(id: string) {
  const queryClient = useQueryClient();

  const post = useQuery({
    queryKey: postKeys.detail(id),
    queryFn: async () => mapPost(await getPost(id)),
    staleTime: 5 * 60_000,
    initialData: () => findPostInFeedCache(queryClient, Number(id)),
    initialDataUpdatedAt: () =>
      queryClient.getQueryState(postKeys.lists())?.dataUpdatedAt,
  });

  return post;
}

function findPostInFeedCache(
  queryClient: ReturnType<typeof useQueryClient>,
  postId: number,
): Post | undefined {
  const cachedLists = queryClient.getQueriesData<InfiniteData<PostsPageDto>>({
    queryKey: postKeys.lists(),
  });
  for (const [, data] of cachedLists) {
    for (const page of data?.pages ?? []) {
      const hit = page.posts.find((p) => p.id === postId);
      if (hit) return mapPost(hit);
    }
  }
  return undefined;
}

export function prefetchPostDetails(
  queryClient: ReturnType<typeof useQueryClient>,
  id: string,
) {
  queryClient.query({
    queryKey: postKeys.detail(id),
    queryFn: async () => mapPost(await getPost(id)),
    staleTime: 5 * 60_000,
  });
}
