import { ScrollView, Text, View, TouchableOpacity, FlatList } from "react-native";
import { useState, useMemo } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useExpense } from "@/lib/expense-context";
import {
  formatCurrency,
  calculateTotal,
  calculateByCategory,
  getTopCategories,
  getAverageTransaction,
  getMonthRange,
  getMonthName,
} from "@/lib/expense-utils";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function ReportsScreen() {
  const themeColors = useColors();
  const { expenses, categories, settings } = useExpense();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const monthRange = useMemo(() => getMonthRange(currentMonth, currentYear), [currentMonth, currentYear]);
  const monthExpenses = useMemo(() => {
    return expenses.filter(e => e.date >= monthRange.start && e.date <= monthRange.end);
  }, [expenses, monthRange]);

  const totalSpent = useMemo(() => calculateTotal(monthExpenses), [monthExpenses]);
  const avgTransaction = useMemo(() => getAverageTransaction(monthExpenses), [monthExpenses]);
  const byCategory = useMemo(() => calculateByCategory(monthExpenses, categories), [monthExpenses, categories]);
  const topCategories = useMemo(() => getTopCategories(monthExpenses, categories, 5), [monthExpenses, categories]);

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

  const maxAmount = useMemo(() => {
    return Math.max(...topCategories.map(c => c.amount), 1);
  }, [topCategories]);

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
                <Text className="text-xs text-white mb-1">Avg Transaction</Text>
                <Text className="text-xl font-bold text-white">
                  {formatCurrency(avgTransaction, settings.currency)}
                </Text>
              </View>
              <View className="flex-1 bg-white/20 rounded-2xl p-4">
                <Text className="text-xs text-white mb-1">Transactions</Text>
                <Text className="text-xl font-bold text-white">{monthExpenses.length}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Category Breakdown */}
        <View className="px-6 pt-6">
          <Text className="text-lg font-semibold text-foreground mb-4">Top Categories</Text>

          {topCategories.length > 0 ? (
            <View className="gap-3 mb-6">
              {topCategories.map(({ category, amount }) => {
                const percentage = (amount / maxAmount) * 100;
                return (
                  <View key={category.id}>
                    <View className="flex-row items-center justify-between mb-2">
                      <View className="flex-row items-center flex-1">
                        <View
                          className="w-8 h-8 rounded-full items-center justify-center mr-2"
                          style={{ backgroundColor: category.color }}
                        >
                          <Text className="text-sm">{category.icon}</Text>
                        </View>
                        <Text className="text-sm font-medium text-foreground flex-1">{category.name}</Text>
                      </View>
                      <Text className="text-sm font-semibold text-foreground">
                        {formatCurrency(amount, settings.currency)}
                      </Text>
                    </View>
                    <View className="h-2 bg-surface rounded-full overflow-hidden">
                      <View
                        className="h-full rounded-full"
                        style={{
                          backgroundColor: category.color,
                          width: `${percentage}%`,
                        }}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View className="py-8 items-center">
              <Text className="text-muted">No expenses this month</Text>
            </View>
          )}
        </View>

        {/* All Categories */}
        <View className="px-6 pb-6">
          <Text className="text-lg font-semibold text-foreground mb-4">All Categories</Text>

          {categories.length > 0 ? (
            <View className="gap-2">
              {categories.map(category => {
                const amount = byCategory[category.id] || 0;
                const percentage = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
                return (
                  <View
                    key={category.id}
                    className="flex-row items-center justify-between p-3 bg-surface rounded-xl border border-border"
                  >
                    <View className="flex-row items-center flex-1">
                      <View
                        className="w-8 h-8 rounded-full items-center justify-center mr-2"
                        style={{ backgroundColor: category.color }}
                      >
                        <Text className="text-sm">{category.icon}</Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-sm font-medium text-foreground">{category.name}</Text>
                        <Text className="text-xs text-muted">{percentage.toFixed(1)}%</Text>
                      </View>
                    </View>
                    <Text className="text-sm font-semibold text-foreground">
                      {formatCurrency(amount, settings.currency)}
                    </Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <Text className="text-muted text-center py-4">No categories</Text>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
