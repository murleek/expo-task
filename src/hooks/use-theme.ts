/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useColorScheme } from "@/hooks/use-color-scheme";
import { ColorSchemeName } from "react-native";

export function useTheme(): ColorSchemeName {
  const scheme = useColorScheme();
  const theme = scheme === "unspecified" ? "light" : scheme;

  return theme;
}
