import { Post } from "@/api/types";
import { Pressable } from "react-native-gesture-handler";
import ReactionCount from "./ReactionCount";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { prefetchPostDetails } from "@/hooks/usePostDetails";
import ThemedView from "./ThemedView";
import ThemedText from "./ThemedText";

const PostItem = ({ post }: { post: Post }) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const handlePress = useCallback(
    (id: string) => {
      prefetchPostDetails(queryClient, id);
      router.navigate({
        pathname: "/post",
        params: { id },
      });
    },
    [router, queryClient],
  );

  return (
    <Pressable
      onPress={handlePress.bind(null, post.id.toString())}
      android_ripple={{ color: "#ccc" }}
      className={styles.pressable}
    >
      <ThemedView className={styles.container}>
        <ThemedText className={styles.title}>{post.title}</ThemedText>
        <ThemedText className={styles.body}>{post.body}</ThemedText>
        <ThemedView className={styles.tagsContainer}>
          {post.tags.map((tag) => (
            <ThemedText key={tag} className={styles.tag}>
              #{tag}
            </ThemedText>
          ))}
        </ThemedView>
        <ReactionCount reactions={post.reactions} />
      </ThemedView>
    </Pressable>
  );
};

const styles = {
  pressable: "bg-white dark:bg-black",
  container: "p-4 rounded-lg border-t border-gray-200 dark:border-gray-700",
  title: "text-lg font-bold mb-2 text-black dark:text-white",
  body: "text-gray-700 dark:text-gray-300 mb-2",
  tagsContainer: "flex flex-row flex-wrap",
  tag: "text-blue-300 mr-2 rounded-full text-sm font-semibold",
};

export default PostItem;
