export interface PostDto {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: { likes: number; dislikes: number };
  views: number;
  userId: number;
}

export interface CommentDto {
  id: number;
  body: string;
  postId: number;
  user: { id: number; username: string };
}

export interface CommentsPageDto {
  comments: CommentDto[];
  total: number;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: { likes: number; dislikes: number };
  authorId: number;
  authorName?: string;
  isLocalOnly?: boolean;
  isLocallyEdited?: boolean;
}

export type PostsResponse = {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
};

export type Comment = {
  id: number;
  body: string;
  postId: number;
  authorName: string;
  isLocalOnly?: boolean;
};

export type CommentsResponse = {
  comments: Comment[];
  total: number;
  skip: number;
  limit: number;
};

export function mapPost(dto: PostDto): Post {
  return {
    id: dto.id,
    title: dto.title,
    body: dto.body,
    tags: dto.tags ?? [],
    reactions: dto.reactions ?? { likes: 0, dislikes: 0 },
    authorId: dto.userId,
  };
}

export function mapComment(dto: CommentDto): Comment {
  return {
    id: dto.id,
    postId: dto.postId,
    body: dto.body,
    authorName: dto.user?.username ?? "unknown",
  };
}
