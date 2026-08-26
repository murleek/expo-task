import { getComments } from "@/api/comments";
import { mapComment } from "@/api/types";
import { commentKeys } from "@/constants/keys";
import { useQuery } from "@tanstack/react-query";

export function useComments(postId: string) {
  return useQuery({
    queryKey: commentKeys.byPost(postId),
    queryFn: async () => {
      const page = await getComments(postId);
      return page.comments.map(mapComment);
    },
    staleTime: 10_000,
  });
}
