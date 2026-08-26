import { Post } from "@/api/types";
import { View, Text, useColorScheme } from "react-native";
import clsx from "clsx";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { ThumbsDown, ThumbsUp } from "lucide-react-native";

const ReactionCount = ({ reactions }: { reactions: Post["reactions"] }) => {
  const theme = useColorScheme();
  const tap = Gesture.Tap()
    .onEnd((_event, success) => {})
    .runOnJS(true);

  return (
    <View className={clsx("flex-row rounded-full")}>
      <View className={styles.container}>
        <GestureDetector gesture={tap}>
          <View className={styles.reactionContainer}>
            <ThumbsDown
              size={16}
              color={theme === "dark" ? "white" : "black"}
            />
            <Text className={styles.reactionText}>{reactions?.dislikes}</Text>
          </View>
        </GestureDetector>
        <GestureDetector gesture={tap}>
          <View className={styles.reactionContainer}>
            <ThumbsUp size={16} color={theme === "dark" ? "white" : "black"} />
            <Text className={styles.reactionText}>{reactions?.likes}</Text>
          </View>
        </GestureDetector>
      </View>
    </View>
  );
};

const styles = {
  container:
    "flex-row mt-2 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full gap-3",
  reactionContainer:
    "rounded-full px-2 py-1 not-last:mr-2 flex-row items-center",
  reactionText: "ml-2 text-gray-500 font-bold dark:text-gray-300 text-sm",
};

export default ReactionCount;
