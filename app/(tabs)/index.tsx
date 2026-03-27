import { ScrollView, Text, View, TouchableOpacity, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useState, useMemo } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useExpense } from "@/lib/expense-context";
import { formatCurrency, formatDate, calculateTotal, getAverageDailySpending, getMonthRange, getMonthName } from "@/lib/expense-utils";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function HomeScreen() {
  const router = useRouter();
  const expenseContext = useExpense();
  const themeColors = useColors();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const { expenses, categories, settings } = expenseContext;

  // Get expenses for current month
  const monthRange = useMemo(() => getMonthRange(currentMonth, currentYear), [currentMonth, currentYear]);
  const monthExpenses = useMemo(() => {
    return expenses.filter(e => e.date >= monthRange.start && e.date <= monthRange.end);
  }, [expenses, monthRange]);

  const totalSpent = useMemo(() => calculateTotal(monthExpenses), [monthExpenses]);
  const avgDaily = useMemo(() => getAverageDailySpending(monthExpenses), [monthExpenses]);
  const recentExpenses = useMemo(() => {
    return [...monthExpenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
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
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        {/* Header with Month Navigation */}
        <View className="bg-primary px-6 pt-6 pb-8">
          <View className="flex-row items-center justify-between mb-6">
            <TouchableOpacity onPress={handlePrevMonth} className="p-2">
              <Text className="text-2xl text-white">‹</Text>
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-white">
              {getMonthName(currentMonth)} {currentYear}
            </Text>
            <TouchableOpacity onPress={handleNextMonth} className="p-2">
              <Text className="text-2xl text-white">›</Text>
            </TouchableOpacity>
          </View>

          {/* Summary Cards */}
          <View className="gap-3">
            <View className="bg-white/20 rounded-2xl p-4">
              <Text className="text-sm text-white mb-1">Total Spent</Text>
              <Text className="text-3xl font-bold text-white">
                {formatCurrency(totalSpent, settings.currency)}
              </Text>
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1 bg-white/20 rounded-2xl p-4">
                <Text className="text-xs text-white mb-1">Avg Daily</Text>
                <Text className="text-xl font-bold text-white">
                  {formatCurrency(avgDaily, settings.currency)}
                </Text>
              </View>
              <View className="flex-1 bg-white/20 rounded-2xl p-4">
                <Text className="text-xs text-white mb-1">Transactions</Text>
                <Text className="text-xl font-bold text-white">{monthExpenses.length}</Text>
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
                        className="w-12 h-12 rounded-full items-center justify-center mr-3"
                        style={{ backgroundColor: category?.color || themeColors.surface }}
                      >
                        <Text className="text-xl">{category?.icon}</Text>
                      </View>
                      <View className="flex-1">
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

        {/* Add Expense Button */}
        <View className="px-6 pb-6">
          <TouchableOpacity
            onPress={() => router.push("/add-expense")}
            className="bg-primary rounded-2xl py-4 items-center justify-center"
          >
            <View className="flex-row items-center gap-2">
              <IconSymbol name="plus.circle.fill" size={24} color="#ffffff" />
              <Text className="text-lg font-semibold text-white">Add Expense</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
