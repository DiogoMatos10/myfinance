# Finance Feature Documentation

## Overview

The finance feature provides a complete workflow for tracking an initial balance, managing categories, recording income/expense transactions, and visualizing totals through charts. It is built with shadcn/ui and Tailwind CSS on the client and backed by Firebase Auth, Firestore, and optional Storage for receipt uploads.

## Pages

### `app/(root)/transactions/page.tsx`

The main workspace for finance data.

- **Sections**: summary cards (income, expenses, net balance), charts, initial balance form, category form, transaction form, and transaction table.
- **Forms**: use React Hook Form + Zod validation.
- **Charts**: Recharts for income vs expenses and expenses by category.
- **Uploads**: optional receipt file input, stored in Firebase Storage.

### `app/(root)/page.tsx`

The dashboard includes navigation buttons to the finance workspace and settings.

## Data Model

### Transactions (`types/transaction.ts`)

```
Transaction
- id: string
- userId: string
- type: 'income' | 'expense'
- categoryId: string
- categoryName: string
- amount: number
- date: string (YYYY-MM-DD)
- description?: string
- receiptUrl?: string
- createdAt?: string
- updatedAt?: string

TransactionInput
- type: 'income' | 'expense'
- categoryId: string
- categoryName?: string
- amount: number
- date: string
- description?: string
- receiptFile?: File | null
```

### Categories (`types/category.ts`)

```
Category
- id: string
- userId: string
- name: string
- type: 'income' | 'expense' | 'both'
- color?: string
- createdAt?: string
- updatedAt?: string

CategoryInput
- name: string
- type: 'income' | 'expense' | 'both'
- color?: string
```

### User Profile (`lib/firebase/auth.ts`, `types/user.ts`)

```
UserData/UserProfile
- initialBalance?: number
```

## Firestore Structure

Collections are scoped per user:

```
users/{uid}
  - initialBalance
  - preferences
  - ...
  transactions/{transactionId}
  categories/{categoryId}
```

## API Endpoints

### `GET /api/transactions?userId={uid}`

Returns all transactions for the user, ordered by date descending.

### `POST /api/transactions`

Creates a transaction.
**Body**:

- `userId`, `type`, `categoryId`, `categoryName`, `amount`, `date`
- optional: `description`, `receiptUrl`

### `PUT /api/transactions/[id]`

Updates a transaction for a user.
**Body** must include `userId` and any fields to update.

### `DELETE /api/transactions/[id]?userId={uid}`

Deletes a transaction by id and user.

## Services

### `lib/services/transaction-service.ts`

- `fetchTransactions(userId)`
- `addTransaction(userId, input)` (uploads receipts if provided)

### `lib/services/category-service.ts`

- `fetchCategories(userId)`
- `addCategory(userId, input)`

### `lib/services/report-service.ts`

- `fetchInitialBalance(userId)`
- `setInitialBalance(userId, initialBalance)`

### `lib/services/upload-service.ts`

- `uploadReceipt(userId, file)` → returns storage URL.

## Hooks

### `lib/hooks/use-transactions.ts`

- Fetches user transactions and exposes summary totals.
- `summary`: `{ income, expenses, balance, byCategory }`

### `lib/hooks/use-categories.ts`

- Loads and creates category entries per user.

## Validation

### `lib/validations/finance.ts`

- `createBalanceSchema`
- `createCategorySchema`
- `createTransactionSchema`

### `lib/validations/zod.ts`

Formats Zod errors into `{ message, fieldErrors }` for API responses.

## Charts

### `components/charts/finance-charts.tsx`

- **Income vs Expenses**: bar chart.
- **Expenses by Category**: donut/pie chart.

## Optional Storage (Receipts)

Receipts are stored in Firebase Storage under:

```
users/{uid}/receipts/{timestamp}-{filename}
```

## Permissions

Use Firestore rules to ensure only the authenticated user can read/write their documents and subcollections (users/{uid}/transactions, users/{uid}/categories).
