import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, TextInput, View } from "react-native";
import { Stack } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";
import PostItem from "@/components/PostItem";
import ThemedView from "@/components/ThemedView";
import { usePosts } from "@/hooks/usePosts";
import { Plus, Search, X } from "lucide-react-native";
import { usePostFormSheetStore } from "@/store/postFormSheet";
import { useDebounce } from "@/hooks/useDebounce";
import { preferences } from "@/storage/preferences";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState(preferences.getLastSearch());
  const [debouncedSearchQuery, forceDebounce] = useDebounce(searchQuery, 300);

  const { data, isFetching, isRefetching, refetch, fetchNextPage } =
    usePosts(debouncedSearchQuery);

  const openForCreate = usePostFormSheetStore((s) => s.openForCreate);

  const queryClient = useQueryClient();

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
    forceDebounce(text);
    preferences.setLastSearch(text);
  }, []);

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
      <FlashList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        refreshing={isRefetching}
        onRefresh={onRefresh}
        className="bg-white dark:bg-black"
        contentContainerClassName="pb-safe-offset-4 flex-0"
        renderItem={({ item }) => <PostItem post={item} />}
        onEndReachedThreshold={0.5}
        onEndReached={onEndReached}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <ThemedView className="px-4 py-2 flex-0">
            <TextInput
              placeholder="Search posts..."
              className={styles.searchInput}
              onChangeText={handleSearchChange}
              value={searchQuery}
            />
            <View className="absolute right-7 top-4">
              {searchQuery ? (
                <Pressable
                  onPress={() => {
                    setSearchQuery("");
                    preferences.setLastSearch("");
                  }}
                  hitSlop={8}
                  className="bg-white dark:bg-black rounded-full p-1"
                  android_ripple={{ color: "transparent", borderless: true }}
                >
                  <X size={20} color="#f20" />
                </Pressable>
              ) : (
                <View className="p-1">
                  <Search size={20} color="#888" />
                </View>
              )}
            </View>
          </ThemedView>
        }
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
  searchInput:
    "border border-gray-300 rounded-full bg-white dark:bg-gray-800 pl-4 pr-10 py-2.75 text-black placeholder:text-gray-500 dark:text-white",
};
