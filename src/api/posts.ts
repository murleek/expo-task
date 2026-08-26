import { apiClient } from "./client";
import { PostDto, PostsResponse } from "./types";

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

export function getPost(id: string) {
  return apiClient<PostDto>(`/posts/${id}`);
}

export function createPost(data: {
  title: string;
  body: string;
  tags: string[];
  userId: number;
}) {
  return apiClient<PostDto>("/posts/add", { method: "POST", body: data });
}

export function updatePost(
  id: string,
  data: Partial<Pick<PostDto, "title" | "body" | "tags">>,
) {
  return apiClient<PostDto>(`/posts/${id}`, { method: "PUT", body: data });
}

export function deletePost(id: string) {
  return apiClient<{ id: string; isDeleted: boolean }>(`/posts/${id}`, {
    method: "DELETE",
  });
}
