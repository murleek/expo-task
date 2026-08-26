import clsx from "clsx";
import { View, ViewProps } from "react-native";

const ThemedView = ({ className, ...props }: ViewProps) => {
  return (
    <View className={clsx("bg-white, dark:bg-black", className)} {...props} />
  );
};

export default ThemedView;
