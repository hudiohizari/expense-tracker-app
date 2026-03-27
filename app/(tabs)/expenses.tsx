import { ScrollView, Text, View, TouchableOpacity, FlatList, TextInput, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useMemo } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useExpense } from "@/lib/expense-context";
import { formatCurrency, formatDate, sortByDateDesc } from "@/lib/expense-utils";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { FloatingActionButton } from "@/components/floating-action-button";

export default function ExpensesScreen() {
  const router = useRouter();
  const themeColors = useColors();
  const insets = useSafeAreaInsets();
  const { expenses, categories, settings } = useExpense();
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredExpenses = useMemo(() => {
    let filtered = [...expenses];

    if (selectedCategory) {
      filtered = filtered.filter(e => e.category === selectedCategory);
    }

    if (searchText.trim()) {
      const query = searchText.toLowerCase();
      filtered = filtered.filter(e =>
        e.notes?.toLowerCase().includes(query) ||
        categories.find(c => c.id === e.category)?.name.toLowerCase().includes(query)
      );
    }

    return sortByDateDesc(filtered);
  }, [expenses, selectedCategory, searchText, categories]);

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(c => c.id === categoryId);
  };

  return (
    <ScreenContainer className="p-0" edges={["left", "right"]} keyboardAvoiding={true}>
      {/* Sticky Header */}
      <View 
        style={{ paddingTop: insets.top + (Platform.OS === 'ios' ? 8 : 16) }}
        className="bg-primary px-6 pb-6 shadow-sm z-10"
      >
        <Text className="text-2xl font-bold text-white mb-4">Expenses</Text>

        {/* Search Bar */}
        <View className="bg-white/20 rounded-full px-4 py-3 flex-row items-center">
          <IconSymbol name="magnifyingglass" size={20} color="#ffffff" />
          <TextInput
            placeholder="Search expenses..."
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            value={searchText}
            onChangeText={setSearchText}
            className="flex-1 ml-2 text-white"
          />
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }} 
        className="flex-1"
      >

        {/* Category Filter */}
        <View className="pt-4 pb-2">
          <FlatList
            horizontal
            data={categories}
            keyExtractor={item => item.id}
            scrollEnabled={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24 }}
            ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedCategory(selectedCategory === item.id ? null : item.id)}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === item.id ? "bg-primary" : "bg-surface border border-border"
                }`}
              >
                <Text className={selectedCategory === item.id ? "text-white font-medium" : "text-foreground font-medium"}>
                  {item.icon} {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Expenses List */}
        <View className="flex-1 px-6 pt-4">
          {filteredExpenses.length > 0 ? (
            <FlatList
              data={filteredExpenses}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View className="h-px bg-border my-2" />}
              renderItem={({ item }) => {
                const category = getCategoryInfo(item.category);
                return (
                  <TouchableOpacity
                    onPress={() => router.push({ pathname: "/edit-expense", params: { expenseId: item.id } })}
                    className="py-3 flex-row items-center justify-between"
                  >
                    <View className="flex-row items-center flex-1">
                      <View
                        className="w-12 h-12 rounded-full items-center justify-center mr-4"
                        style={{ backgroundColor: category?.color || themeColors.surface }}
                      >
                        <Text className="text-xl">{category?.icon}</Text>
                      </View>
                      <View className="flex-1 ml-1">
                        <Text className="text-base font-medium text-foreground">{category?.name}</Text>
                        <Text className="text-xs text-muted">{formatDate(item.date, settings.dateFormat)}</Text>
                        {item.notes && <Text className="text-xs text-muted mt-1">{item.notes}</Text>}
                      </View>
                    </View>
                    <Text className="text-base font-semibold text-foreground">
                      {formatCurrency(item.amount, settings.currency)}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          ) : (
            <View className="flex-1 items-center justify-center py-8">
              <Text className="text-muted text-center">
                {searchText || selectedCategory ? "No expenses found" : "No expenses yet"}
              </Text>
            </View>
          )}
        </View>

        {/* FAB is outside ScrollView */}
      </ScrollView>
      <FloatingActionButton />
    </ScreenContainer>
  );
}
