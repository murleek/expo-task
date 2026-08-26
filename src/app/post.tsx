import { addComment } from "@/api/comments";
import CommentItem from "@/components/CommentItem";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import { useComments } from "@/hooks/useComments";
import { usePostDetails } from "@/hooks/usePostDetails";
import { clsx } from "clsx";
import { Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, TextInput, Text, View } from "react-native";

const PostDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const post = usePostDetails(id);
  const comments = useComments(id);
  const [commentDraft, setCommentDraft] = useState("");

  const handleSubmitComment = useCallback(() => {
    if (!commentDraft.trim()) return;
    // addComment.mutate({
    //   body: commentDraft,
    //   userId: 1,
    //   authorName: CURRENT_USER_NAME,
    // });
    setCommentDraft("");
  }, [commentDraft, addComment]);

  if (post.isLoading) {
    return (
      <ThemedView className="flex-1 p-4">
        <View className="bg-gray-300 h-5 rounded-md mb-2 animate-pulse dark:bg-gray-800" />
        <View className="bg-gray-300 h-4 rounded-md mb-4 animate-pulse dark:bg-gray-800" />
        <View className="bg-gray-300 h-20 rounded-md mb-4 animate-pulse dark:bg-gray-800" />
        <View className="bg-gray-300 h-4 rounded-md mb-4 animate-pulse dark:bg-gray-800" />
      </ThemedView>
    );
  }

  if (post.error || !post.data) {
    return (
      <ThemedView className="flex-1 p-4">
        <ThemedText>Error loading post.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView className={styles.container}>
      <Stack.Screen options={{ title: `Post #${id}` }} />

      <FlatList
        className={styles.list.wrapper}
        contentContainerClassName={styles.list.container}
        data={comments.data ?? []}
        keyExtractor={(c) => String(c.id)}
        renderItem={({ item }) => <CommentItem comment={item} />}
        ListHeaderComponent={
          <ThemedView>
            <ThemedText className={styles.post.title}>
              {post.data.title}
            </ThemedText>
            <ThemedText className={styles.post.author}>
              Author #{post.data.userId || 0}
            </ThemedText>
            <ThemedText className={styles.post.body}>
              {post.data.body}
            </ThemedText>
            <ThemedView className={styles.post.tagsContainer}>
              {post.data.tags.map((tag) => (
                <Text className={styles.post.tag}>#{tag}</Text>
              ))}
            </ThemedView>

            <View className={styles.hr} />
            <ThemedText className={styles.comments.title}>
              Comments{comments.data ? ` (${comments.data.length})` : ""}
            </ThemedText>

            <ThemedView className={styles.comments.form.wrapper}>
              <TextInput
                value={commentDraft}
                onChangeText={setCommentDraft}
                placeholder="Write a comment..."

                className={styles.comments.form.input}

                onSubmitEditing={handleSubmitComment}
              />
              <Pressable
                className={styles.comments.form.button}
                onPress={handleSubmitComment}
              >
                <ThemedText>Send</ThemedText>
              </Pressable>
            </ThemedView>
            {comments.isLoading && (
              <ThemedView className="mt-2">
                <View className={clsx(styles.skeleton, "h-8 mb-2")} />
                <View className={clsx(styles.skeleton, "h-8 mb-2")} />
                <View className={clsx(styles.skeleton, "h-8 mb-2")} />
                <View className={clsx(styles.skeleton, "h-8 mb-2")} />
              </ThemedView>
            )}
          </ThemedView>
        }
        ListEmptyComponent={
          !comments.isLoading ? (
            <ThemedText>No comments yet.</ThemedText>
          ) : undefined
        }
      />
    </ThemedView>
  );
};

const styles = {
  container: "flex-1",
  skeleton: "bg-gray-200 rounded-md animate-pulse dark:bg-gray-800",
  post: {
    title: "text-2xl font-bold",
    author: "text-sm text-gray-600 dark:text-gray-400 mb-2",
    body: "text-gray-800 dark:text-gray-200 mb-2",
    tagsContainer: "flex flex-row flex-wrap mb-2",
    tag: "text-blue-300 py-1 mr-2 rounded-full text-sm font-semibold",
  },
  hr: "h-[1px] my-2 bg-gray-300 dark:bg-gray-700 rounded",
  list: {
    wrapper: "bg-white dark:bg-black flex-1",
    container: "pb-safe-offset-6 px-4",
  },
  comments: {
    title: "text-lg font-semibold",
    form: {
      wrapper: "flex flex-row items-center gap-2 mt-2 mb-4",
      input:
        "border border-gray-300 rounded-xl px-3 py-2 flex-1 text-black placeholder:text-gray-500 dark:text-white",
      button: "bg-blue-500 py-2.5 px-4 rounded-xl",
    },
    item: {
      title: "font-semibold mb-1 text-gray-800 dark:text-gray-200",
      body: "text-gray-600 dark:text-gray-400",
    },
  },
};

export default PostDetailsScreen;
