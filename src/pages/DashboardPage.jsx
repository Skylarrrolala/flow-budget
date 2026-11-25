import { useState, useEffect } from 'react';
import {
  PieChart, Pie, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from 'recharts';
import { formatMoney } from '../lib/money';

const TXN_KEY = 'flowbudget_transactions';

function loadTransactions() {
  try {
    const data = localStorage.getItem(TXN_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// colors for the pie chart slices
const COLORS = [
  '#e74c3c', '#3498db', '#2ecc71', '#f39c12',
  '#9b59b6', '#1abc9c', '#e67e22', '#34495e',
  '#e91e63',
];

export default function DashboardPage({ currency = 'USD' }) {
  const [transactions, setTransactions] = useState([]);

  // load transactions on mount
  useEffect(() => {
    setTransactions(loadTransactions());
  }, []);

  // split into income and expense
  const expenses = transactions.filter((t) => t.type === 'expense');
  const incomes = transactions.filter((t) => t.type === 'income');

  const totalExpense = expenses.reduce((sum, t) => sum + t.amountMinor, 0);
  const totalIncome = incomes.reduce((sum, t) => sum + t.amountMinor, 0);

  // group expenses by category for pie chart
  const expenseByCategory = {};
  expenses.forEach((t) => {
    if (!expenseByCategory[t.category]) {
      expenseByCategory[t.category] = 0;
    }
    expenseByCategory[t.category] += t.amountMinor;
  });

  const pieData = Object.entries(expenseByCategory).map(
    ([name, value]) => ({ name, value })
  );

  // group by month for bar chart
  const monthlyData = {};
  transactions.forEach((t) => {
    const month = t.date.slice(0, 7);
    if (!monthlyData[month]) {
      monthlyData[month] = { month, income: 0, expense: 0 };
    }
    if (t.type === 'income') {
      monthlyData[month].income += t.amountMinor;
    } else {
      monthlyData[month].expense += t.amountMinor;
    }
  });

  // convert to array and sort by month
  const barData = Object.values(monthlyData)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((d) => ({
      month: d.month,
      Income: currency === 'KHR' ? d.income : d.income / 100,
      Expense: currency === 'KHR' ? d.expense : d.expense / 100,
    }));

  // convert pie values and add colors directly to data
  const pieDisplay = pieData.map((d, index) => ({
    ...d,
    value: currency === 'KHR' ? d.value : d.value / 100,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <div>
      <h2>Dashboard</h2>

      {/* summary totals */}
      <div>
        <p>Total Income: {formatMoney(totalIncome, currency)}</p>
        <p>Total Expenses: {formatMoney(totalExpense, currency)}</p>
        <p>
          Net: {formatMoney(Math.abs(totalIncome - totalExpense), currency)}
          {totalIncome >= totalExpense ? ' surplus' : ' deficit'}
        </p>
      </div>

      {transactions.length === 0 && (
        <p>No transactions yet. Add some to see charts!</p>
      )}

      {/* expense breakdown pie chart */}
      {pieDisplay.length > 0 && (
        <div>
          <h3>Expense Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieDisplay}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              />
              <Tooltip
                formatter={(val) => formatMoney(
                  currency === 'KHR' ? val : Math.round(val * 100),
                  currency
                )}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* income vs expense bar chart */}
      {barData.length > 0 && (
        <div>
          <h3>Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(val) => formatMoney(
                  currency === 'KHR' ? val : Math.round(val * 100),
                  currency
                )}
              />
              <Legend />
              <Bar dataKey="Income" fill="#2ecc71" />
              <Bar dataKey="Expense" fill="#e74c3c" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}