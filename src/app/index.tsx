import { Stack } from "expo-router";

import { View, FlatList, ActivityIndicator } from "react-native";

import { usePosts } from "@/hooks/usePosts";
import { useMemo } from "react";
import PostItem from "@/components/PostItem";
import { useQueryClient } from "@tanstack/react-query";
import ThemedView from "@/components/ThemedView";

export default function Home() {
  const { data, isFetching, isRefetching, refetch, fetchNextPage } =
    usePosts("");

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
      <ThemedView style={{ flex: 1, alignItems: "center" }}>
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          refreshing={isRefetching}
          onRefresh={onRefresh}
          className="pb-safe-offset-8"
          renderItem={({ item }) => <PostItem post={item} />}
          onEndReachedThreshold={0.5}
          onEndReached={onEndReached}
          scrollEventThrottle={16}
          ListFooterComponent={
            isFetching ? (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="my-4"
              />
            ) : null
          }
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = {
  container: "flex flex-1 items-center justify-end",
  buttonWrapper: "mx-4",
};
