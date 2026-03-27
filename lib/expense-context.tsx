/**
 * Expense Context - Global state management for expenses and categories
 */

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Expense, Category, AppSettings } from './types';
import * as storage from './storage';

interface ExpenseState {
  expenses: Expense[];
  categories: Category[];
  settings: AppSettings;
  loading: boolean;
  error: string | null;
}

type ExpenseAction =
  | { type: 'SET_EXPENSES'; payload: Expense[] }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'SET_SETTINGS'; payload: AppSettings }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: ExpenseState = {
  expenses: [],
  categories: [],
  settings: { currency: 'USD', dateFormat: 'MM/DD/YYYY', theme: 'auto' },
  loading: true,
  error: null,
};

function expenseReducer(state: ExpenseState, action: ExpenseAction): ExpenseState {
  switch (action.type) {
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload, loading: false };
    case 'ADD_EXPENSE':
      return { ...state, expenses: [...state.expenses, action.payload] };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(e => (e.id === action.payload.id ? action.payload : e)),
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(e => e.id !== action.payload),
      };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(c => (c.id === action.payload.id ? action.payload : c)),
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(c => c.id !== action.payload),
      };
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

interface ExpenseContextType extends ExpenseState {
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Promise<void>;
  updateExpense: (id: string, updates: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateSettings: (updates: Partial<AppSettings>) => Promise<void>;
  refreshData: () => Promise<void>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  // Initialize data on mount
  useEffect(() => {
    const initData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        await storage.initializeStorage();

        const [expenses, categories, settings] = await Promise.all([
          storage.getExpenses(),
          storage.getCategories(),
          storage.getSettings(),
        ]);

        dispatch({ type: 'SET_EXPENSES', payload: expenses });
        dispatch({ type: 'SET_CATEGORIES', payload: categories });
        dispatch({ type: 'SET_SETTINGS', payload: settings });
        dispatch({ type: 'SET_ERROR', payload: null });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' });
        console.error('Failed to initialize data:', error);
      }
    };

    initData();
  }, []);

  const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    try {
      const newExpense = await storage.addExpense(expense);
      dispatch({ type: 'ADD_EXPENSE', payload: newExpense });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add expense' });
      throw error;
    }
  };

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    try {
      const updated = await storage.updateExpense(id, updates);
      if (updated) {
        dispatch({ type: 'UPDATE_EXPENSE', payload: updated });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update expense' });
      throw error;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await storage.deleteExpense(id);
      dispatch({ type: 'DELETE_EXPENSE', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete expense' });
      throw error;
    }
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    try {
      const newCategory = await storage.addCategory(category);
      dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add category' });
      throw error;
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      const updated = await storage.updateCategory(id, updates);
      if (updated) {
        dispatch({ type: 'UPDATE_CATEGORY', payload: updated });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update category' });
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await storage.deleteCategory(id);
      dispatch({ type: 'DELETE_CATEGORY', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete category' });
      throw error;
    }
  };

  const updateSettings = async (updates: Partial<AppSettings>) => {
    try {
      const updated = await storage.updateSettings(updates);
      dispatch({ type: 'SET_SETTINGS', payload: updated });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update settings' });
      throw error;
    }
  };

  const refreshData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const [expenses, categories, settings] = await Promise.all([
        storage.getExpenses(),
        storage.getCategories(),
        storage.getSettings(),
      ]);
      dispatch({ type: 'SET_EXPENSES', payload: expenses });
      dispatch({ type: 'SET_CATEGORIES', payload: categories });
      dispatch({ type: 'SET_SETTINGS', payload: settings });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to refresh data' });
    }
  };

  const value: ExpenseContextType = {
    ...state,
    addExpense,
    updateExpense,
    deleteExpense,
    addCategory,
    updateCategory,
    deleteCategory,
    updateSettings,
    refreshData,
  };

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
}

export function useExpense() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpense must be used within ExpenseProvider');
  }
  return context;
}
