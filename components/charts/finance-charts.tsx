'use client';

import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface CategoryBreakdownProps {
  data: Array<{ name: string; value: number; color?: string }>;
}

interface IncomeExpenseProps {
  income: number;
  expenses: number;
  incomeLabel: string;
  expenseLabel: string;
}

const defaultColors = ['#2563eb', '#16a34a', '#dc2626', '#9333ea', '#f97316'];

export function IncomeExpenseChart({
  income,
  expenses,
  incomeLabel,
  expenseLabel,
}: IncomeExpenseProps) {
  const chartData = [
    { name: incomeLabel, value: income },
    { name: expenseLabel, value: expenses },
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} barSize={48}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ExpenseByCategoryChart({ data }: CategoryBreakdownProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={50}
            outerRadius={90}
            paddingAngle={4}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={
                  entry.color ?? defaultColors[index % defaultColors.length]
                }
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
