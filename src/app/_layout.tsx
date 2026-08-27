import "../../global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useMemo } from "react";
import { useColorScheme } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PostFormSheet } from "@/components/PostFormSheet";

const queryClient = new QueryClient();

const styles: {
  [key: string]: {
    backgroundColor: string;
    headerTintColor: string;
    statusBarStyle: "light" | "dark";
  };
} = {
  dark: {
    backgroundColor: "#000",
    headerTintColor: "#fff",
    statusBarStyle: "light",
  },
  light: {
    backgroundColor: "#fff",
    headerTintColor: "#000",
    statusBarStyle: "dark",
  },
};

export default function Layout() {
  const theme = useColorScheme();

  const themeStyles = useMemo(() => {
    const scheme = theme === "unspecified" ? "light" : theme;
    return styles[scheme as keyof typeof styles] || styles.light;
  }, [theme]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <BottomSheetModalProvider>
            <Stack
              screenOptions={{
                headerStyle: {
                  backgroundColor: themeStyles.backgroundColor,
                },
                headerShadowVisible: false,
                headerTintColor: themeStyles.headerTintColor,
                headerTitleStyle: {
                  fontWeight: "bold",
                },
              }}
            />
            <PostFormSheet />
            <StatusBar style={themeStyles.statusBarStyle} />
          </BottomSheetModalProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
