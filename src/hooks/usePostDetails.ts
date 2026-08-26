import { getPost } from "@/api/posts";
import { mapPost } from "@/api/types";
import { postKeys } from "@/constants/keys";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function usePostDetails(id: string) {
  const post = useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => getPost(id),
    staleTime: 60_000,
  });

  return post;
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
