import { useFinance } from '../context/FinanceContext';
import {
  PieChart, Pie, Tooltip, Legend, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from 'recharts';
import { formatMoney } from '../lib/money';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';

const COLORS = [
  '#3b82f6', '#ef4444', '#22c55e', '#f59e0b',
  '#8b5cf6', '#06b6d4', '#f97316', '#64748b',
  '#ec4899',
];

export default function DashboardPage({ currency = 'USD' }) {
  const { transactions } = useFinance();

  const expenses = transactions.filter((t) => t.type === 'expense');
  const incomes = transactions.filter((t) => t.type === 'income');
  const totalExpense = expenses.reduce((sum, t) => sum + t.amountMinor, 0);
  const totalIncome = incomes.reduce((sum, t) => sum + t.amountMinor, 0);
  const net = totalIncome - totalExpense;

  const expenseByCategory = {};
  expenses.forEach((t) => {
    if (!expenseByCategory[t.category]) expenseByCategory[t.category] = 0;
    expenseByCategory[t.category] += t.amountMinor;
  });

  const pieData = Object.entries(expenseByCategory).map(([name, value]) => ({
    name,
    value: currency === 'KHR' ? value : value / 100,
  }));

  const monthlyData = {};
  transactions.forEach((t) => {
    const month = t.date.slice(0, 7);
    if (!monthlyData[month]) monthlyData[month] = { month, income: 0, expense: 0 };
    if (t.type === 'income') monthlyData[month].income += t.amountMinor;
    else monthlyData[month].expense += t.amountMinor;
  });

  const barData = Object.values(monthlyData)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((d) => ({
      month: d.month,
      Income: currency === 'KHR' ? d.income : d.income / 100,
      Expense: currency === 'KHR' ? d.expense : d.expense / 100,
    }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <p className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wide mb-1">Income</p>
          <p className="text-xl font-bold text-success-600 dark:text-success-500">{formatMoney(totalIncome, currency)}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wide mb-1">Expenses</p>
          <p className="text-xl font-bold text-danger-500">{formatMoney(totalExpense, currency)}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wide mb-1">Net Balance</p>
          <p className={`text-xl font-bold ${net >= 0 ? 'text-success-600 dark:text-success-500' : 'text-danger-500'}`}>
            {net >= 0 ? '+' : '-'}{formatMoney(Math.abs(net), currency)}
          </p>
        </Card>
      </div>

      {transactions.length === 0 ? (
        <EmptyState
          icon="📊"
          title="No transactions yet"
          description="Add some transactions to see your financial overview."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {pieData.length > 0 && (
            <Card>
              <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-4">Expense Breakdown</h2>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => formatMoney(currency === 'KHR' ? val : Math.round(val * 100), currency)}
                    contentStyle={{ backgroundColor: 'var(--color-surface-800)', border: 'none', borderRadius: '8px', color: '#fff' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          )}

          {barData.length > 0 && (
            <Card>
              <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-4">Income vs Expenses</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-surface-700)" />
                  <XAxis dataKey="month" tick={{ fill: 'var(--color-surface-400)', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'var(--color-surface-400)', fontSize: 12 }} />
                  <Tooltip
                    formatter={(val) => formatMoney(currency === 'KHR' ? val : Math.round(val * 100), currency)}
                    contentStyle={{ backgroundColor: 'var(--color-surface-800)', border: 'none', borderRadius: '8px', color: '#fff' }}
                  />
                  <Legend />
                  <Bar dataKey="Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
