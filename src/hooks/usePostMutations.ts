import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createPost, deletePost, updatePost } from "@/api/posts";
import { Post, PostDto, PostsPageDto } from "@/api/types";
import { postKeys } from "@/constants/keys";
import {
  recordLocalDelete,
  recordLocalEdit,
  recordLocalPost,
} from "@/storage/posts";

type FeedData = InfiniteData<PostsPageDto>;

export function useCreatePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      title: string;
      body: string;
      tags: string[];
      userId: number;
    }) => {
      await createPost(input);
      return recordLocalPost({
        ...input,
        userId: input.userId,
        reactions: { likes: 0, dislikes: 0 },
        views: 0,
      });
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: postKeys.lists() });
      const snapshot = queryClient.getQueriesData<FeedData>({
        queryKey: postKeys.lists(),
      });

      const optimisticPost: PostDto = {
        id: Number.MIN_SAFE_INTEGER,
        title: input.title,
        body: input.body,
        tags: input.tags,
        reactions: {
          likes: 0,
          dislikes: 0,
        },
        userId: input.userId,
        views: 0,
      };

      queryClient.setQueriesData<FeedData>(
        { queryKey: postKeys.lists() },
        (old) => {
          if (!old) return old;
          const [first, ...rest] = old.pages;
          if (!first) return old;
          return {
            ...old,
            pages: [
              { ...first, posts: [optimisticPost, ...first.posts] },
              ...rest,
            ],
          };
        },
      );

      return { snapshot };
    },
    onError: (_err, _input, ctx) => {
      if (ctx)
        for (const [key, data] of ctx?.snapshot) {
          queryClient.setQueryData(key, data);
        }
    },
    onSuccess: (createdPost) => {
      queryClient.setQueriesData<FeedData>(
        { queryKey: postKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              posts: page.posts.map((p) =>
                p.id === Number.MIN_SAFE_INTEGER ? createdPost : p,
              ),
            })),
          };
        },
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.details() });
    },
  });
}

export function useUpdatePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      id: number;
      title: string;
      body: string;
      tags: string[];
    }) => {
      if (input.id >= 0) {
        await updatePost(input);
      }
      recordLocalEdit(input.id, {
        title: input.title,
        body: input.body,
        tags: input.tags,
      });
      return input;
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: postKeys.all });
      const feedSnapshot = queryClient.getQueriesData<FeedData>({
        queryKey: postKeys.lists(),
      });
      const detailSnapshot = queryClient.getQueryData<Post>(
        postKeys.detail(input.id),
      );

      const patch = {
        title: input.title,
        body: input.body,
        tags: input.tags,
        isLocallyEdited: true,
      };

      queryClient.setQueriesData<FeedData>(
        { queryKey: postKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              posts: page.posts.map((p) =>
                p.id === input.id ? { ...p, ...patch } : p,
              ),
            })),
          };
        },
      );
      queryClient.setQueryData<Post>(postKeys.detail(input.id), (old) =>
        old ? { ...old, ...patch } : old,
      );

      return { feedSnapshot, detailSnapshot };
    },
    onError: (_err, input, ctx) => {
      if (!ctx) return;
      for (const [key, data] of ctx.feedSnapshot) {
        queryClient.setQueryData(key, data);
      }
      queryClient.setQueryData(postKeys.detail(input.id), ctx.detailSnapshot);
    },
    onSettled: (_data, _err, input) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(input.id) });
    },
  });
}

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
