import ReactionCount from "@/components/ReactionCount";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import { usePostDetails } from "@/hooks/usePostDetails";
import { Stack, useLocalSearchParams } from "expo-router";

const PostDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: post, isLoading, error } = usePostDetails(id);

  if (isLoading) {
    return <ThemedText>Loading...</ThemedText>;
  }

  if (error || !post) {
    return <ThemedText>Error loading post.</ThemedText>;
  }

  return (
    <ThemedView className="flex-1 p-4">
      <Stack.Screen options={{ title: `Post #${id}` }} />
      <ThemedText className="text-2xl font-bold mb-3">{post.title}</ThemedText>
      <ThemedText className="text-gray-700 dark:text-gray-300">
        {post.body}
      </ThemedText>
      <ReactionCount post={post} />
    </ThemedView>
  );
};

export default PostDetailsScreen;
