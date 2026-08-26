import { http } from "./client";
import { CommentsPageDto } from "./types";

export async function getComments(postId: number): Promise<CommentsPageDto> {
  return http.get<CommentsPageDto>(`/comments/post/${postId}`);
}

export interface AddCommentInput {
  body: string;
  postId: number;
  userId: number;
}

export async function addComment(input: AddCommentInput) {
  return http.post<{
    id: number;
    body: string;
    postId: number;
    user: { id: number; username: string };
  }>("/comments/add", input);
}
