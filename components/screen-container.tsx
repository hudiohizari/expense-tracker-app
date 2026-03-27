import { View, type ViewProps, KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets, type Edge } from "react-native-safe-area-context";
import { cn } from "@/lib/utils";

export interface ScreenContainerProps extends ViewProps {
  /**
   * SafeArea edges to apply. Defaults to ["top", "left", "right"].
   * Bottom is typically handled by Tab Bar.
   */
  edges?: Edge[];
  /**
   * Tailwind className for the content area.
   */
  className?: string;
  /**
   * Additional className for the outer container (background layer).
   */
  containerClassName?: string;
  /**
   * Additional className for the inner container (content layer).
   */
  safeAreaClassName?: string;
  /**
   * Whether to wrap the content in a KeyboardAvoidingView.
   */
  keyboardAvoiding?: boolean;
}

/**
 * A container component that properly handles SafeArea and background colors.
 *
 * The outer View extends to full screen (including status bar area) with the background color,
 * while the inner View ensures content is within safe bounds using useSafeAreaInsets.
 */
export function ScreenContainer({
  children,
  edges = ["top", "left", "right"],
  className,
  containerClassName,
  safeAreaClassName,
  keyboardAvoiding = false,
  style,
  ...props
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();

  const safeAreaStyle = {
    paddingTop: edges.includes("top") ? insets.top : 0,
    paddingBottom: edges.includes("bottom") ? insets.bottom : 0,
    paddingLeft: edges.includes("left") ? insets.left : 0,
    paddingRight: edges.includes("right") ? insets.right : 0,
  };

  return (
    <View
      className={cn("flex-1", "bg-background", containerClassName)}
      {...props}
    >
      <View
        className={cn("flex-1", safeAreaClassName)}
        style={[safeAreaStyle, style]}
      >
        {keyboardAvoiding ? (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            className="flex-1"
          >
            <View className={cn("flex-1", className)}>{children}</View>
          </KeyboardAvoidingView>
        ) : (
          <View className={cn("flex-1", className)}>{children}</View>
        )}
      </View>
    </View>
  );
}
