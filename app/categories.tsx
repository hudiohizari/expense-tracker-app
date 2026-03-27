import { ScrollView, Text, View, TouchableOpacity, Alert, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useExpense } from "@/lib/expense-context";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function CategoriesScreen() {
  const router = useRouter();
  const themeColors = useColors();
  const { categories, deleteCategory, expenses } = useExpense();

  const handleDeleteCategory = (id: string, name: string) => {
    // Check if category is in use
    const isInUse = expenses.some(e => e.category === id);
    
    if (isInUse) {
      Alert.alert(
        "Cannot Delete",
        `The category "${name}" is currently being used by some expenses. Please change those expenses to a different category first.`,
        [{ text: "OK" }]
      );
      return;
    }

    Alert.alert(
      "Delete Category",
      `Are you sure you want to delete the "${name}" category?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          onPress: async () => {
            try {
              await deleteCategory(id);
            } catch (error) {
              Alert.alert("Error", "Failed to delete category");
            }
          },
          style: "destructive" 
        }
      ]
    );
  };

  return (
    <ScreenContainer className="p-0">
      <View className="flex-1">
        {/* Header */}
        <View className="bg-primary px-6 pt-6 pb-6">
          <View className="flex-row items-center justify-between h-8">
            <TouchableOpacity 
              onPress={() => router.back()} 
              className="w-8 h-8 items-start justify-center -ml-1"
            >
              <IconSymbol name="chevron.left" size={24} color="#ffffff" />
            </TouchableOpacity>
            
            <View className="flex-1 items-center justify-center">
              <Text className="text-2xl font-bold text-white text-center">Categories</Text>
            </View>
            
            <TouchableOpacity 
              onPress={() => router.push("/manage-category")}
              className="w-8 h-8 bg-white/20 rounded-full items-center justify-center -mr-1"
            >
              <IconSymbol name="plus" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

          <FlatList
          data={categories}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View className="bg-surface rounded-2xl p-4 border border-border flex-row items-center justify-between mb-4">
              <View className="flex-row items-center flex-1">
                <View 
                  className="w-12 h-12 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: item.color }}
                >
                  <Text className="text-2xl">{item.icon}</Text>
                </View>
                <Text className="text-lg font-semibold text-foreground ml-2">{item.name}</Text>
              </View>
              
              <View className="flex-row gap-2">
                <TouchableOpacity 
                  onPress={() => router.push({ pathname: "/manage-category", params: { id: item.id } })}
                  className="p-2 rounded-full bg-primary/10"
                >
                  <IconSymbol name="pencil" size={18} color={themeColors.primary} />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => handleDeleteCategory(item.id, item.name)}
                  className="p-2 rounded-full bg-error/10"
                >
                  <IconSymbol name="trash.fill" size={18} color={themeColors.error} />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <Text className="text-muted text-lg">No categories found</Text>
            </View>
          }
        />
      </View>
    </ScreenContainer>
  );
}
