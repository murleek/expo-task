import { View } from "react-native";

import { Stack, useLocalSearchParams } from "expo-router";

export default function Details() {
  return (
    <View className={styles.container}>
      <Stack.Screen options={{ title: "Details" }} />
    </View>
  );
}

const styles = {
  container: "flex flex-1 bg-white",
};
