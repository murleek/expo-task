import { memo } from "react";
import { Text } from "react-native";
import { Comment } from "../api/types";
import ThemedView from "./ThemedView";

const CommentItem = ({ comment }: { comment: Comment }) => {
  return (
    <ThemedView className={styles.container}>
      <ThemedView className="flex-row justify-between items-center mb-1">
        <Text className={styles.author}>@{comment.authorName}</Text>

        {comment.isLocalOnly ? <Text className={styles.local}>Local</Text> : ""}
      </ThemedView>
      <Text className={styles.body}>{comment.body}</Text>
    </ThemedView>
  );
};

const styles = {
  container:
    "border border-gray-300 dark:border-gray-700 rounded-xl p-3 py-2 mb-2",
  author: "font-semibold mb-1 text-gray-800 dark:text-gray-200",
  local:
    "text-blue-500 text-xs px-1.5 py-0.5 rounded-md border border-blue-500 bg-blue-100 dark:bg-blue-900",
  body: "text-gray-600 dark:text-gray-400",
};

export default memo(CommentItem);
