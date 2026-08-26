import { http } from "./client";
import { PostDto, PostsResponse } from "./types";

export function getPosts(params: {
  skip: number;
  limit: number;
  search?: string;
}) {
  if (params.search) {
    return http.get<PostsResponse>("/posts/search", params);
  }
  return http.get<PostsResponse>("/posts", params);
}

export function getPost(id: number) {
  return http.get<PostDto>(`/posts/${id}`);
}

export function createPost(data: {
  title: string;
  body: string;
  tags: string[];
  userId: number;
}) {
  return http.post<PostDto>("/posts/add", { body: data });
}

export function updatePost(
  id: string,
  data: Partial<Pick<PostDto, "title" | "body" | "tags">>,
) {
  return http.put<PostDto>(`/posts/${id}`, { body: data });
}

export function deletePost(id: number) {
  return http.delete<{ id: number; isDeleted: boolean }>(`/posts/${id}`);
}
