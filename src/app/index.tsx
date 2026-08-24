import { Stack, Link } from "expo-router";

import { View, Text, FlatList } from "react-native";

import { Button } from "@/components/Button";
import { Container } from "@/components/Container";

export default function Home() {
  return (
    <View className={styles.container}>
      <Stack.Screen options={{ title: "Home" }} />
      <Container>
        <Text className="text-center mb-4">Welcome to the Expo Router!</Text>
      </Container>
    </View>
  );
}

const styles = {
  container: "flex flex-1 bg-white items-center justify-end dark:bg-black",
  buttonWrapper: "mx-4",
};
