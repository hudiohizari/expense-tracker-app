# Expense Tracker & Report App - Design Document

## Overview
A mobile-first expense tracking application that allows users to log daily expenses, categorize them, and view comprehensive reports with visual analytics.

## Screen List

### 1. **Home Screen (Dashboard)**
Main entry point showing expense overview and quick actions.

### 2. **Add Expense Screen**
Form to record a new expense with amount, category, date, and optional notes.

### 3. **Expense List Screen**
Chronological list of all expenses with filtering and search capabilities.

### 4. **Expense Detail Screen**
View, edit, or delete individual expense entries.

### 5. **Reports Screen**
Visual analytics showing:
- Monthly summary with total spending
- Category breakdown (pie/bar chart)
- Spending trends over time
- Top spending categories

### 6. **Category Management Screen**
Create, edit, and delete expense categories with custom colors.

### 7. **Settings Screen**
App preferences, currency selection, data export/import.

## Primary Content and Functionality

### Home Screen (Dashboard)
- **Header**: Current month/year with navigation arrows
- **Summary Cards**: 
  - Total spent this month
  - Remaining budget (if set)
  - Average daily spending
- **Recent Expenses List**: Last 5-7 expenses with category icon, amount, and date
- **Quick Actions**: 
  - Floating Action Button (FAB) to add new expense
  - Tap to navigate to Reports or Categories

### Add Expense Screen
- **Input Fields**:
  - Amount (numeric input with currency symbol)
  - Category (dropdown/picker with icons)
  - Date (date picker, defaults to today)
  - Notes (optional text field)
- **Action Buttons**:
  - Save (primary button)
  - Cancel (secondary button)
- **Validation**: Amount required, category required

### Expense List Screen
- **Filter/Sort Options**: By category, date range, amount
- **Search Bar**: Quick search by notes or category
- **List Items**: 
  - Category icon + name
  - Amount (right-aligned, color-coded by category)
  - Date
  - Tap to view/edit details
- **Pull-to-Refresh**: Reload expense list

### Reports Screen
- **Time Period Selector**: Month/Year picker
- **Summary Cards**:
  - Total spending
  - Highest category
  - Average transaction
- **Charts**:
  - Category breakdown (pie chart)
  - Daily spending trend (line chart)
  - Top categories (bar chart)
- **Export Option**: Share or download report as PDF/CSV

### Category Management
- **Category List**: All categories with color indicators
- **Add Category Button**: Create new category with name and color
- **Edit/Delete**: Swipe or long-press to manage categories

### Settings Screen
- **Preferences**:
  - Currency selection
  - Date format
  - Theme (light/dark)
- **Data Management**:
  - Export data
  - Import data
  - Clear all data (with confirmation)
- **About**: App version and info

## Key User Flows

### Flow 1: Add Expense
1. User taps FAB on Home Screen
2. Add Expense Screen opens
3. User enters amount, selects category, optionally adds notes
4. User taps Save
5. Expense is saved, screen closes, Home Screen updates

### Flow 2: View Reports
1. User navigates to Reports tab
2. Current month data loads with charts
3. User can change month/year to view historical data
4. User can tap on chart segments to drill down
5. User can export report

### Flow 3: Manage Expenses
1. User navigates to Expense List
2. User scrolls through expenses or uses search/filter
3. User taps an expense to view details
4. User can edit or delete the expense
5. Changes are saved immediately

### Flow 4: Customize Categories
1. User navigates to Settings → Categories
2. User can add new category with custom color
3. User can edit existing category
4. User can delete category (with confirmation if expenses exist)
5. Changes apply to all expenses

## Color Choices

### Brand Palette
- **Primary**: `#0a7ea4` (Teal blue - main actions, headers)
- **Success**: `#22C55E` (Green - income, positive trends)
- **Warning**: `#F59E0B` (Amber - budget alerts)
- **Error**: `#EF4444` (Red - overspending, delete actions)
- **Background**: `#ffffff` (Light) / `#151718` (Dark)
- **Surface**: `#f5f5f5` (Light) / `#1e2022` (Dark)
- **Text**: `#11181C` (Light) / `#ECEDEE` (Dark)

### Category Colors (Preset)
- **Food**: `#FF6B6B` (Red)
- **Transport**: `#4ECDC4` (Teal)
- **Entertainment**: `#FFE66D` (Yellow)
- **Shopping**: `#95E1D3` (Mint)
- **Utilities**: `#C7CEEA` (Lavender)
- **Health**: `#FF8B94` (Pink)
- **Other**: `#B4A7D6` (Purple)

## Layout Principles

### Mobile Portrait (9:16) Optimization
- **One-handed usage**: All interactive elements within thumb reach (bottom 2/3 of screen)
- **Safe area**: Content respects notch and home indicator
- **Touch targets**: Minimum 44pt for interactive elements
- **Spacing**: Consistent 8pt/16pt grid for padding and margins

### Navigation
- **Tab Bar**: Bottom navigation with 4-5 tabs (Home, Expenses, Reports, Categories, Settings)
- **Modal Sheets**: For secondary actions (add category, edit expense)
- **Back Navigation**: Standard iOS back button or swipe gesture

### Typography
- **Headers**: 24pt bold (screen titles)
- **Subheaders**: 18pt semibold (section titles)
- **Body**: 16pt regular (primary content)
- **Caption**: 12pt regular (secondary info, dates)

### Visual Hierarchy
- **Emphasis**: Use color, size, and weight to guide attention
- **Cards**: Subtle shadows and borders for surface elevation
- **Icons**: Consistent 24pt size for list items, 32pt for headers
- **Whitespace**: Generous margins between sections for clarity

## Interaction Patterns

### Feedback
- **Press States**: 0.97 scale + haptic feedback for buttons
- **Loading**: Spinner or skeleton screens during data fetch
- **Success**: Toast notification or inline confirmation
- **Errors**: Alert dialog with retry option

### Gestures
- **Swipe Left**: Delete or archive expense (with undo)
- **Swipe Right**: Open quick actions menu
- **Long Press**: Select multiple items or show context menu
- **Pull-to-Refresh**: Reload expense list

## Data Persistence
- **Local Storage**: AsyncStorage for expenses, categories, and preferences
- **Optional Cloud Sync**: Future feature for multi-device support
- **Backup**: Export/import functionality for data portability
