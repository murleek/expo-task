import { getPost } from "@/api/posts";
import { mapPost, Post, PostsPageDto } from "@/api/types";
import { postKeys } from "@/constants/keys";
import { getEditPatch, getLocalPosts } from "@/storage/posts";
import { InfiniteData, useQuery, useQueryClient } from "@tanstack/react-query";

export function usePostDetails(id: number) {
  const queryClient = useQueryClient();

  const post = useQuery({
    queryKey: postKeys.detail(id),
    queryFn: async () => {
      if (id < 0) return findPostInFeedCache(queryClient, Number(id));
      return mapPost(await getPost(id));
    },
    staleTime: 5 * 60_000,
    initialData: () => findPostInFeedCache(queryClient, Number(id)),
    initialDataUpdatedAt: () =>
      queryClient.getQueryState(postKeys.lists())?.dataUpdatedAt,
    select: (post) => (post ? refactorPost(post) : post),
  });

  return post;
}

function findPostInFeedCache(
  queryClient: ReturnType<typeof useQueryClient>,
  postId: number,
): Post | undefined {
  const localPost = getLocalPosts().find((p) => p.id === postId);
  if (localPost) return mapPost(localPost);

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
  id: number,
) {
  queryClient.query({
    queryKey: postKeys.detail(id),
    queryFn: async () => {
      if (id < 0) return findPostInFeedCache(queryClient, Number(id));
      return mapPost(await getPost(id));
    },
    staleTime: 5 * 60_000,
  });
}

export function refactorPost(post: Post): Post {
  const patch = getEditPatch(post.id);
  return patch ? { ...post, ...patch, isLocallyEdited: true } : post;
}
