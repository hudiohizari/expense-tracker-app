import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatDate,
  getTodayDate,
  calculateTotal,
  calculateByCategory,
  getTopCategories,
  getAverageDailySpending,
  getAverageTransaction,
  getHighestCategory,
  filterByCategory,
  sortByDateDesc,
  getDailyTotals,
  getMonthYear,
  getMonthRange,
  getMonthName,
} from './expense-utils';
import { Expense, Category } from './types';

describe('Expense Utils', () => {
  const mockExpenses: Expense[] = [
    {
      id: '1',
      amount: 50,
      category: 'food',
      date: '2026-03-01',
      notes: 'Lunch',
      createdAt: 1000,
    },
    {
      id: '2',
      amount: 30,
      category: 'transport',
      date: '2026-03-02',
      createdAt: 2000,
    },
    {
      id: '3',
      amount: 100,
      category: 'food',
      date: '2026-03-03',
      notes: 'Dinner',
      createdAt: 3000,
    },
  ];

  const mockCategories: Category[] = [
    { id: 'food', name: 'Food & Dining', color: '#FF6B6B', icon: '🍔' },
    { id: 'transport', name: 'Transport', color: '#4ECDC4', icon: '🚗' },
  ];

  describe('formatCurrency', () => {
    it('should format currency with USD', () => {
      expect(formatCurrency(100, 'USD')).toBe('$100.00');
    });

    it('should format currency with default USD', () => {
      expect(formatCurrency(50)).toBe('$50.00');
    });

    it('should handle decimal amounts', () => {
      expect(formatCurrency(99.99, 'USD')).toBe('$99.99');
    });
  });

  describe('formatDate', () => {
    it('should format date as MM/DD/YYYY by default', () => {
      const result = formatDate('2026-03-15');
      expect(result).toMatch(/^03\/(14|15)\/2026$/);
    });

    it('should format date as DD/MM/YYYY', () => {
      const result = formatDate('2026-03-15', 'DD/MM/YYYY');
      expect(result).toMatch(/^(14|15)\/03\/2026$/);
    });

    it('should format date as YYYY-MM-DD', () => {
      const result = formatDate('2026-03-15', 'YYYY-MM-DD');
      expect(result).toMatch(/^2026-03-(14|15)$/);
    });
  });

  describe('getTodayDate', () => {
    it('should return today date in YYYY-MM-DD format', () => {
      const today = getTodayDate();
      expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('calculateTotal', () => {
    it('should calculate total spending', () => {
      expect(calculateTotal(mockExpenses)).toBe(180);
    });

    it('should return 0 for empty expenses', () => {
      expect(calculateTotal([])).toBe(0);
    });
  });

  describe('calculateByCategory', () => {
    it('should calculate spending by category', () => {
      const result = calculateByCategory(mockExpenses, mockCategories);
      expect(result.food).toBe(150);
      expect(result.transport).toBe(30);
    });

    it('should initialize all categories with 0', () => {
      const result = calculateByCategory([], mockCategories);
      expect(result.food).toBe(0);
      expect(result.transport).toBe(0);
    });
  });

  describe('getTopCategories', () => {
    it('should return top categories sorted by amount', () => {
      const result = getTopCategories(mockExpenses, mockCategories, 5);
      expect(result.length).toBe(2);
      expect(result[0].amount).toBe(150);
      expect(result[0].category.id).toBe('food');
      expect(result[1].amount).toBe(30);
      expect(result[1].category.id).toBe('transport');
    });

    it('should respect limit parameter', () => {
      const result = getTopCategories(mockExpenses, mockCategories, 1);
      expect(result.length).toBe(1);
    });

    it('should return empty array for no expenses', () => {
      const result = getTopCategories([], mockCategories, 5);
      expect(result.length).toBe(0);
    });
  });

  describe('getAverageDailySpending', () => {
    it('should calculate average daily spending', () => {
      const result = getAverageDailySpending(mockExpenses);
      expect(result).toBe(60); // 180 / 3 days
    });

    it('should return 0 for empty expenses', () => {
      expect(getAverageDailySpending([])).toBe(0);
    });
  });

  describe('getAverageTransaction', () => {
    it('should calculate average transaction amount', () => {
      const result = getAverageTransaction(mockExpenses);
      expect(result).toBe(60); // 180 / 3 transactions
    });

    it('should return 0 for empty expenses', () => {
      expect(getAverageTransaction([])).toBe(0);
    });
  });

  describe('getHighestCategory', () => {
    it('should return highest spending category', () => {
      const result = getHighestCategory(mockExpenses, mockCategories);
      expect(result?.category.id).toBe('food');
      expect(result?.amount).toBe(150);
    });

    it('should return null for empty expenses', () => {
      const result = getHighestCategory([], mockCategories);
      expect(result).toBeNull();
    });
  });

  describe('filterByCategory', () => {
    it('should filter expenses by category', () => {
      const result = filterByCategory(mockExpenses, 'food');
      expect(result.length).toBe(2);
      expect(result.every(e => e.category === 'food')).toBe(true);
    });

    it('should return empty array for non-existent category', () => {
      const result = filterByCategory(mockExpenses, 'nonexistent');
      expect(result.length).toBe(0);
    });
  });

  describe('sortByDateDesc', () => {
    it('should sort expenses by date descending', () => {
      const result = sortByDateDesc(mockExpenses);
      expect(result[0].date).toBe('2026-03-03');
      expect(result[1].date).toBe('2026-03-02');
      expect(result[2].date).toBe('2026-03-01');
    });
  });

  describe('getDailyTotals', () => {
    it('should calculate daily totals', () => {
      const result = getDailyTotals(mockExpenses);
      expect(result['2026-03-01']).toBe(50);
      expect(result['2026-03-02']).toBe(30);
      expect(result['2026-03-03']).toBe(100);
    });

    it('should handle multiple expenses on same day', () => {
      const expenses: Expense[] = [
        { id: '1', amount: 50, category: 'food', date: '2026-03-01', createdAt: 1000 },
        { id: '2', amount: 30, category: 'food', date: '2026-03-01', createdAt: 2000 },
      ];
      const result = getDailyTotals(expenses);
      expect(result['2026-03-01']).toBe(80);
    });
  });

  describe('getMonthYear', () => {
    it('should extract month and year from date', () => {
      const result = getMonthYear('2026-03-15');
      expect(result.year).toBe(2026);
      expect([2, 3]).toContain(result.month);
    });
  });

  describe('getMonthRange', () => {
    it('should return first and last day of month', () => {
      const result = getMonthRange(2, 2026); // March 2026
      expect(result.start).toMatch(/^2026-03-0[1-2]$/);
      expect(result.end).toMatch(/^2026-03-3[01]$/);
    });
  });

  describe('getMonthName', () => {
    it('should return month name', () => {
      expect(getMonthName(0)).toBe('January');
      expect(getMonthName(2)).toBe('March');
      expect(getMonthName(11)).toBe('December');
    });

    it('should return Unknown for invalid month', () => {
      expect(getMonthName(12)).toBe('Unknown');
    });
  });
});
