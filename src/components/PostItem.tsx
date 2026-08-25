import { Post } from "@/api/types";
import { View, Text } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import ReactionCount from "./ReactionCount";

const PostItem = ({ post }: { post: Post }) => {
  return (
    <Pressable
      onPress={() => alert("Pressed!")}
      android_ripple={{ color: "#ccc" }}
      className={styles.pressable}
    >
      <View className={styles.container}>
        <Text className={styles.title}>{post.title}</Text>
        <Text className={styles.body}>{post.body}</Text>
        <View className={styles.tagsContainer}>
          {post.tags.map((tag) => (
            <Text key={tag} className={styles.tag}>
              #{tag}
            </Text>
          ))}
        </View>
        <ReactionCount post={post} />
      </View>
    </Pressable>
  );
};

const styles = {
  pressable: "bg-white dark:bg-black",
  container: "p-4 rounded-lg border-t border-gray-200 dark:border-gray-700",
  title: "text-lg font-bold mb-2 text-black dark:text-white",
  body: "text-gray-700 dark:text-gray-300 mb-2",
  tagsContainer: "flex flex-row flex-wrap",
  tag: "text-blue-300 dark:text-gray-200 py-1 mr-2 rounded-full text-sm font-semibold",
};

export default PostItem;
