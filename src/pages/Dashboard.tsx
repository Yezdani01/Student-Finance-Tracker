import { motion } from 'framer-motion'
import { StatCard } from '@/components/Dashboard/StatCard'
import { ExpenseChart } from '@/components/Dashboard/ExpenseChart'
import { IncomeExpenseChart } from '@/components/Dashboard/IncomeExpenseChart'
import { BudgetProgress } from '@/components/Dashboard/BudgetProgress'
import { SavingsGoalTracker } from '@/components/Dashboard/SavingsGoalTracker'
import { RecentTransactions } from '@/components/Dashboard/RecentTransactions'
import { useFinance } from '@/contexts/FinanceContext'
import { DollarSign, TrendingUp, TrendingDown, Target, Award } from 'lucide-react'

export function Dashboard() {
  const { transactions, budgets, savingsGoals, achievements } = useFinance()

  // Calculate stats
  const currentMonth = new Date().toISOString().slice(0, 7)
  const thisMonthTransactions = transactions.filter(t => t.date.startsWith(currentMonth))
  
  const totalIncome = thisMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
    
  const totalExpenses = thisMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
    
  const balance = totalIncome - totalExpenses
  
  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const budgetRemaining = totalBudget - totalSpent
  
  const completedGoals = savingsGoals.filter(g => g.current >= g.target).length
  const earnedAchievements = achievements.filter(a => a.earned).length

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-6"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Welcome to Your Finance Dashboard
        </h1>
        <p className="text-muted-foreground">
          Track your spending, manage budgets, and achieve your financial goals
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Monthly Balance"
          value={`₹${balance.toFixed(2)}`}
          change={balance >= 0 ? '+' : ''}
          icon={DollarSign}
          color="blue"
          index={0}
        />
        <StatCard
          title="Income This Month"
          value={`₹${totalIncome.toFixed(2)}`}
          icon={TrendingUp}
          color="green"
          index={1}
        />
        <StatCard
          title="Expenses This Month"
          value={`₹${totalExpenses.toFixed(2)}`}
          icon={TrendingDown}
          color="red"
          index={2}
        />
        <StatCard
          title="Budget Remaining"
          value={`₹${budgetRemaining.toFixed(2)}`}
          icon={Target}
          color={budgetRemaining >= 0 ? 'green' : 'red'}
          index={3}
        />
      </div>

      {/* Achievement Bar */}
      {earnedAchievements > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-lg text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Award className="h-6 w-6" />
            <span className="font-semibold text-lg">Achievement Progress</span>
          </div>
          <p>
            You've earned {earnedAchievements} out of {achievements.length} achievements! 
            {completedGoals > 0 && ` Plus ${completedGoals} completed savings goals! 🎯`}
          </p>
        </motion.div>
      )}

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <ExpenseChart />
        <IncomeExpenseChart />
      </div>

      {/* Budget and Goals */}
      <div className="grid gap-6 lg:grid-cols-2">
        <BudgetProgress />
        <SavingsGoalTracker />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions />
    </div>
  )
}