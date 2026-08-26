import { Pressable, TextInput } from "react-native";
import ThemedView from "./ThemedView";
import { useState } from "react";
import { ArrowUp } from "lucide-react-native";

const CommentForm = ({ onSubmit }: { onSubmit: (comment: string) => void }) => {
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (comment.trim() === "") return;
    onSubmit(comment);
    setComment("");
  };

  return (
    <>
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
          android_ripple={{ color: "", radius: 20, borderless: true }}
        >
          <ArrowUp size={20} color="white" />
        </Pressable>
      </ThemedView>
    </>
  );
};

const styles = {
  wrapper:
    "flex flex-row items-center gap-2 mt-2 mb-4 absolute bottom-safe-offset-2 px-4 z-1",
  input:
    "border border-gray-300 rounded-full bg-white dark:bg-gray-800 px-4 py-2.75 flex-1 text-black placeholder:text-gray-500 dark:text-white",
  button: "bg-blue-500 py-3 px-3 rounded-full",
};

export default CommentForm;
