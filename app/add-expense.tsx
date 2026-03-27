import { ScrollView, Text, View, TouchableOpacity, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useExpense } from "@/lib/expense-context";
import { getTodayDate } from "@/lib/expense-utils";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function AddExpenseScreen() {
  const router = useRouter();
  const themeColors = useColors();
  const { addExpense, categories } = useExpense();

  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || "");
  const [date, setDate] = useState(getTodayDate());
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddExpense = async () => {
    if (!amount.trim()) {
      Alert.alert("Error", "Please enter an amount");
      return;
    }

    if (!selectedCategory) {
      Alert.alert("Error", "Please select a category");
      return;
    }

    try {
      setLoading(true);
      await addExpense({
        amount: parseFloat(amount),
        category: selectedCategory,
        date,
        notes: notes.trim() || undefined,
      });
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-2xl font-bold text-foreground">Add Expense</Text>
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
          onPress={handleAddExpense}
          disabled={loading}
          className="bg-primary rounded-2xl py-4 items-center justify-center"
        >
          <Text className="text-lg font-semibold text-background">
            {loading ? "Adding..." : "Add Expense"}
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
