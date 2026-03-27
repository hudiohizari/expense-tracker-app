import { ScrollView, Text, View, TouchableOpacity, Alert, Switch } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useExpense } from "@/lib/expense-context";
import { useColors } from "@/hooks/use-colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { IconSymbol } from "@/components/ui/icon-symbol";
import * as storage from "@/lib/storage";
import { useThemeContext } from "@/lib/theme-provider";

export default function SettingsScreen() {
  const themeColors = useColors();
  const { settings, updateSettings, refreshData } = useExpense();
  const [loading, setLoading] = useState(false);

  const handleExportData = async () => {
    try {
      setLoading(true);
      const data = await storage.exportData();
      const jsonString = JSON.stringify(data, null, 2);

      Alert.alert(
        "Export Successful",
        "Your data has been prepared. You can now share or save it.",
        [{ text: "OK" }]
      );

      // In a real app, you would use Share API or save to file
      console.log("Exported data:", jsonString);
    } catch (error) {
      Alert.alert("Error", "Failed to export data");
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to delete all expenses and categories? This action cannot be undone.",
      [
        { text: "Cancel", onPress: () => {} },
        {
          text: "Clear",
          onPress: async () => {
            try {
              setLoading(true);
              await storage.clearAllData();
              await refreshData();
              Alert.alert("Success", "All data has been cleared");
            } catch (error) {
              Alert.alert("Error", "Failed to clear data");
            } finally {
              setLoading(false);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleCurrencyChange = (currency: string) => {
    updateSettings({ currency });
  };

  const handleDateFormatChange = (format: string) => {
    updateSettings({ dateFormat: format });
  };

  const colorScheme = useColorScheme();
  const { colorScheme: currentScheme, setColorScheme } = useThemeContext();
  const isDarkMode = currentScheme === 'dark';

  const toggleTheme = () => {
    setColorScheme(isDarkMode ? 'light' : 'dark');
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        {/* Header */}
        <View className="bg-primary px-6 pt-6 pb-6">
          <Text className="text-2xl font-bold text-background">Settings</Text>
        </View>

        {/* Preferences Section */}
        <View className="px-6 pt-6">
          <Text className="text-lg font-semibold text-foreground mb-4">Preferences</Text>

          {/* Theme Toggle */}
          <View className="bg-surface rounded-2xl p-4 mb-4 border border-border flex-row items-center justify-between">
            <View className="flex-row items-center">
              <IconSymbol name="gearshape.fill" size={20} color={themeColors.primary} />
              <Text className="text-base font-medium text-foreground ml-3">Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: themeColors.border, true: themeColors.primary }}
              thumbColor={isDarkMode ? themeColors.background : themeColors.foreground}
            />
          </View>

          {/* Currency Selection */}
          <View className="bg-surface rounded-2xl p-4 mb-4 border border-border">
            <Text className="text-sm font-medium text-muted mb-3">Currency</Text>
            <View className="gap-2">
              {["USD", "EUR", "GBP", "JPY", "INR", "IDR"].map(currency => (
                <TouchableOpacity
                  key={currency}
                  onPress={() => handleCurrencyChange(currency)}
                  className={`flex-row items-center p-3 rounded-lg ${
                    settings.currency === currency ? "bg-primary" : "bg-background"
                  }`}
                >
                  <View
                    className={`w-5 h-5 rounded-full border-2 items-center justify-center mr-3 ${
                      settings.currency === currency ? "border-background" : "border-border"
                    }`}
                  >
                    {settings.currency === currency && (
                      <View className="w-2.5 h-2.5 rounded-full bg-background" />
                    )}
                  </View>
                  <Text
                    className={`font-medium ${
                      settings.currency === currency ? "text-background" : "text-foreground"
                    }`}
                  >
                    {currency}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Date Format Selection */}
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-sm font-medium text-muted mb-3">Date Format</Text>
            <View className="gap-2">
              {["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"].map(format => (
                <TouchableOpacity
                  key={format}
                  onPress={() => handleDateFormatChange(format)}
                  className={`flex-row items-center p-3 rounded-lg ${
                    settings.dateFormat === format ? "bg-primary" : "bg-background"
                  }`}
                >
                  <View
                    className={`w-5 h-5 rounded-full border-2 items-center justify-center mr-3 ${
                      settings.dateFormat === format ? "border-background" : "border-border"
                    }`}
                  >
                    {settings.dateFormat === format && (
                      <View className="w-2.5 h-2.5 rounded-full bg-background" />
                    )}
                  </View>
                  <Text
                    className={`font-medium ${
                      settings.dateFormat === format ? "text-background" : "text-foreground"
                    }`}
                  >
                    {format}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Data Management Section */}
        <View className="px-6 pt-6">
          <Text className="text-lg font-semibold text-foreground mb-4">Data Management</Text>

          <TouchableOpacity
            onPress={handleExportData}
            disabled={loading}
            className="flex-row items-center justify-between bg-surface rounded-2xl p-4 mb-3 border border-border"
          >
            <View className="flex-row items-center">
              <IconSymbol name="paperplane.fill" size={20} color={themeColors.primary} />
              <Text className="text-base font-medium text-foreground ml-3">Export Data</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={themeColors.muted} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleClearData}
            disabled={loading}
            className="flex-row items-center justify-between bg-error bg-opacity-10 rounded-2xl p-4 border border-error border-opacity-30"
          >
            <View className="flex-row items-center">
              <IconSymbol name="trash" size={20} color={themeColors.error} />
              <Text className="text-base font-medium text-error ml-3">Clear All Data</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={themeColors.error} />
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View className="px-6 pt-6 pb-6">
          <Text className="text-lg font-semibold text-foreground mb-4">About</Text>

          <View className="bg-surface rounded-2xl p-4 border border-border">
            <View className="mb-4">
              <Text className="text-sm font-medium text-muted mb-1">App Name</Text>
              <Text className="text-base text-foreground">Expense Tracker</Text>
            </View>
            <View className="mb-4">
              <Text className="text-sm font-medium text-muted mb-1">Version</Text>
              <Text className="text-base text-foreground">1.0.0</Text>
            </View>
            <View>
              <Text className="text-sm font-medium text-muted mb-1">Description</Text>
              <Text className="text-sm text-muted leading-relaxed">
                Track your daily expenses, categorize them, and view comprehensive reports with visual analytics.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
