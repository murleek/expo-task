import { useMemo } from "react";
import { FlatList, ActivityIndicator, Pressable } from "react-native";
import { Stack } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";

import PostItem from "@/components/PostItem";
import ThemedView from "@/components/ThemedView";
import { usePosts } from "@/hooks/usePosts";
import { Plus } from "lucide-react-native";
import { usePostFormSheetStore } from "@/store/postFormSheet";

export default function Home() {
  const { data, isFetching, isRefetching, refetch, fetchNextPage } =
    usePosts("");

  const openForCreate = usePostFormSheetStore((s) => s.openForCreate);

  const queryClient = useQueryClient();

  const onRefresh = async () => {
    await refetch();
    queryClient.removeQueries({
      queryKey: ["posts", "infinite", { search: "" }],
    });
  };

  const onEndReached = async () => {
    if (!isFetching) {
      await fetchNextPage();
    }
  };

  const posts = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page.posts);
  }, [data]);

  return (
    <ThemedView className={styles.container}>
      <Stack.Screen options={{ title: "Feed" }} />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        refreshing={isRefetching}
        onRefresh={onRefresh}
        className="bg-white dark:bg-black"
        contentContainerClassName="pb-safe-offset-4"
        renderItem={({ item }) => <PostItem post={item} />}
        onEndReachedThreshold={0.5}
        onEndReached={onEndReached}
        scrollEventThrottle={16}
        ListFooterComponent={
          isFetching ? (
            <ThemedView className="flex-1 items-center justify-center">
              <ActivityIndicator
                size="large"
                color="#ffaaff"
                className="my-4"
              />
            </ThemedView>
          ) : null
        }
      />

      <Pressable
        className={styles.fab}
        onPress={() => {
          openForCreate();
        }}
      >
        <Plus size={24} color="#ffffff" strokeWidth={3} />
      </Pressable>
    </ThemedView>
  );
}

const styles = {
  container: "flex-1",
  buttonWrapper: "mx-4",
  fab: "absolute bottom-safe-offset-4 right-4 bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-lg bg-fuchsia-400 z-1",
};
