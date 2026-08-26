import { Post } from "@/api/types";
import { View, Text } from "react-native";
import clsx from "clsx";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const ReactionCount = ({ reactions }: { reactions: Post["reactions"] }) => {
  const tap = Gesture.Tap()
    .onEnd((_event, success) => {
      if (success) {
        alert("Reaction pressed!");
      }
    })
    .runOnJS(true);

  return (
    <View className={styles.container}>
      <GestureDetector gesture={tap}>
        <View className={styles.reactionContainer}>
          <Text className={clsx(styles.iconText, "text-emerald-500")}>+</Text>
          <Text className={styles.reactionText}>{reactions?.likes}</Text>
        </View>
      </GestureDetector>
      <GestureDetector gesture={tap}>
        <View className={styles.reactionContainer}>
          <Text className={clsx(styles.iconText, "text-red-500")}>-</Text>
          <Text className={styles.reactionText}>{reactions?.dislikes}</Text>
        </View>
      </GestureDetector>
    </View>
  );
};

const styles = {
  container: "flex-row items-center mt-2",
  reactionContainer:
    "bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1 mr-2 flex-row items-center",
  reactionText: "text-gray-400 dark:text-gray-300 text-sm",
  iconText: "text-xl leading-none mr-2",
};

export default ReactionCount;
