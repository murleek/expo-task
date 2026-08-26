import { getComments } from "@/api/comments";
import { mapComment } from "@/api/types";
import { commentKeys } from "@/constants/keys";
import { getLocalComments } from "@/storage/comments";
import { useQuery } from "@tanstack/react-query";
import { Comment } from "@/api/types";

export function useComments(postId: number) {
  return useQuery({
    queryKey: commentKeys.byPost(postId),
    queryFn: async () => {
      const page = await getComments(postId);
      return refactorComments(postId, page.comments.map(mapComment));
    },
    staleTime: 10_000,
  });
}

export const refactorComments = (postId: number, comments: Comment[]) => {
  const localComments = getLocalComments(postId);
  console.log("localComments", localComments);
  comments = [...localComments, ...comments];
  return comments;
};
