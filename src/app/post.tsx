import CommentForm from "@/components/CommentForm";
import CommentItem from "@/components/CommentItem";
import ReactionCount from "@/components/ReactionCount";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import { useAddCommentMutation } from "@/hooks/useAddCommentMutation";
import { useComments } from "@/hooks/useComments";
import { usePostDetails } from "@/hooks/usePostDetails";
import { clsx } from "clsx";
import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { useCallback, useMemo } from "react";
import {
  FlatList,
  Pressable,
  Text,
  View,
  useColorScheme,
  Alert,
} from "react-native";
import { Pencil, Trash } from "lucide-react-native";
import { useDeletePostMutation } from "@/hooks/usePostMutations";
import { usePostFormSheetStore } from "@/store/postFormSheet";

const CURRENT_USER_NAME = "you";

const PostDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const post = usePostDetails(Number(id));
  const comments = useComments(Number(id));
  const addComment = useAddCommentMutation(Number(id));
  const deletePost = useDeletePostMutation();
  const openForEdit = usePostFormSheetStore((s) => s.openForEdit);

  const theme = useColorScheme();

  const handleDelete = useCallback(() => {
    Alert.alert("Delete Post?", "This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deletePost.mutate(Number(id));
          navigation.goBack();
        },
      },
    ]);
  }, [deletePost, id, navigation]);

  const handleSubmitComment = useCallback(
    (comment: string) => {
      if (!comment.trim()) return;
      addComment.mutate({
        body: comment,
        userId: 1,
        authorName: CURRENT_USER_NAME,
      });
    },
    [addComment],
  );

  const headerTitle = useMemo(() => {
    if (post.error || (!post.isLoading && !post.data)) return "Error";
    if (Number(id) < 0) return `Local Post #${Math.abs(Number(id))}`;
    return `Post #${id}`;
  }, [post, id]);

  if (post.isLoading) {
    return (
      <ThemedView className="flex-1 p-4">
        <Stack.Screen
          options={{
            title: headerTitle,
          }}
        />
        <View className={clsx(styles.skeleton, "h-5 mb-2 ")} />
        <View className={clsx(styles.skeleton, "h-4 mb-4")} />
        <View className={clsx(styles.skeleton, "h-20 mb-4")} />
        <View className={clsx(styles.skeleton, "h-4 mb-4")} />
      </ThemedView>
    );
  }

  if (post.error || !post.data) {
    return (
      <ThemedView className="flex-1 p-4">
        <Stack.Screen
          options={{
            title: headerTitle,
          }}
        />
        <ThemedText>Error loading post.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView className={styles.container}>
      <Stack.Screen
        options={{
          title: headerTitle,
          headerRight: () => (
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => post.data && openForEdit(post.data)}
                className="rounded-full p-1.5"
                android_ripple={{ color: "", borderless: true }}
              >
                <ThemedText className="uppercase font-bold">
                  <Pencil
                    size={20}
                    color={theme === "dark" ? "white" : "black"}
                  />
                </ThemedText>
              </Pressable>
              <Pressable
                onPress={handleDelete}
                className="rounded-full p-1.5"
                android_ripple={{ color: "", borderless: true }}
              >
                <ThemedText className="uppercase font-bold">
                  <Trash
                    size={20}
                    color={theme === "dark" ? "white" : "black"}
                  />
                </ThemedText>
              </Pressable>
            </View>
          ),
        }}
      />

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
              Author #{post.data.authorId || 0}
            </ThemedText>
            <ThemedText className={styles.post.body}>
              {post.data.body}
            </ThemedText>
            <ThemedView className={styles.post.tagsContainer}>
              {post.data.tags.map((tag) => (
                <Text className={styles.post.tag} key={tag}>
                  #{tag}
                </Text>
              ))}
            </ThemedView>
            <ReactionCount reactions={post.data.reactions} />

            <View className={styles.hr} />

            <ThemedText className={styles.comments.title}>
              Comments{comments.data ? ` (${comments.data.length})` : ""}
            </ThemedText>

            {comments.isLoading && (
              <ThemedView className="mt-2">
                <View className={clsx(styles.skeleton, "h-16 mb-2")} />
                <View className={clsx(styles.skeleton, "h-16 mb-2")} />
                <View className={clsx(styles.skeleton, "h-16 mb-2")} />
                <View className={clsx(styles.skeleton, "h-16 mb-2")} />
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
      <CommentForm onSubmit={handleSubmitComment} />
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
    tagsContainer: "flex flex-row flex-wrap",
    tag: "text-blue-300 py-1 mr-2 rounded-full text-sm font-semibold",
  },
  hr: "h-[1px] my-2 mt-4 bg-gray-300 dark:bg-gray-700 rounded",
  list: {
    wrapper: "bg-white dark:bg-black flex-1",
    container: "pb-safe-offset-20 px-4",
  },
  comments: {
    title: "text-lg font-semibold py-2",
    item: {
      title: "font-semibold mb-1 text-gray-800 dark:text-gray-200",
      body: "text-gray-600 dark:text-gray-400",
    },
  },
};

export default PostDetailsScreen;
