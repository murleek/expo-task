import clsx from "clsx";
import { Text, TextProps } from "react-native";

const ThemedText = ({ className, ...props }: TextProps) => {
  return (
    <Text
      className={clsx("text-black dark:text-white", className)}
      {...props}
    />
  );
};

export default ThemedText;
