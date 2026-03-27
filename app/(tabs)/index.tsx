import { ScrollView, Text, View, TouchableOpacity, FlatList, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useRouter } from "expo-router";
import { useState, useMemo } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useExpense } from "@/lib/expense-context";
import { formatCurrency, formatDate, calculateTotal, getAverageDailySpending, getMonthRange, getMonthName, sortByDateDesc } from "@/lib/expense-utils";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { FloatingActionButton } from "@/components/floating-action-button";

export default function HomeScreen() {
  const router = useRouter();
  const expenseContext = useExpense();
  const themeColors = useColors();
  const insets = useSafeAreaInsets();
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  
  const isCurrentMonth = currentMonth === now.getMonth() && currentYear === now.getFullYear();

  const { expenses, categories, settings } = expenseContext;

  // Get expenses for current month
  const monthRange = useMemo(() => getMonthRange(currentMonth, currentYear), [currentMonth, currentYear]);
  const monthExpenses = useMemo(() => {
    return expenses.filter(e => e.date >= monthRange.start && e.date <= monthRange.end);
  }, [expenses, monthRange]);

  const totalSpent = useMemo(() => calculateTotal(monthExpenses), [monthExpenses]);
  const avgDaily = useMemo(() => getAverageDailySpending(monthExpenses), [monthExpenses]);
  const recentExpenses = useMemo(() => {
    return sortByDateDesc(monthExpenses).slice(0, 5);
  }, [monthExpenses]);

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(c => c.id === categoryId);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (isCurrentMonth) return;
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <ScreenContainer className="p-0" edges={["left", "right"]}>
      {/* Sticky Header with Month Navigation */}
      <View 
        style={{ paddingTop: insets.top + (Platform.OS === 'ios' ? 4 : 8) }}
        className="bg-primary px-6 pb-4 shadow-sm z-10"
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={handlePrevMonth} className="p-2 -ml-2">
            <IconSymbol name="chevron.left" size={28} color="#ffffff" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white">
            {getMonthName(currentMonth)} {currentYear}
          </Text>
          {!isCurrentMonth ? (
            <TouchableOpacity onPress={handleNextMonth} className="p-2 -mr-2">
              <IconSymbol name="chevron.right" size={28} color="#ffffff" />
            </TouchableOpacity>
          ) : (
            <View className="w-10" />
          )}
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }} 
        className="flex-1"
      >
        {/* Scrollable Summary Cards */}
        <View className="px-6 pt-4 pb-2">
          <View className="gap-3">
            <View className="bg-surface rounded-3xl p-6 border border-border shadow-sm">
              <Text className="text-sm font-semibold text-muted mb-2">Total Spent</Text>
              <Text 
                className="text-4xl font-bold text-foreground"
                adjustsFontSizeToFit={true}
                numberOfLines={1}
              >
                {formatCurrency(totalSpent, settings.currency)}
              </Text>
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1 bg-surface rounded-2xl p-4 border border-border shadow-sm">
                <Text className="text-xs font-semibold text-muted mb-1">Avg Daily</Text>
                <Text 
                  className="text-xl font-bold text-foreground"
                  adjustsFontSizeToFit={true}
                  numberOfLines={1}
                >
                  {formatCurrency(avgDaily, settings.currency)}
                </Text>
              </View>
              <View className="flex-1 bg-surface rounded-2xl p-4 border border-border shadow-sm">
                <Text className="text-xs font-semibold text-muted mb-1">Transactions</Text>
                <Text 
                  className="text-xl font-bold text-foreground"
                  adjustsFontSizeToFit={true}
                  numberOfLines={1}
                >
                  {monthExpenses.length}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Expenses */}
        <View className="flex-1 px-6 pt-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-foreground">Recent Expenses</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/expenses")}>
              <Text className="text-primary font-medium">View All</Text>
            </TouchableOpacity>
          </View>

          {recentExpenses.length > 0 ? (
            <FlatList
              data={recentExpenses}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View className="h-px bg-border my-2" />}
              renderItem={({ item }) => {
                const category = getCategoryInfo(item.category);
                return (
                  <TouchableOpacity
                    onPress={() => router.push({ pathname: "/(tabs)/expenses", params: { expenseId: item.id } })}
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
              <Text className="text-muted text-center">No expenses this month</Text>
            </View>
          )}
        </View>

        {/* FAB is outside ScrollView */}
      </ScrollView>
      <FloatingActionButton />
    </ScreenContainer>
  );
}
