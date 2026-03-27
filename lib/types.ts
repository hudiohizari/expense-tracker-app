/**
 * Expense Tracker App - Type Definitions
 */

export type ExpenseCategory = 
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'shopping'
  | 'utilities'
  | 'health'
  | 'other';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string; // ISO date string (YYYY-MM-DD)
  notes?: string;
  createdAt: number; // timestamp
}

export interface MonthlyStats {
  month: number;
  year: number;
  total: number;
  byCategory: Record<string, number>;
  expenses: Expense[];
}

export interface AppSettings {
  currency: string;
  dateFormat: string;
  theme: 'light' | 'dark' | 'auto';
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'food', name: 'Food & Dining', color: '#FF6B6B', icon: '🍔' },
  { id: 'transport', name: 'Transport', color: '#4ECDC4', icon: '🚗' },
  { id: 'entertainment', name: 'Entertainment', color: '#FFE66D', icon: '🎬' },
  { id: 'shopping', name: 'Shopping', color: '#95E1D3', icon: '🛍️' },
  { id: 'utilities', name: 'Utilities', color: '#C7CEEA', icon: '💡' },
  { id: 'health', name: 'Health & Fitness', color: '#FF8B94', icon: '💊' },
  { id: 'other', name: 'Other', color: '#B4A7D6', icon: '📌' },
];

export const DEFAULT_SETTINGS: AppSettings = {
  currency: 'USD',
  dateFormat: 'MM/DD/YYYY',
  theme: 'auto',
};
