/**
 * Storage Service - AsyncStorage wrapper for expenses and categories
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense, Category, AppSettings, DEFAULT_CATEGORIES, DEFAULT_SETTINGS } from './types';

const EXPENSES_KEY = 'expenses';
const CATEGORIES_KEY = 'categories';
const SETTINGS_KEY = 'settings';

/**
 * Initialize storage with default data if empty
 */
export async function initializeStorage() {
  try {
    const categories = await AsyncStorage.getItem(CATEGORIES_KEY);
    if (!categories) {
      await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
    }

    const settings = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!settings) {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
    }

    const expenses = await AsyncStorage.getItem(EXPENSES_KEY);
    if (!expenses) {
      await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify([]));
    }
  } catch (error) {
    console.error('Failed to initialize storage:', error);
  }
}

/**
 * Expense Operations
 */

export async function getExpenses(): Promise<Expense[]> {
  try {
    const data = await AsyncStorage.getItem(EXPENSES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get expenses:', error);
    return [];
  }
}

export async function addExpense(expense: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> {
  try {
    const expenses = await getExpenses();
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };
    expenses.push(newExpense);
    await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
    return newExpense;
  } catch (error) {
    console.error('Failed to add expense:', error);
    throw error;
  }
}

export async function updateExpense(id: string, updates: Partial<Expense>): Promise<Expense | null> {
  try {
    const expenses = await getExpenses();
    const index = expenses.findIndex(e => e.id === id);
    if (index === -1) return null;

    expenses[index] = { ...expenses[index], ...updates };
    await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
    return expenses[index];
  } catch (error) {
    console.error('Failed to update expense:', error);
    throw error;
  }
}

export async function deleteExpense(id: string): Promise<boolean> {
  try {
    const expenses = await getExpenses();
    const filtered = expenses.filter(e => e.id !== id);
    await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Failed to delete expense:', error);
    throw error;
  }
}

export async function getExpensesByMonth(month: number, year: number): Promise<Expense[]> {
  try {
    const expenses = await getExpenses();
    return expenses.filter(e => {
      const date = new Date(e.date);
      return date.getMonth() === month && date.getFullYear() === year;
    });
  } catch (error) {
    console.error('Failed to get expenses by month:', error);
    return [];
  }
}

/**
 * Category Operations
 */

export async function getCategories(): Promise<Category[]> {
  try {
    const data = await AsyncStorage.getItem(CATEGORIES_KEY);
    return data ? JSON.parse(data) : DEFAULT_CATEGORIES;
  } catch (error) {
    console.error('Failed to get categories:', error);
    return DEFAULT_CATEGORIES;
  }
}

export async function addCategory(category: Omit<Category, 'id'>): Promise<Category> {
  try {
    const categories = await getCategories();
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    };
    categories.push(newCategory);
    await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    return newCategory;
  } catch (error) {
    console.error('Failed to add category:', error);
    throw error;
  }
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
  try {
    const categories = await getCategories();
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) return null;

    categories[index] = { ...categories[index], ...updates };
    await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    return categories[index];
  } catch (error) {
    console.error('Failed to update category:', error);
    throw error;
  }
}

export async function deleteCategory(id: string): Promise<boolean> {
  try {
    const categories = await getCategories();
    const filtered = categories.filter(c => c.id !== id);
    await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Failed to delete category:', error);
    throw error;
  }
}

/**
 * Settings Operations
 */

export async function getSettings(): Promise<AppSettings> {
  try {
    const data = await AsyncStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Failed to get settings:', error);
    return DEFAULT_SETTINGS;
  }
}

export async function updateSettings(updates: Partial<AppSettings>): Promise<AppSettings> {
  try {
    const settings = await getSettings();
    const updated = { ...settings, ...updates };
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Failed to update settings:', error);
    throw error;
  }
}

/**
 * Utility Functions
 */

export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.removeItem(EXPENSES_KEY);
    await AsyncStorage.removeItem(CATEGORIES_KEY);
    await AsyncStorage.removeItem(SETTINGS_KEY);
    await initializeStorage();
  } catch (error) {
    console.error('Failed to clear data:', error);
    throw error;
  }
}

export async function exportData() {
  try {
    const expenses = await getExpenses();
    const categories = await getCategories();
    const settings = await getSettings();

    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      expenses,
      categories,
      settings,
    };
  } catch (error) {
    console.error('Failed to export data:', error);
    throw error;
  }
}

export async function importData(data: any): Promise<void> {
  try {
    if (data.expenses) {
      await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(data.expenses));
    }
    if (data.categories) {
      await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(data.categories));
    }
    if (data.settings) {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(data.settings));
    }
  } catch (error) {
    console.error('Failed to import data:', error);
    throw error;
  }
}
