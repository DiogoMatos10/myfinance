'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/components/providers/auth-provider';
import { useI18n } from '@/components/providers/i18n-provider';
import { useCategories } from '@/lib/hooks/use-categories';
import { useTransactions } from '@/lib/hooks/use-transactions';
import {
  createBalanceSchema,
  createCategorySchema,
  createTransactionSchema,
} from '@/lib/validations/finance';
import type {
  BalanceInput,
  CategoryInput,
  TransactionInput as TransactionFormInput,
} from '@/lib/validations/finance';
import type { TransactionInput } from '@/types/transaction';
import { setInitialBalance } from '@/lib/services/report-service';
import {
  IncomeExpenseChart,
  ExpenseByCategoryChart,
} from '@/components/charts/finance-charts';

export default function TransactionsPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const userId = user?.uid;
  const { categories, createCategory } = useCategories(userId);
  const { transactions, summary, createTransaction } = useTransactions(userId);
  const [balanceSuccess, setBalanceSuccess] = useState('');
  const [categorySuccess, setCategorySuccess] = useState('');
  const [transactionSuccess, setTransactionSuccess] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const balanceSchema = useMemo(() => createBalanceSchema(t), [t]);
  const categorySchema = useMemo(() => createCategorySchema(t), [t]);
  const transactionSchema = useMemo(() => createTransactionSchema(t), [t]);

  const balanceForm = useForm<BalanceInput>({
    resolver: zodResolver(balanceSchema),
    defaultValues: { initialBalance: 0 },
  });

  const categoryForm = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '', type: 'expense', color: '#2563eb' },
  });

  const transactionForm = useForm<TransactionFormInput>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      categoryId: '',
      categoryName: '',
      amount: 0,
      date: new Date().toISOString().slice(0, 10),
      description: '',
    },
  });

  const categoryOptions = useMemo(
    () =>
      categories.map(category => ({
        value: category.id,
        label: category.name,
        type: category.type,
        color: category.color,
      })),
    [categories]
  );

  const onSaveBalance = async (data: BalanceInput) => {
    if (!userId) return;
    await setInitialBalance(userId, data.initialBalance);
    setBalanceSuccess(t('finance.balanceSaved'));
    setTimeout(() => setBalanceSuccess(''), 2500);
  };

  const onCreateCategory = async (data: CategoryInput) => {
    await createCategory(data);
    categoryForm.reset();
    setCategorySuccess(t('finance.categorySaved'));
    setTimeout(() => setCategorySuccess(''), 2500);
  };

  const onCreateTransaction = async (data: TransactionFormInput) => {
    const selected = categoryOptions.find(
      item => item.value === data.categoryId
    );
    const input: TransactionInput = {
      ...data,
      categoryName: selected?.label ?? data.categoryName ?? '',
      receiptFile,
    };
    await createTransaction(input);
    transactionForm.reset({
      type: 'expense',
      categoryId: '',
      categoryName: '',
      amount: 0,
      date: new Date().toISOString().slice(0, 10),
      description: '',
    });
    setReceiptFile(null);
    setTransactionSuccess(t('finance.transactionSaved'));
    setTimeout(() => setTransactionSuccess(''), 2500);
  };

  const expenseChartData = Object.entries(summary.byCategory).map(
    ([name, value]) => ({
      name,
      value,
      color: categories.find(cat => cat.name === name)?.color,
    })
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">{t('finance.title')}</h2>
        <p className="text-gray-600 mt-2">{t('finance.subtitle')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t('finance.totalIncome')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{summary.income.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('finance.totalExpenses')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{summary.expenses.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('finance.netBalance')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{summary.balance.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('finance.incomeVsExpenses')}</CardTitle>
          </CardHeader>
          <CardContent>
            <IncomeExpenseChart
              income={summary.income}
              expenses={summary.expenses}
              incomeLabel={t('finance.typeIncome')}
              expenseLabel={t('finance.typeExpense')}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('finance.expensesByCategory')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpenseByCategoryChart data={expenseChartData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t('finance.initialBalance')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form
              onSubmit={balanceForm.handleSubmit(onSaveBalance)}
              className="space-y-3"
            >
              <div className="space-y-2">
                <Label htmlFor="initialBalance">
                  {t('finance.balanceLabel')}
                </Label>
                <Input
                  id="initialBalance"
                  type="number"
                  step="0.01"
                  {...balanceForm.register('initialBalance', {
                    valueAsNumber: true,
                  })}
                />
                {balanceForm.formState.errors.initialBalance && (
                  <p className="text-sm text-red-600">
                    {balanceForm.formState.errors.initialBalance.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full">
                {t('finance.saveBalance')}
              </Button>
            </form>
            {balanceSuccess && (
              <p className="text-sm text-green-600">{balanceSuccess}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('finance.addCategory')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form
              onSubmit={categoryForm.handleSubmit(onCreateCategory)}
              className="space-y-3"
            >
              <div className="space-y-2">
                <Label htmlFor="categoryName">
                  {t('finance.categoryLabel')}
                </Label>
                <Input id="categoryName" {...categoryForm.register('name')} />
                {categoryForm.formState.errors.name && (
                  <p className="text-sm text-red-600">
                    {categoryForm.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryType">
                  {t('finance.categoryType')}
                </Label>
                <select
                  id="categoryType"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...categoryForm.register('type')}
                >
                  <option value="income">{t('finance.categoryIncome')}</option>
                  <option value="expense">
                    {t('finance.categoryExpense')}
                  </option>
                  <option value="both">{t('finance.categoryBoth')}</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryColor">
                  {t('finance.categoryColor')}
                </Label>
                <Input
                  id="categoryColor"
                  type="color"
                  {...categoryForm.register('color')}
                />
              </div>
              <Button type="submit" className="w-full">
                {t('finance.saveCategory')}
              </Button>
            </form>
            {categorySuccess && (
              <p className="text-sm text-green-600">{categorySuccess}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('finance.addTransaction')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form
              onSubmit={transactionForm.handleSubmit(onCreateTransaction)}
              className="space-y-3"
            >
              <div className="space-y-2">
                <Label htmlFor="transactionType">
                  {t('finance.typeLabel')}
                </Label>
                <select
                  id="transactionType"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...transactionForm.register('type')}
                >
                  <option value="income">{t('finance.typeIncome')}</option>
                  <option value="expense">{t('finance.typeExpense')}</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="transactionCategory">
                  {t('finance.categoryLabel')}
                </Label>
                <select
                  id="transactionCategory"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...transactionForm.register('categoryId')}
                >
                  <option value="">{t('finance.categoryPlaceholder')}</option>
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {transactionForm.formState.errors.categoryId && (
                  <p className="text-sm text-red-600">
                    {transactionForm.formState.errors.categoryId.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="transactionAmount">
                  {t('finance.amountLabel')}
                </Label>
                <Input
                  id="transactionAmount"
                  type="number"
                  step="0.01"
                  {...transactionForm.register('amount', {
                    valueAsNumber: true,
                  })}
                />
                {transactionForm.formState.errors.amount && (
                  <p className="text-sm text-red-600">
                    {transactionForm.formState.errors.amount.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="transactionDate">
                  {t('finance.dateLabel')}
                </Label>
                <Input
                  id="transactionDate"
                  type="date"
                  {...transactionForm.register('date')}
                />
                {transactionForm.formState.errors.date && (
                  <p className="text-sm text-red-600">
                    {transactionForm.formState.errors.date.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="transactionDescription">
                  {t('finance.descriptionLabel')}
                </Label>
                <Input
                  id="transactionDescription"
                  {...transactionForm.register('description')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transactionReceipt">
                  {t('finance.receiptLabel')}
                </Label>
                <Input
                  id="transactionReceipt"
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={event =>
                    setReceiptFile(event.target.files?.[0] ?? null)
                  }
                />
              </div>
              <Button type="submit" className="w-full">
                {t('finance.saveTransaction')}
              </Button>
            </form>
            {transactionSuccess && (
              <p className="text-sm text-green-600">{transactionSuccess}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('finance.transactions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('finance.tableDate')}</TableHead>
                <TableHead>{t('finance.tableType')}</TableHead>
                <TableHead>{t('finance.tableCategory')}</TableHead>
                <TableHead>{t('finance.tableAmount')}</TableHead>
                <TableHead>{t('finance.tableDescription')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map(transaction => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>
                    {transaction.type === 'income'
                      ? t('finance.typeIncome')
                      : t('finance.typeExpense')}
                  </TableCell>
                  <TableCell>{transaction.categoryName}</TableCell>
                  <TableCell>€{transaction.amount.toFixed(2)}</TableCell>
                  <TableCell>{transaction.description || '-'}</TableCell>
                </TableRow>
              ))}
              {transactions.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-sm text-gray-500"
                  >
                    {t('finance.emptyTransactions')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
