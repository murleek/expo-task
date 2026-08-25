import { apiClient } from "./client";
import { Post, PostsResponse } from "./types";

export function getPosts(params: {
  skip: number;
  limit: number;
  search?: string;
}) {
  if (params.search) {
    return apiClient<PostsResponse>("/posts/search", {
      params: { q: params.search, skip: params.skip, limit: params.limit },
    });
  }
  return apiClient<PostsResponse>("/posts", { params });
}

export function getPost(id: number) {
  return apiClient<Post>(`/posts/${id}`);
}

export function createPost(data: {
  title: string;
  body: string;
  tags: string[];
  userId: number;
}) {
  return apiClient<Post>("/posts/add", { method: "POST", body: data });
}

export function updatePost(
  id: number,
  data: Partial<Pick<Post, "title" | "body" | "tags">>,
) {
  return apiClient<Post>(`/posts/${id}`, { method: "PUT", body: data });
}

export function deletePost(id: number) {
  return apiClient<Post & { isDeleted: boolean }>(`/posts/${id}`, {
    method: "DELETE",
  });
}
