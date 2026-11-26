import { useFinance } from '../context/FinanceContext';
import {
  PieChart, Pie, Tooltip, Legend, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from 'recharts';
import { formatMoney } from '../lib/money';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';

const COLORS = [
  '#c1d9cb', '#e7b45d', '#ef8878', '#9ca7ad',
  '#91b5a2', '#b69bce', '#78aeb0', '#d2a17b',
  '#d38fa3',
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
      <PageHeader
        title="Overview"
        description="A clear picture of where your money is going."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Income"
          value={formatMoney(totalIncome, currency)}
          detail="Across all recorded transactions"
          tone="positive"
        />
        <StatCard
          label="Expenses"
          value={formatMoney(totalExpense, currency)}
          detail="Across all recorded transactions"
          tone="negative"
        />
        <StatCard
          label="Net balance"
          value={`${net >= 0 ? '+' : '-'}${formatMoney(Math.abs(net), currency)}`}
          detail="Income minus expenses"
          tone={net >= 0 ? 'positive' : 'negative'}
        />
      </div>

      {transactions.length === 0 ? (
        <EmptyState
          icon="dashboard"
          title="No transactions yet"
          description="Add some transactions to see your financial overview."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {pieData.length > 0 && (
            <Card>
              <h2 className="text-base font-semibold text-surface-900 dark:text-surface-50 mb-4">Expense breakdown</h2>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={88}
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
              <h2 className="text-base font-semibold text-surface-900 dark:text-surface-50 mb-4">Income vs expenses</h2>
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
                  <Bar dataKey="Income" fill="#a7d2b7" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Expense" fill="#ef8878" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
