/**
 * Expense Utilities - Helper functions for calculations and formatting
 */

import { Expense, Category } from './types';

/**
 * Format currency amount
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Get currency symbol from code
 */
export function getCurrencySymbol(currency: string = 'USD'): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    IDR: 'Rp',
  };
  return symbols[currency] || currency;
}

/**
 * Format a number/string for display in an input field (thousands separator)
 */
export function formatInputAmount(value: string | number): string {
  if (value === undefined || value === null) return "";
  
  // Remove existing commas if any
  let numeric = value.toString().replace(/,/g, "").replace(/[^0-9.]/g, "");

  const parts = numeric.split(".");
  if (parts.length > 2) return numeric; // Invalid input, return as is

  let integerPart = parts[0];
  let decimalPart = parts[1] !== undefined ? "." + parts[1].slice(0, 2) : "";

  if (integerPart) {
    // Add thousand separators
    integerPart = Number(integerPart).toLocaleString('en-US');
  } else if (numeric.startsWith('.')) {
    integerPart = "0";
  }

  return integerPart + decimalPart;
}

/**
 * Format date to readable string
 */
export function formatDate(dateString: string, format: string = 'MM/DD/YYYY'): string {
  const date = new Date(dateString);
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  switch (format) {
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'MM/DD/YYYY':
    default:
      return `${month}/${day}/${year}`;
  }
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculate total spending for expenses
 */
export function calculateTotal(expenses: Expense[]): number {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

/**
 * Calculate spending by category
 */
export function calculateByCategory(
  expenses: Expense[],
  categories: Category[]
): Record<string, number> {
  const result: Record<string, number> = {};

  categories.forEach(cat => {
    result[cat.id] = 0;
  });

  expenses.forEach(expense => {
    if (result.hasOwnProperty(expense.category)) {
      result[expense.category] += expense.amount;
    }
  });

  return result;
}

/**
 * Get top spending categories
 */
export function getTopCategories(
  expenses: Expense[],
  categories: Category[],
  limit: number = 5
): Array<{ category: Category; amount: number }> {
  const byCategory = calculateByCategory(expenses, categories);
  const categoryMap = new Map(categories.map(c => [c.id, c]));

  return Object.entries(byCategory)
    .filter(([_, amount]) => amount > 0)
    .map(([catId, amount]) => ({
      category: categoryMap.get(catId)!,
      amount,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
}

/**
 * Get average daily spending
 */
export function getAverageDailySpending(expenses: Expense[]): number {
  if (expenses.length === 0) return 0;

  const total = calculateTotal(expenses);
  const uniqueDates = new Set(expenses.map(e => e.date));
  return total / uniqueDates.size;
}

/**
 * Get average transaction amount
 */
export function getAverageTransaction(expenses: Expense[]): number {
  if (expenses.length === 0) return 0;
  return calculateTotal(expenses) / expenses.length;
}

/**
 * Get highest spending category
 */
export function getHighestCategory(
  expenses: Expense[],
  categories: Category[]
): { category: Category; amount: number } | null {
  const top = getTopCategories(expenses, categories, 1);
  return top.length > 0 ? top[0] : null;
}

/**
 * Filter expenses by date range
 */
export function filterByDateRange(
  expenses: Expense[],
  startDate: string,
  endDate: string
): Expense[] {
  return expenses.filter(e => e.date >= startDate && e.date <= endDate);
}

/**
 * Filter expenses by category
 */
export function filterByCategory(expenses: Expense[], categoryId: string): Expense[] {
  return expenses.filter(e => e.category === categoryId);
}

/**
 * Sort expenses by date (newest first)
 */
export function sortByDateDesc(expenses: Expense[]): Expense[] {
  return [...expenses].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });
}

/**
 * Sort expenses by amount (highest first)
 */
export function sortByAmountDesc(expenses: Expense[]): Expense[] {
  return [...expenses].sort((a, b) => b.amount - a.amount);
}

/**
 * Get daily spending totals for a date range
 */
export function getDailyTotals(expenses: Expense[]): Record<string, number> {
  const totals: Record<string, number> = {};

  expenses.forEach(expense => {
    if (!totals[expense.date]) {
      totals[expense.date] = 0;
    }
    totals[expense.date] += expense.amount;
  });

  return totals;
}

/**
 * Get month and year from date string
 */
export function getMonthYear(dateString: string): { month: number; year: number } {
  const date = new Date(dateString);
  return {
    month: date.getMonth(),
    year: date.getFullYear(),
  };
}

/**
 * Get first and last day of month
 */
export function getMonthRange(month: number, year: number): { start: string; end: string } {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);

  const formatDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  return {
    start: formatDate(start),
    end: formatDate(end),
  };
}

/**
 * Get month name
 */
export function getMonthName(month: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month] || 'Unknown';
}
