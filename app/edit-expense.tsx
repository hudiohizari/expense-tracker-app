import { ScrollView, Text, View, TouchableOpacity, TextInput, Alert, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useExpense } from "@/lib/expense-context";
import { formatCurrency, getCurrencySymbol, formatInputAmount, parseInputAmount, getAmountPlaceholder } from "@/lib/expense-utils";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function EditExpenseScreen() {
  const router = useRouter();
  const { expenseId } = useLocalSearchParams();
  const themeColors = useColors();
  const insets = useSafeAreaInsets();
  const { expenses, updateExpense, deleteExpense, categories, settings } = useExpense();

  const handleAmountChange = (text: string) => {
    setAmount(formatInputAmount(text));
  };

  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const expense = expenses.find(e => e.id === expenseId);

  useEffect(() => {
    if (expense) {
      setAmount(formatInputAmount(expense.amount));
      setSelectedCategory(expense.category);
      setDate(expense.date);
      setNotes(expense.notes || "");
    }
  }, [expense]);

  const handleUpdateExpense = async () => {
    if (!amount.trim()) {
      Alert.alert("Error", "Please enter an amount");
      return;
    }

    try {
      setLoading(true);
      await updateExpense(expense!.id, {
        amount: parseInputAmount(amount),
        category: selectedCategory,
        date,
        notes: notes.trim() || undefined,
      });
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to update expense");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async () => {
    Alert.alert("Delete Expense", "Are you sure you want to delete this expense?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await deleteExpense(expense!.id);
            router.back();
          } catch (error) {
            Alert.alert("Error", "Failed to delete expense");
          }
        },
        style: "destructive",
      },
    ]);
  };

  if (!expense) {
    return (
      <ScreenContainer className="p-6 items-center justify-center">
        <Text className="text-foreground">Expense not found</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0" edges={["left", "right"]} keyboardAvoiding={true}>
      {/* Header */}
      <View 
        style={{ paddingTop: insets.top + (Platform.OS === 'ios' ? 8 : 16) }} 
        className="bg-background px-6 pb-6 border-b border-border shadow-sm"
      >
        <View className="flex-row items-center justify-between h-8">
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="w-8 h-8 items-start justify-center -ml-1"
          >
            <IconSymbol name="chevron.left" size={24} color={themeColors.foreground} />
          </TouchableOpacity>
          
          <View className="flex-1 items-center justify-center">
            <Text className="text-2xl font-bold text-foreground text-center">
              Edit Expense
            </Text>
          </View>
          
          <View className="w-8" />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 p-6 pt-2">
        <View className="gap-6">

          {/* Amount Input */}
          <View>
            <Text className="text-sm font-semibold text-muted mb-3 uppercase tracking-wider">Amount</Text>
            <View className="bg-surface rounded-3xl px-5 py-3 border border-border flex-row items-center h-20 shadow-sm">
              <Text className="text-3xl font-bold text-muted mr-3 leading-none p-0">
                {getCurrencySymbol(settings.currency)}
              </Text>
              <TextInput
                className="flex-1 text-4xl font-bold text-foreground h-full p-0"
                placeholder={getAmountPlaceholder()}
                placeholderTextColor={themeColors.muted}
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={handleAmountChange}
                textAlignVertical="center"
                style={{ paddingVertical: 0 }}
              />
            </View>
          </View>

          {/* Category Selection */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">Category</Text>
            <View className="gap-2">
              {categories.map(category => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => setSelectedCategory(category.id)}
                  className={`flex-row items-center p-4 rounded-2xl border ${
                    selectedCategory === category.id
                      ? "bg-primary border-primary"
                      : "bg-surface border-border"
                  }`}
                >
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: category.color }}
                  >
                    <Text className="text-lg">{category.icon}</Text>
                  </View>
                  <Text
                    className={`flex-1 font-medium ${
                      selectedCategory === category.id ? "text-background" : "text-foreground"
                    }`}
                  >
                    {category.name}
                  </Text>
                  {selectedCategory === category.id && (
                    <IconSymbol name="chevron.right" size={20} color={themeColors.background} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Date Input */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">Date</Text>
            <View className="flex-row items-center bg-surface rounded-2xl px-4 py-3 border border-border">
              <IconSymbol name="calendar" size={20} color={themeColors.muted} />
              <TextInput
                placeholder="YYYY-MM-DD"
                placeholderTextColor={themeColors.muted}
                value={date}
                onChangeText={setDate}
                className="flex-1 ml-2 text-lg text-foreground"
              />
            </View>
          </View>

          {/* Notes Input */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">Notes (Optional)</Text>
            <TextInput
              placeholder="Add notes..."
              placeholderTextColor={themeColors.muted}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              className="bg-surface rounded-2xl px-4 py-3 border border-border text-foreground"
            />
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View 
        style={{ paddingBottom: insets.bottom || 24 }}
        className="px-6 gap-3 mt-6"
      >
        <TouchableOpacity
          onPress={handleUpdateExpense}
          disabled={loading}
          className="bg-primary rounded-2xl py-4 items-center justify-center"
        >
          <Text className="text-lg font-semibold text-background">
            {loading ? "Updating..." : "Update Expense"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleDeleteExpense}
          className="bg-error rounded-2xl py-4 items-center justify-center"
        >
          <Text className="text-lg font-semibold text-background">Delete Expense</Text>
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
