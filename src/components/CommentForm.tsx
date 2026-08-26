import { Pressable, TextInput } from "react-native";
import ThemedText from "./ThemedText";
import ThemedView from "./ThemedView";
import { useState } from "react";

const CommentForm = ({ onSubmit }: { onSubmit: (comment: string) => void }) => {
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (comment.trim() === "") return;
    onSubmit(comment);
    setComment("");
  };

  return (
    <ThemedView className={styles.wrapper}>
      <TextInput
        value={comment}
        onChangeText={setComment}
        placeholder="Write a comment..."
        className={styles.input}
      />
      <Pressable
        onPress={handleSubmit}
        className={styles.button}
        android_ripple={{ color: "" }}
      >
        <ThemedText>Send</ThemedText>
      </Pressable>
    </ThemedView>
  );
};

const styles = {
  wrapper: "flex flex-row items-center gap-2 mt-2 mb-4",
  input:
    "border border-gray-300 rounded-xl px-3 py-2 flex-1 text-black placeholder:text-gray-500 dark:text-white",
  button: "bg-blue-500 py-2.5 px-4 rounded-xl",
};

export default CommentForm;
