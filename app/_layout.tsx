import "@/global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import "@/lib/_core/nativewind-pressable";
import { ThemeProvider } from "@/lib/theme-provider";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import { ExpenseProvider } from "@/lib/expense-context";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const providerInitialMetrics = {
    frame: initialWindowMetrics?.frame ?? { x: 0, y: 0, width: 0, height: 0 },
    insets: {
      top: Math.max(initialWindowMetrics?.insets?.top ?? 0, 16),
      bottom: Math.max(initialWindowMetrics?.insets?.bottom ?? 0, 12),
      left: initialWindowMetrics?.insets?.left ?? 0,
      right: initialWindowMetrics?.insets?.right ?? 0,
    },
  };

  return (
    <ThemeProvider>
      <SafeAreaProvider initialMetrics={providerInitialMetrics}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ExpenseProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="categories" />
              <Stack.Screen name="manage-category" />
            </Stack>
            <StatusBar style="auto" />
          </ExpenseProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}