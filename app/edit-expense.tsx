import { ScrollView, Text, View, TouchableOpacity, TextInput, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useExpense } from "@/lib/expense-context";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function EditExpenseScreen() {
  const router = useRouter();
  const { expenseId } = useLocalSearchParams();
  const themeColors = useColors();
  const { expenses, updateExpense, deleteExpense, categories } = useExpense();

  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const expense = expenses.find(e => e.id === expenseId);

  useEffect(() => {
    if (expense) {
      setAmount(expense.amount.toString());
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
        amount: parseFloat(amount),
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
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-2xl font-bold text-foreground">Edit Expense</Text>
            <TouchableOpacity onPress={() => router.back()}>
              <IconSymbol name="chevron.right" size={24} color={themeColors.foreground} />
            </TouchableOpacity>
          </View>

          {/* Amount Input */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">Amount</Text>
            <View className="flex-row items-center bg-surface rounded-2xl px-4 py-3 border border-border">
              <Text className="text-lg font-semibold text-muted mr-2">$</Text>
              <TextInput
                placeholder="0.00"
                placeholderTextColor={themeColors.muted}
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                className="flex-1 text-lg text-foreground"
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
      <View className="gap-3 mt-6">
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
