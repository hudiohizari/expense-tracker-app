import { ScrollView, Text, View, TouchableOpacity, TextInput, Alert, FlatList, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useExpense } from "@/lib/expense-context";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

const PRESET_ICONS = ["🍔", "🚗", "🎬", "🛍️", "💡", "💊", "📌", "🏠", "✈️", "☕", "🎮", "⚽", "👗", "🎒", "🧼", "🐶", "🎁", "💳", "📱", "🥗", "🏋️", "📚", "🎨", "🎭"];
const PRESET_COLORS = ["#FF6B6B", "#4ECDC4", "#FFE66D", "#95E1D3", "#C7CEEA", "#FF8B94", "#B4A7D6", "#45B7D1", "#F7DC6F", "#F1948A", "#82E0AA", "#BB8FCE", "#D2B4DE", "#A9DFBF", "#AED6F1", "#F9E79F"];

export default function ManageCategoryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const themeColors = useColors();
  const insets = useSafeAreaInsets();
  const { categories, addCategory, updateCategory } = useExpense();

  const [name, setName] = useState("");
  const [icon, setIcon] = useState(PRESET_ICONS[0]);
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const category = categories.find(c => c.id === id);
      if (category) {
        setName(category.name);
        setIcon(category.icon);
        setColor(category.color);
      }
    }
  }, [id, categories]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a category name");
      return;
    }

    try {
      setLoading(true);
      if (id) {
        await updateCategory(id, { name: name.trim(), icon, color });
      } else {
        await addCategory({ name: name.trim(), icon, color });
      }
      router.back();
    } catch (error) {
      Alert.alert("Error", id ? "Failed to update category" : "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="p-0" edges={["left", "right"]} keyboardAvoiding={true}>
      {/* Header */}
      <View 
        style={{ paddingTop: insets.top + (Platform.OS === 'ios' ? 8 : 16) }}
        className="bg-primary px-6 pb-6"
      >
        <View className="flex-row items-center justify-between h-8">
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="w-8 h-8 items-start justify-center -ml-1"
          >
            <IconSymbol name="chevron.left" size={24} color="#ffffff" />
          </TouchableOpacity>
          
          <View className="flex-1 items-center justify-center">
            <Text className="text-2xl font-bold text-white text-center">
              {id ? "Edit Category" : "Add Category"}
            </Text>
          </View>
          
          <View className="w-8" />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">

        <View className="p-6 gap-8">
          {/* Preview */}
          <View 
            className="items-center justify-center bg-surface rounded-3xl border border-border"
            style={{ padding: 24 }}
          >
            <View 
              className="w-20 h-20 rounded-full items-center justify-center mb-4 shadow-sm"
              style={{ backgroundColor: color }}
            >
              <Text className="text-4xl">{icon || "❓"}</Text>
            </View>
            <Text className="text-xl font-bold text-foreground text-center">{name || "Category Name"}</Text>
          </View>

          {/* Name Input */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2 ml-1">Category Name</Text>
            <TextInput
              placeholder="e.g., Groceries"
              placeholderTextColor={themeColors.muted}
              value={name}
              onChangeText={setName}
              className="bg-surface rounded-2xl px-4 py-4 border border-border text-lg text-foreground shadow-sm"
            />
          </View>

          {/* Icon Selection (8-column grid) */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-3 ml-1">Select Icon</Text>
            <View className="flex-row flex-wrap justify-between gap-y-4">
              {PRESET_ICONS.map(i => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setIcon(i)}
                  className={`w-[10.5%] aspect-square rounded-lg items-center justify-center border ${
                    icon === i ? "border-primary bg-primary/10" : "border-border bg-surface"
                  }`}
                  style={{ minHeight: 34 }}
                >
                  <Text className="text-lg">{i}</Text>
                </TouchableOpacity>
              ))}
              {[...Array(8)].map((_, i) => <View key={`spacer-icons-${i}`} className="w-[10.5%]" />)}
            </View>
          </View>

          {/* Color Selection (8-column grid) */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-3 ml-1">Select Color</Text>
            <View className="flex-row flex-wrap justify-between gap-y-4">
              {PRESET_COLORS.map(c => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setColor(c)}
                  className={`w-[10.5%] aspect-square rounded-full border-2 ${
                    color === c ? "border-foreground" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c, minHeight: 34 }}
                />
              ))}
              {[...Array(8)].map((_, i) => <View key={`spacer-colors-${i}`} className="w-[10.5%]" />)}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View 
        style={{ paddingBottom: insets.bottom || 24 }}
        className="px-6 pt-0 gap-3 mt-6"
      >
        <TouchableOpacity
          onPress={handleSave}
          disabled={loading}
          className="bg-primary rounded-2xl py-4 items-center justify-center"
        >
          <Text className="text-lg font-semibold text-background">
            {loading ? "Saving..." : (id ? "Update Category" : "Save Category")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-surface rounded-2xl py-4 items-center justify-center border border-border"
        >
          <Text className="text-lg font-semibold text-foreground">Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
