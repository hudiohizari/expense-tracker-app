# Expense Tracker App - TODO

## Core Features

- [x] Home Screen (Dashboard) with monthly summary and recent expenses
- [x] Add Expense Screen with form validation
- [x] Expense List Screen with filtering and search
- [x] Expense Detail Screen with edit/delete functionality
- [x] Reports Screen with charts and analytics
- [x] Category Management Screen
- [x] Settings Screen with preferences
- [x] Tab bar navigation setup

## Data Management

- [x] AsyncStorage integration for local persistence
- [x] Expense data model and schema
- [x] Category data model and schema
- [x] CRUD operations for expenses
- [x] CRUD operations for categories
- [x] Data export functionality
- [x] Data import functionality

## UI Components

- [x] Expense list item component
- [x] Category selector component
- [x] Summary card component
- [x] Chart components (pie, line, bar)
- [x] Date picker integration
- [x] Amount input with currency formatting
- [x] Filter/sort UI controls

## Analytics & Reports

- [x] Monthly spending summary calculation
- [x] Category breakdown calculation
- [x] Spending trend analysis
- [x] Top categories ranking
- [ ] Budget tracking (optional)

## Polish & Testing

- [x] Dark mode support
- [x] Responsive layout testing
- [x] Error handling and validation
- [x] Loading states and skeletons
- [x] Haptic feedback integration
- [x] App icon and branding
- [x] Performance optimization (removed redundant providers/server logic)
- [x] Modernize Safe Area handling (`react-native-safe-area-context`)
- [x] Implement dynamic font sizing for stats
- [x] Fix keyboard obscuring content on form screens
- [x] Migrate to fully local-only architecture (Removed server/tRPC)

## Phase 4: Local Persistence & Multi-Currency (Recent)

- [x] AsyncStorage integration for local persistence
- [x] Add light/dark mode toggle in Settings
- [x] Add IDR currency to currency list
- [x] Multi-currency support
- [x] Test light/dark mode across all screens
- [x] Verify IDR currency formatting
- [x] Fix redundant bottom padding in tab screens
