import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { deletePost } from "@/api/posts";
import { PostsPageDto } from "@/api/types";
import { postKeys } from "@/constants/keys";
import { recordLocalDelete } from "@/storage/posts";

type FeedData = InfiniteData<PostsPageDto>;

export function useDeletePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await deletePost(id);
      recordLocalDelete(id);
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: postKeys.lists() });
      const snapshot = queryClient.getQueriesData<FeedData>({
        queryKey: postKeys.lists(),
      });

      queryClient.setQueriesData<FeedData>(
        { queryKey: postKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              posts: page.posts.filter((p) => p.id !== id),
            })),
          };
        },
      );

      return { snapshot };
    },
    onError: (_err, _id, ctx) => {
      if (ctx) {
        for (const [key, data] of ctx?.snapshot) {
          queryClient.setQueryData(key, data);
        }
      }
    },
    onSettled: (_data, _err, id) => {
      queryClient.removeQueries({ queryKey: postKeys.detail(id) });
    },
  });
}
