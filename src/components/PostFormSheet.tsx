import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Platform, Pressable, Text, KeyboardAvoidingView } from "react-native";
import BottomSheet, {
  BottomSheetTextInput,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import {
  useCreatePostMutation,
  useUpdatePostMutation,
} from "@/hooks/usePostMutations";
import { usePostFormSheetStore } from "@/store/postFormSheet";

const CURRENT_USER_ID = 1;

export function PostFormSheet() {
  const sheetRef = useRef<BottomSheet>(null);
  const { isOpen, editingPost, close } = usePostFormSheetStore();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  const createMutation = useCreatePostMutation();
  const updateMutation = useUpdatePostMutation();

  const snapPoints = useMemo(() => ["85%"], []);

  useEffect(() => {
    if (!isOpen) return sheetRef.current?.close();

    setTitle(editingPost?.title ?? "");
    setBody(editingPost?.body ?? "");
    setTagsInput(editingPost?.tags.join(", ") ?? "");

    sheetRef.current?.expand();
  }, [isOpen, editingPost]);

  const handleSubmit = useCallback(() => {
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (!title.trim() || !body.trim()) return;

    if (editingPost) {
      updateMutation.mutate({ id: editingPost.id, title, body, tags });
    } else {
      createMutation.mutate({ title, body, tags, userId: CURRENT_USER_ID });
    }
    close();
  }, [
    title,
    body,
    tagsInput,
    editingPost,
    createMutation,
    updateMutation,
    close,
  ]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        enableTouchThrough={true}
        pressBehavior="close"
      />
    ),
    [],
  );

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={close}
      backdropComponent={renderBackdrop}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
    >
      <BottomSheetScrollView className={styles.content}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="pb-safe-offset-2"
        >
          <Text className={styles.heading}>
            {editingPost ? "Edit Post" : "New Post"}
          </Text>

          <Text className={styles.label}>Title</Text>
          <BottomSheetTextInput
            value={title}
            onChangeText={setTitle}
            placeholder="My thoughts on React Native"
            className={styles.input}
          />

          <Text className={styles.label}>Body</Text>
          <BottomSheetTextInput
            value={body}
            onChangeText={setBody}
            placeholder="Some thoughts..."
            className={styles.input}
            style={{ minHeight: 100, textAlignVertical: "top" }}
            multiline
          />

          <Text className={styles.label}>Tags (comma-separated)</Text>
          <BottomSheetTextInput
            value={tagsInput}
            onChangeText={setTagsInput}
            placeholder="react, mobile"
            className={styles.input}
          />
          <Pressable className={styles.submit.button} onPress={handleSubmit}>
            <Text className={styles.submit.text}>
              {editingPost ? "Save" : "Publish"}
            </Text>
          </Pressable>
        </KeyboardAvoidingView>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = {
  content: "pb-6 px-4",
  heading: "text-xl font-bold mb-4",
  label: "text-sm mb-1 mt-3",
  input:
    "border border-gray-300 rounded-xl bg-white dark:bg-gray-800 px-4 py-2.75 flex-1 text-black placeholder:text-gray-500 dark:text-white",
  multiline: "min-h-25 text-top",
  submit: {
    button: "bg-blue-500 py-3 px-3 rounded-full mt-4 w-full",
    text: "text-white font-bold text-center",
  },
};
