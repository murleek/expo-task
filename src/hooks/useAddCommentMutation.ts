import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addComment } from "@/api/comments";
import { Comment } from "@/api/types";
import { commentKeys } from "@/constants/keys";

let localCommentId = -1;

export function useAddCommentMutation(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      body: string;
      userId: number;
      authorName: string;
    }) => {
      await addComment({ body: input.body, postId, userId: input.userId });
      return input;
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: commentKeys.byPost(postId) });
      const snapshot = queryClient.getQueryData<Comment[]>(
        commentKeys.byPost(postId),
      );

      const optimistic: Comment = {
        id: localCommentId--,
        postId,
        body: input.body,
        authorName: input.authorName,
        isLocalOnly: true,
      };
      queryClient.setQueryData<Comment[]>(commentKeys.byPost(postId), (old) => [
        optimistic,
        ...(old ?? []),
      ]);

      return { snapshot };
    },
    onError: (_err, _input, ctx) => {
      console.error("onError", _err, _input);
      if (ctx)
        queryClient.setQueryData(commentKeys.byPost(postId), ctx.snapshot);
    },
  });
}
